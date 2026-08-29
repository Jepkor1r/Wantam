export type CreditFactor = {
  id: "streak" | "cashflow" | "expense" | "hygiene" | "savings";
  label: string;
  max: number;
  points: number;
  reason: string;
};

export type CreditResult = {
  score: number;
  band: "Strong file" | "Ready with notes" | "Building history" | "Too early";
  factors: CreditFactor[];
};

export function bandFor(score: number): CreditResult["band"] {
  if (score >= 80) return "Strong file";
  if (score >= 60) return "Ready with notes";
  if (score >= 40) return "Building history";
  return "Too early";
}

export type WeekRoll = {
  weekStart: string;
  stockEvents: number;
  moneyEvents: number;
  incomeKes: number;
  expenseKes: number;
  voiceStockEvents: number;
  smsStockOrLedger: number;
};

export type SavingsHabit = {
  goalNamed: boolean;
  nudgesAccepted: number;
  balanceKes: number;
  targetKes: number;
};

/** Deterministic 0–100 scorer. The LLM never picks this number. */
export function scoreCredit(weeks: WeekRoll[], savings: SavingsHabit): CreditResult {
  const qualifying = weeks.map(
    (w) => w.stockEvents >= 3 && w.moneyEvents >= 1,
  );
  let streak = 0;
  for (let i = qualifying.length - 1; i >= 0; i--) {
    if (!qualifying[i]) break;
    streak++;
  }
  const streakPts = Math.min(25, Math.round(streak * 4.5));

  const surplusWeeks = weeks.filter((w) => w.incomeKes - w.expenseKes > 0).length;
  const surplusShare = weeks.length ? surplusWeeks / weeks.length : 0;
  const incomes = weeks.map((w) => w.incomeKes);
  const mean = incomes.length ? incomes.reduce((a, b) => a + b, 0) / incomes.length : 0;
  const variance =
    incomes.length && mean
      ? incomes.reduce((a, x) => a + (x - mean) ** 2, 0) / incomes.length
      : 0;
  const cv = mean ? Math.sqrt(variance) / mean : 1;
  const cashflowPts = Math.min(
    25,
    Math.round(surplusShare * 20 + (cv < 0.35 ? 5 : cv < 0.6 ? 3 : 0)),
  );

  const last = weeks[weeks.length - 1];
  const prev = weeks[weeks.length - 2];
  const lastCogs = last && last.incomeKes ? last.expenseKes / last.incomeKes : 1;
  const prevCogs = prev && prev.incomeKes ? prev.expenseKes / prev.incomeKes : lastCogs;
  const squeeze = lastCogs > prevCogs + 0.05;
  const expensePts = squeeze ? 12 : 16;

  const voice = weeks.reduce((a, w) => a + w.voiceStockEvents, 0);
  const money = weeks.reduce((a, w) => a + w.smsStockOrLedger, 0);
  const hygieneRatio = money ? Math.min(1, voice / Math.max(1, money)) : 0.5;
  const hygienePts = Math.min(15, Math.round(8 + hygieneRatio * 7));

  let savingsPts = 0;
  if (savings.goalNamed) savingsPts += 8;
  savingsPts += Math.min(5, savings.nudgesAccepted * 3);
  if (savings.targetKes > 0 && savings.balanceKes / savings.targetKes >= 0.1) savingsPts += 2;
  savingsPts = Math.min(15, savingsPts);

  const factors: CreditFactor[] = [
    {
      id: "streak",
      label: "Record streak",
      max: 25,
      points: streakPts,
      reason: `${streak} consecutive week(s) with ≥3 stock events and ≥1 money event`,
    },
    {
      id: "cashflow",
      label: "Cashflow stability",
      max: 25,
      points: cashflowPts,
      reason: `${surplusWeeks}/${weeks.length || 0} surplus weeks; income CV ${cv.toFixed(2)}`,
    },
    {
      id: "expense",
      label: "Expense discipline",
      max: 20,
      points: expensePts,
      reason: squeeze
        ? "COGS/sales up vs prior week — feed concentration likely"
        : "COGS/sales stable vs prior week",
    },
    {
      id: "hygiene",
      label: "Stock hygiene",
      max: 15,
      points: hygienePts,
      reason: `Voice updates vs money events (${voice} voice / ${money} money)`,
    },
    {
      id: "savings",
      label: "Savings habit",
      max: 15,
      points: savingsPts,
      reason: savings.goalNamed
        ? `Goal on file; ${savings.nudgesAccepted} nudge(s) accepted`
        : "No named savings goal yet",
    },
  ];

  const score = factors.reduce((a, f) => a + f.points, 0);
  return { score, band: bandFor(score), factors };
}
