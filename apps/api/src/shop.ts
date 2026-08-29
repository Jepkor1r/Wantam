import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import {
  consentEvent,
  creditShareLog,
  creditSnapshot,
  getDb,
  ledgerEntry,
  outbox,
  savingsGoal,
  sku,
  stockEvent,
  traders,
} from "@wantam/db";
import { rebuildInsights, weekRolls, wowSales } from "@wantam/insights";
import {
  categorizeLedger,
  looksLikeMpesa,
  parseMpesaSms,
  parseStockUtterance,
  scoreCredit,
  type AgentReply,
} from "@wantam/shared";
import { loadState } from "./state";
import { bump } from "./events";

const TRADER = () => process.env.DEMO_TRADER_ID ?? "mama-kuku";

function reply(text: string, events: string[]): AgentReply {
  const traderId = TRADER();
  getDb()
    .insert(outbox)
    .values({ id: randomUUID(), traderId, body: text, at: Date.now() })
    .run();
  bump();
  return { text, events };
}

export function refreshCredit(): void {
  const traderId = TRADER();
  const db = getDb();
  const save = db.select().from(savingsGoal).where(eq(savingsGoal.traderId, traderId)).get();
  const result = scoreCredit(weekRolls(traderId), {
    goalNamed: Boolean(save),
    nudgesAccepted: save && save.balanceKes > 0 ? 1 : 0,
    balanceKes: save?.balanceKes ?? 0,
    targetKes: save?.targetKes ?? 0,
  });
  db.delete(creditSnapshot).where(eq(creditSnapshot.traderId, traderId)).run();
  db.insert(creditSnapshot)
    .values({
      id: randomUUID(),
      traderId,
      score: result.score,
      band: result.band,
      factors: JSON.stringify(result.factors),
      validFrom: Date.now(),
    })
    .run();
}

export function refreshShop(): void {
  rebuildInsights(TRADER());
  refreshCredit();
}

function stockLine(): string {
  const rows = getDb().select().from(sku).where(eq(sku.traderId, TRADER())).all();
  return rows.map((s) => `${s.name}: ${s.onHand} ${s.unit}`).join(". ");
}

function applyDeltas(text: string): AgentReply {
  const db = getDb();
  const traderId = TRADER();
  const intents = parseStockUtterance(text);
  const amb = intents.find((i) => i.kind === "ambiguous");
  if (amb && amb.kind === "ambiguous" && intents.length === 1) {
    return reply(amb.question, ["clarify"]);
  }

  const notes: string[] = [];
  for (const intent of intents) {
    if (intent.kind === "ambiguous") {
      notes.push(intent.question);
      continue;
    }
    const row = db.select().from(sku).where(eq(sku.id, intent.skuId)).get();
    if (!row) continue;
    const next = intent.kind === "set" ? intent.onHand : row.onHand + intent.delta;
    db.update(sku).set({ onHand: next }).where(eq(sku.id, row.id)).run();
    db.insert(stockEvent)
      .values({
        id: randomUUID(),
        traderId,
        skuId: row.id,
        delta: intent.kind === "set" ? next - row.onHand : intent.delta,
        source: "voice",
        rawRef: text.slice(0, 180),
        at: Date.now(),
      })
      .run();
    notes.push(
      intent.kind === "set"
        ? `${row.name} iko ${next}.`
        : `${row.name} ${next} ${row.unit}${next <= row.lowStock ? ` — ${row.name} inakwisha.` : "."}`,
    );
  }

  refreshShop();
  maybeNudge();
  return reply(notes.join(" "), ["stock"]);
}

function postSms(text: string): AgentReply {
  const parsed = parseMpesaSms(text);
  if (!parsed) {
    return reply("SMS haijasomeka. Paste the M-Pesa line with KSh amount.", ["uncategorized"]);
  }
  const cat = categorizeLedger({ dir: parsed.dir, party: parsed.party, text });
  getDb()
    .insert(ledgerEntry)
    .values({
      id: randomUUID(),
      traderId: TRADER(),
      amountKes: parsed.amountKes,
      dir: parsed.dir,
      category: cat.category,
      skuId: cat.skuId,
      mpesaRef: parsed.mpesaRef,
      party: parsed.party,
      at: Date.now(),
    })
    .run();
  refreshShop();
  maybeNudge();
  const tag = cat.skuId ?? cat.category;
  const verb = parsed.dir === "in" ? "from" : "to";
  return reply(
    `KSh ${parsed.amountKes.toLocaleString()} ${verb} ${parsed.party} — tagged ${tag}.`,
    ["ledger"],
  );
}

