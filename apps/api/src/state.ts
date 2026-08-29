import { asc, desc, eq } from "drizzle-orm";
import {
  creditShareLog,
  creditSnapshot,
  getDb,
  ledgerEntry,
  outbox,
  savingsGoal,
  sku,
  traders,
} from "@wantam/db";
import { latestInsights, weekRolls } from "@wantam/insights";
import type { BoardState } from "@wantam/shared";

const TRADER = () => process.env.DEMO_TRADER_ID ?? "mama-kuku";

function officerCopy(score: number, band: string, factors: { label: string; points: number; max: number; reason: string }[]) {
  const rolls = weekRolls(TRADER());
  const surplus = rolls.filter((w) => w.incomeKes - w.expenseKes > 0).length;
  const lines = factors.map((f) => `${f.label} ${f.points}/${f.max}`).join(" · ");
  return {
    officerSw: `Faili ya SACCO: ${score}/100 (${band}). Wiki ${rolls.length}, surplus ${surplus}. ${lines}. Hii si uamuzi wa mkopo — ni faili kwa afisa.`,
    officerEn: `SACCO file: ${score}/100 (${band}). ${rolls.length} weeks logged, ${surplus} surplus. ${lines}. Not a loan decision — a file for a human officer.`,
  };
}

export function loadState(): BoardState {
  const traderId = TRADER();
  const db = getDb();
  const trader = db.select().from(traders).where(eq(traders.id, traderId)).get();
  const stockRows = db.select().from(sku).where(eq(sku.traderId, traderId)).all();
  const ledger = db
    .select()
    .from(ledgerEntry)
    .where(eq(ledgerEntry.traderId, traderId))
    .orderBy(desc(ledgerEntry.at))
    .limit(12)
    .all();
  const insights = latestInsights(traderId);
  const briefing = insights.find((i) => i.type === "weekly_briefing");
  const snap = db
    .select()
    .from(creditSnapshot)
    .where(eq(creditSnapshot.traderId, traderId))
    .orderBy(desc(creditSnapshot.validFrom))
    .get();
  const share = snap
    ? db.select().from(creditShareLog).where(eq(creditShareLog.snapshotId, snap.id)).get()
    : undefined;
  const save = db.select().from(savingsGoal).where(eq(savingsGoal.traderId, traderId)).get();
  const chat = db
    .select()
    .from(outbox)
    .where(eq(outbox.traderId, traderId))
    .orderBy(asc(outbox.at))
    .all()
    .slice(-40);
  const lastMsg = [...chat].reverse().find((m) => m.dir === "out");
  const factors = snap
    ? (JSON.parse(snap.factors) as { label: string; points: number; max: number; reason: string }[])
    : [];
  const officer = snap ? officerCopy(snap.score, snap.band, factors) : null;

  return {
    trader: {
      id: traderId,
      name: trader?.name ?? "Mama Kuku Fresh",
      consent: Boolean(trader?.consentAt),
    },
    stock: stockRows.map((s) => ({
      id: s.id,
      name: s.name,
      unit: s.unit,
      onHand: s.onHand,
      lowStock: s.lowStock,
    })),
    ledger: ledger.map((r) => ({
      id: r.id,
      amountKes: r.amountKes,
      dir: r.dir as "in" | "out",
      category: r.category,
      party: r.party,
      skuId: r.skuId,
      at: r.at,
    })),
    briefing: briefing ? { copySw: briefing.copySw, copyEn: briefing.copyEn } : null,
    insights: insights
      .filter((i) => i.type !== "weekly_briefing" && i.type !== "placeholder")
      .map((i) => ({
        type: i.type,
        copySw: i.copySw,
        copyEn: i.copyEn,
        payload: JSON.parse(i.payload),
      })),
    credit: snap
      ? {
          score: snap.score,
          band: snap.band,
          factors,
          shared: Boolean(share),
          officerSw: officer!.officerSw,
          officerEn: officer!.officerEn,
        }
      : null,
    savings: save
      ? {
          name: save.name,
          targetKes: save.targetKes,
          balanceKes: save.balanceKes,
          pendingNudge: save.pendingNudge,
        }
      : null,
    chat: chat.map((m) => ({
      id: m.id,
      dir: (m.dir === "in" ? "in" : "out") as "in" | "out",
      body: m.body,
      at: m.at,
    })),
    lastReply: lastMsg?.body ?? null,
    updatedAt: Date.now(),
  };
}
