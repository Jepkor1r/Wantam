import { randomUUID } from "node:crypto";
import { DEFAULT_SKUS } from "@wantam/shared";
import { getDb, getSqlite, resetDbFile } from "./client";
import {
  consentEvent,
  insightCard,
  ledgerEntry,
  outbox,
  savingsGoal,
  sku,
  stockEvent,
  traders,
} from "./schema";

const TRADER = process.env.DEMO_TRADER_ID ?? "mama-kuku";

function id(): string {
  return randomUUID();
}

function weeksAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

/** Four weeks of Mama Kuku history so the board opens with a live shop, not an empty demo. */
export function seedDemo(opts?: { reset?: boolean }) {
  if (opts?.reset !== false) resetDbFile();
  getSqlite();
  const db = getDb();

  db.insert(traders)
    .values({
      id: TRADER,
      waNumber: "254700000001",
      name: "Mama Kuku Fresh",
      lang: "sw",
      consentAt: weeksAgo(28),
    })
    .run();

  db.insert(consentEvent)
    .values({
      id: id(),
      traderId: TRADER,
      kind: "ndio",
      channel: "whatsapp",
      at: weeksAgo(28),
    })
    .run();

  for (const s of DEFAULT_SKUS) {
    db.insert(sku)
      .values({
        id: s.id,
        traderId: TRADER,
        name: s.name,
        unit: s.unit,
        aliasesJson: JSON.stringify(s.aliases),
        onHand: s.opening,
        lowStock: s.lowStock,
      })
      .run();
  }

  const stockRows: { skuId: string; delta: number; source: string; daysAgo: number }[] = [];
  const ledgerRows: {
    amountKes: number;
    dir: "in" | "out";
    category: string;
    skuId: string | null;
    party: string;
    daysAgo: number;
  }[] = [];

  for (const week of [3, 2, 1, 0]) {
    const base = week * 7 + 2;
    stockRows.push(
      { skuId: "tomato", delta: -8 - week, source: "voice", daysAgo: base },
      { skuId: "kuku", delta: -4, source: "voice", daysAgo: base + 1 },
      { skuId: "mayai", delta: -2, source: "voice", daysAgo: base + 2 },
      { skuId: "mahindi", delta: week >= 2 ? -1 : 0, source: "voice", daysAgo: base + 3 },
      { skuId: "feed", delta: -1, source: "voice", daysAgo: base + 4 },
    );
    ledgerRows.push(
      {
        amountKes: week === 0 ? 5500 : week === 1 ? 4200 : 3800 + (3 - week) * 200,
        dir: "in",
        category: "produce",
        skuId: "tomato",
        party: "Market walk-in",
        daysAgo: base,
      },
      {
        amountKes: 2800,
        dir: "in",
        category: "poultry",
        skuId: "kuku",
        party: "Amina",
        daysAgo: base + 1,
      },
      {
        amountKes: 1600,
        dir: "in",
        category: "eggs",
        skuId: "mayai",
        party: "Estate order",
        daysAgo: base + 2,
      },
      {
        amountKes: 2400,
        dir: "out",
        category: "feed",
        skuId: "feed",
        party: "Agrovet",
        daysAgo: base + 4,
      },
    );
  }

  for (const r of stockRows) {
    if (r.delta === 0) continue;
    db.insert(stockEvent)
      .values({
        id: id(),
        traderId: TRADER,
        skuId: r.skuId,
        delta: r.delta,
        source: r.source,
        rawRef: "seed",
        at: weeksAgo(r.daysAgo),
      })
      .run();
  }

  for (const r of ledgerRows) {
    db.insert(ledgerEntry)
      .values({
        id: id(),
        traderId: TRADER,
        amountKes: r.amountKes,
        dir: r.dir,
        category: r.category,
        skuId: r.skuId,
        mpesaRef: null,
        party: r.party,
        at: weeksAgo(r.daysAgo),
      })
      .run();
  }

  db.insert(savingsGoal)
    .values({
      id: "restock-5000",
      traderId: TRADER,
      name: "Restock 5,000 KES",
      targetKes: 5000,
      balanceKes: 0,
      active: 1,
      pendingNudge:
      "You made 15% more this week — want to set aside 500 KES for restocking?",
    })
    .run();

  db.insert(insightCard)
    .values({
      id: id(),
      traderId: TRADER,
      weekStart: new Date().toISOString().slice(0, 10),
      type: "placeholder",
      payload: "{}",
      copySw: "",
      copyEn: "",
    })
    .run();

  db.insert(outbox)
    .values({
      id: id(),
      traderId: TRADER,
      dir: "out",
      body: "Sawa Mama Kuku. Duka iko live — voice notes kwa stock, SMS kwa pesa. Reply NDIO kama bado.",
      at: weeksAgo(28),
    })
    .run();

  return { traderId: TRADER };
}

export function ensureSeeded() {
  getSqlite();
  const row = getSqlite().prepare("select id from traders limit 1").get();
  if (!row) seedDemo({ reset: false });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { traderId } = seedDemo();
  console.log(`Seeded ${traderId} at ${process.env.DATABASE_PATH ?? "./data/wantam.db"}`);
}