function maybeNudge(): void {
  const traderId = TRADER();
  const db = getDb();
  const save = db.select().from(savingsGoal).where(eq(savingsGoal.traderId, traderId)).get();
  if (!save || save.pendingNudge) return;
  const rolls = weekRolls(traderId);
  const wow = wowSales(rolls);
  const last = rolls[rolls.length - 1];
  const prev = rolls[rolls.length - 2];
  const squeeze =
    last && prev && prev.incomeKes
      ? last.expenseKes / Math.max(1, last.incomeKes) > prev.expenseKes / prev.incomeKes + 0.05
      : false;
  if (squeeze) return;
  const surplus = last ? last.incomeKes - last.expenseKes : 0;
  if (wow.pct != null && wow.pct >= 15 && surplus >= 500) {
    db.update(savingsGoal)
      .set({
        pendingNudge: "You made 15% more this week — want to set aside 500 KES for restocking?",
      })
      .where(eq(savingsGoal.id, save.id))
      .run();
  }
}

function handleConsent(text: string): AgentReply | null {
  const db = getDb();
  const traderId = TRADER();
  const trader = db.select().from(traders).where(eq(traders.id, traderId)).get();
  const t = text.trim().toUpperCase();
  if (!trader?.consentAt) {
    if (t === "NDIO" || t === "YES") {
      db.update(traders).set({ consentAt: Date.now() }).where(eq(traders.id, traderId)).run();
      db.insert(consentEvent)
        .values({ id: randomUUID(), traderId, kind: "ndio", channel: "whatsapp", at: Date.now() })
        .run();
      return reply("Sawa. Voice notes na SMS zitasoma kwa stock na pesa tu. Hapana share mpaka useme Share.", [
        "consent",
      ]);
    }
    return reply(
      "Duka itasoma voice notes na SMS kwa stock na pesa tu. Hapana share. Reply NDIO.",
      ["consent_prompt"],
    );
  }
  if (t === "HAPANA" && /revoke|stop|hapana/.test(text.toLowerCase())) {
    db.update(traders).set({ consentAt: null }).where(eq(traders.id, traderId)).run();
    db.insert(consentEvent)
      .values({ id: randomUUID(), traderId, kind: "revoked", channel: "whatsapp", at: Date.now() })
      .run();
    return reply("Stopped. Duka haitasoma SMS tena mpaka NDIO.", ["consent"]);
  }
  return null;
}

function handleSavingsReply(text: string): AgentReply | null {
  const db = getDb();
  const save = db.select().from(savingsGoal).where(eq(savingsGoal.traderId, TRADER())).get();
  if (!save?.pendingNudge) return null;
  const t = text.trim().toUpperCase();
  const bareAmount = text.trim().match(/^(\d{2,6})$/);
  if (t === "HAPANA" || t === "NO") {
    db.update(savingsGoal).set({ pendingNudge: null }).where(eq(savingsGoal.id, save.id)).run();
    return reply("Sawa — hakuna kitu imewekwa.", ["savings"]);
  }
  if (t === "NDIO" || t === "YES" || bareAmount) {
    const kes = bareAmount ? Number(bareAmount[1]) : 500;
    db.update(savingsGoal)
      .set({ pendingNudge: null, balanceKes: save.balanceKes + kes })
      .where(eq(savingsGoal.id, save.id))
      .run();
    refreshCredit();
    return reply(`Imewekwa KSh ${kes} kwa ${save.name}. Balance ${save.balanceKes + kes} / ${save.targetKes}.`, [
      "savings",
    ]);
  }
  return null;
}

function shareCredit(): AgentReply {
  const db = getDb();
  const traderId = TRADER();
  const snap = db.select().from(creditSnapshot).where(eq(creditSnapshot.traderId, traderId)).get();
  if (!snap) return reply("Credit file bado haijako ready.", ["credit"]);
  db.insert(creditShareLog)
    .values({
      id: randomUUID(),
      traderId,
      snapshotId: snap.id,
      actor: traderId,
      at: Date.now(),
    })
    .run();
  const factors = JSON.parse(snap.factors) as { label: string; points: number; max: number }[];
  const lines = factors.map((f) => `${f.label} ${f.points}/${f.max}`).join(" · ");
  return reply(
    `SACCO file shared. ${snap.score}/100 — ${snap.band}. ${lines}. Officer: weeks logged, surplus, feed concentration, shelf vs books, savings habit.`,
    ["credit_share"],
  );
}

/** Shop agent: numbers in TypeScript, sentences as templates (LLM optional later). */
export function handleInboundText(text: string): AgentReply {
  const consent = handleConsent(text);
  if (consent) return consent;

  if (/^share\b/i.test(text.trim())) return shareCredit();

  if (looksLikeMpesa(text)) return postSms(text);

  const save = handleSavingsReply(text);
  if (save) return save;

  return applyDeltas(text);
}

export function handleVoiceTranscript(transcript: string): AgentReply {
  const consent = handleConsent(transcript);
  if (consent && consent.events.includes("consent_prompt")) return consent;
  return applyDeltas(transcript);
}
