import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreCredit, type WeekRoll } from "@wantam/shared";

test("Mama Kuku 4-week file lands in Ready with notes", () => {
  const weeks: WeekRoll[] = [3, 2, 1, 0].map((w) => ({
    weekStart: `2026-08-0${4 - w}`,
    stockEvents: 4,
    moneyEvents: 4,
    incomeKes: 8000 + w * 400,
    expenseKes: 2400 + (w === 0 ? 700 : 0),
    voiceStockEvents: 4,
    smsStockOrLedger: 4,
  }));
  const r = scoreCredit(weeks, {
    goalNamed: true,
    nudgesAccepted: 0,
    balanceKes: 0,
    targetKes: 5000,
  });
  assert.equal(r.score >= 60 && r.score <= 79, true, `score ${r.score}`);
  assert.equal(r.band, "Ready with notes");
  assert.equal(r.factors.length, 5);
});
