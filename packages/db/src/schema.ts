import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const traders = sqliteTable("traders", {
  id: text("id").primaryKey(),
  waNumber: text("wa_number").notNull(),
  name: text("name").notNull(),
  lang: text("lang").notNull().default("sw"),
  consentAt: integer("consent_at"),
});

export const sku = sqliteTable("sku", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  aliasesJson: text("aliases").notNull(),
  onHand: real("on_hand").notNull().default(0),
  lowStock: real("low_stock").notNull().default(2),
  lowPingAt: integer("low_ping_at"),
});

export const stockEvent = sqliteTable("stock_event", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  skuId: text("sku_id").notNull(),
  delta: real("delta").notNull(),
  source: text("source").notNull(),
  rawRef: text("raw_ref"),
  at: integer("at").notNull(),
});

export const ledgerEntry = sqliteTable("ledger_entry", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  amountKes: integer("amount_kes").notNull(),
  dir: text("dir").notNull(),
  category: text("category").notNull(),
  skuId: text("sku_id"),
  mpesaRef: text("mpesa_ref"),
  party: text("party"),
  at: integer("at").notNull(),
});

export const insightCard = sqliteTable("insight_card", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  weekStart: text("week_start").notNull(),
  type: text("type").notNull(),
  payload: text("payload").notNull(),
  copySw: text("copy_sw").notNull(),
  copyEn: text("copy_en").notNull(),
});

export const creditSnapshot = sqliteTable("credit_snapshot", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  score: integer("score").notNull(),
  band: text("band").notNull(),
  factors: text("factors").notNull(),
  validFrom: integer("valid_from").notNull(),
});

export const savingsGoal = sqliteTable("savings_goal", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  name: text("name").notNull(),
  targetKes: integer("target_kes").notNull(),
  balanceKes: integer("balance_kes").notNull().default(0),
  active: integer("active").notNull().default(1),
  pendingNudge: text("pending_nudge"),
});

export const consentEvent = sqliteTable("consent_event", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  kind: text("kind").notNull(),
  channel: text("channel").notNull(),
  at: integer("at").notNull(),
});

export const creditShareLog = sqliteTable("credit_share_log", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  snapshotId: text("snapshot_id").notNull(),
  actor: text("actor").notNull(),
  at: integer("at").notNull(),
});

export const outbox = sqliteTable("outbox", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  dir: text("dir").notNull().default("out"),
  body: text("body").notNull(),
  at: integer("at").notNull(),
});

export const schema = {
  traders,
  sku,
  stockEvent,
  ledgerEntry,
  insightCard,
  creditSnapshot,
  savingsGoal,
  consentEvent,
  creditShareLog,
  outbox,
};
