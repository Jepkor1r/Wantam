import { desc, eq } from "drizzle-orm";
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
import { latestInsights } from "@wantam/insights";
import type { BoardState } from "@wantam/shared";

const TRADER = () => process.env.DEMO_TRADER_ID ?? "mama-kuku";

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
  const lastMsg = db
    .select()
    .from(outbox)
    .where(eq(outbox.traderId, traderId))
    .orderBy(desc(outbox.at))
    .get();

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
          factors: JSON.parse(snap.factors),
          shared: Boolean(share),
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
    lastReply: lastMsg?.body ?? null,
    updatedAt: Date.now(),
  };
}
