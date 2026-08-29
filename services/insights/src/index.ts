import { desc, eq } from "drizzle-orm";
import { getDb, insightCard, ledgerEntry, sku, stockEvent } from "@wantam/db";
import { weekStartIso, type WeekRoll } from "@wantam/shared";

export type RankRow = { skuId: string; name: string; kes: number; units: number };

export function weekRolls(traderId: string): WeekRoll[] {
  const db = getDb();
  const stock = db.select().from(stockEvent).where(eq(stockEvent.traderId, traderId)).all();
  const money = db.select().from(ledgerEntry).where(eq(ledgerEntry.traderId, traderId)).all();
  const buckets = new Map<string, WeekRoll>();

  const ensure = (at: number) => {
    const key = weekStartIso(new Date(at));
    if (!buckets.has(key)) {
      buckets.set(key, {
        weekStart: key,
        stockEvents: 0,
        moneyEvents: 0,
        incomeKes: 0,
        expenseKes: 0,
        voiceStockEvents: 0,
        smsStockOrLedger: 0,
      });
    }
    return buckets.get(key)!;
  };

  for (const s of stock) {
    const w = ensure(s.at);
    w.stockEvents++;
    if (s.source === "voice") w.voiceStockEvents++;
  }
  for (const m of money) {
    const w = ensure(m.at);
    w.moneyEvents++;
    w.smsStockOrLedger++;
    if (m.dir === "in") w.incomeKes += m.amountKes;
    else w.expenseKes += m.amountKes;
  }

  return [...buckets.values()].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export function salesBySku(traderId: string): RankRow[] {
  const db = getDb();
  const names = Object.fromEntries(
    db.select().from(sku).where(eq(sku.traderId, traderId)).all().map((s) => [s.id, s.name]),
  );
  const rows = db.select().from(ledgerEntry).where(eq(ledgerEntry.traderId, traderId)).all();
  const map = new Map<string, RankRow>();
  for (const r of rows) {
    if (r.dir !== "in" || !r.skuId) continue;
    const cur = map.get(r.skuId) ?? { skuId: r.skuId, name: names[r.skuId] ?? r.skuId, kes: 0, units: 0 };
    cur.kes += r.amountKes;
    cur.units += 1;
    map.set(r.skuId, cur);
  }
  return [...map.values()].sort((a, b) => b.kes - a.kes);
}

export function costsBySku(traderId: string): RankRow[] {
  const db = getDb();
  const names = Object.fromEntries(
    db.select().from(sku).where(eq(sku.traderId, traderId)).all().map((s) => [s.id, s.name]),
  );
  const rows = db.select().from(ledgerEntry).where(eq(ledgerEntry.traderId, traderId)).all();
  const map = new Map<string, RankRow>();
  for (const r of rows) {
    if (r.dir !== "out") continue;
    const key = r.skuId ?? r.category;
    const cur = map.get(key) ?? { skuId: key, name: names[key] ?? r.category, kes: 0, units: 0 };
    cur.kes += r.amountKes;
    cur.units += 1;
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => b.kes - a.kes);
}

export function wowSales(rolls: WeekRoll[]): { thisWeek: number; lastWeek: number; pct: number | null } {
  const last = rolls[rolls.length - 1];
  const prev = rolls[rolls.length - 2];
  const thisWeek = last?.incomeKes ?? 0;
  const lastWeek = prev?.incomeKes ?? 0;
  const pct = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;
  return { thisWeek, lastWeek, pct };
}

export function rebuildInsights(traderId: string) {
  const db = getDb();
  const sales = salesBySku(traderId);
  const costs = costsBySku(traderId);
  const rolls = weekRolls(traderId);
  const wow = wowSales(rolls);
  const week = weekStartIso();

  const cards: {
    type: string;
    payload: unknown;
    copySw: string;
    copyEn: string;
  }[] = [];

  const best = sales[0];
  if (!best || best.units < 3) {
    cards.push({
      type: "thin",
      payload: { reason: "not_enough_sales_events" },
      copySw: "Data bado kidogo — hatuwezi kusema best seller.",
      copyEn: "Not enough data yet — we will not invent a bestseller.",
    });
  } else {
    cards.push({
      type: "best_seller",
      payload: best,
      copySw: `${best.name} ndiyo best seller (KSh ${best.kes.toLocaleString()}).`,
      copyEn: `${best.name} is your top seller (KSh ${best.kes.toLocaleString()}).`,
    });
  }

  const biggest = costs[0];
  if (biggest) {
    cards.push({
      type: "biggest_cost",
      payload: biggest,
      copySw: `${biggest.name} ndiyo biggest cost (KSh ${biggest.kes.toLocaleString()}).`,
      copyEn: `${biggest.name} is your biggest cost (KSh ${biggest.kes.toLocaleString()}).`,
    });
  }

  const last = rolls[rolls.length - 1];
  const prev = rolls[rolls.length - 2];
  if (last && prev && prev.incomeKes && last.expenseKes / Math.max(1, last.incomeKes) > prev.expenseKes / prev.incomeKes + 0.05) {
    cards.push({
      type: "margin_squeeze",
      payload: { last, prev },
      copySw: "Feed costs zinaeata margin. Usinunue feed ya duka ile ile bila kuangalia bei.",
      copyEn: "Feed costs are eating your margin. Check price before the same restock.",
    });
  }

  const sevenDays = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const skus = db.select().from(sku).where(eq(sku.traderId, traderId)).all();
  const recentSales = new Set(
    db
      .select()
      .from(ledgerEntry)
      .where(eq(ledgerEntry.traderId, traderId))
      .all()
      .filter((r) => r.dir === "in" && r.skuId && r.at >= sevenDays)
      .map((r) => r.skuId),
  );
  for (const s of skus) {
    if (s.onHand > 0 && !recentSales.has(s.id)) {
      cards.push({
        type: "dead_stock",
        payload: { skuId: s.id, onHand: s.onHand },
        copySw: `${s.name} haijasonga — punguza order.`,
        copyEn: `${s.name} has not moved in 7 days — cut the next order.`,
      });
      break;
    }
  }

  const briefingSw =
    wow.pct == null
      ? "Wiki hii: data bado inajenga."
      : `Ulitengeneza asilimia ${wow.pct} ${wow.pct >= 0 ? "zaidi" : "chini"} kuliko wiki iliyopita.` +
        (biggest ? ` Lakini ${biggest.name.toLowerCase()} inakula margin.` : "");
  const briefingEn =
    wow.pct == null
      ? "This week: still building history."
      : `You made ${wow.pct}% ${wow.pct >= 0 ? "more" : "less"} than last week.` +
        (biggest ? ` ${biggest.name} is the cost to watch.` : "");

  cards.push({
    type: "weekly_briefing",
    payload: wow,
    copySw: briefingSw,
    copyEn: briefingEn,
  });

  db.delete(insightCard).where(eq(insightCard.traderId, traderId)).run();
  for (const c of cards) {
    db.insert(insightCard)
      .values({
        id: crypto.randomUUID(),
        traderId,
        weekStart: week,
        type: c.type,
        payload: JSON.stringify(c.payload),
        copySw: c.copySw,
        copyEn: c.copyEn,
      })
      .run();
  }

  return { cards, wow, sales, costs };
}

export function latestInsights(traderId: string) {
  return getDb()
    .select()
    .from(insightCard)
    .where(eq(insightCard.traderId, traderId))
    .orderBy(desc(insightCard.weekStart))
    .all();
}
