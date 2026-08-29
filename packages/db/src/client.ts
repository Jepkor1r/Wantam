import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { schema } from "./schema";

export function dbPath(): string {
  const p = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "wantam.db");
  fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
  return path.resolve(p);
}

let sqlite: Database.Database | null = null;

export function getSqlite(): Database.Database {
  if (!sqlite) {
    sqlite = new Database(dbPath());
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    migrate(sqlite);
  }
  return sqlite;
}

export function getDb() {
  return drizzle(getSqlite(), { schema });
}

export function resetDbFile() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
  }
  const p = dbPath();
  for (const f of [p, `${p}-wal`, `${p}-shm`]) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS traders (
      id TEXT PRIMARY KEY,
      wa_number TEXT NOT NULL,
      name TEXT NOT NULL,
      lang TEXT NOT NULL DEFAULT 'sw',
      consent_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS sku (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      aliases TEXT NOT NULL,
      on_hand REAL NOT NULL DEFAULT 0,
      low_stock REAL NOT NULL DEFAULT 2
    );
    CREATE TABLE IF NOT EXISTS stock_event (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      sku_id TEXT NOT NULL,
      delta REAL NOT NULL,
      source TEXT NOT NULL,
      raw_ref TEXT,
      at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ledger_entry (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      amount_kes INTEGER NOT NULL,
      dir TEXT NOT NULL,
      category TEXT NOT NULL,
      sku_id TEXT,
      mpesa_ref TEXT,
      party TEXT,
      at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS insight_card (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      week_start TEXT NOT NULL,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      copy_sw TEXT NOT NULL,
      copy_en TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS credit_snapshot (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      band TEXT NOT NULL,
      factors TEXT NOT NULL,
      valid_from INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS savings_goal (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      name TEXT NOT NULL,
      target_kes INTEGER NOT NULL,
      balance_kes INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      pending_nudge TEXT
    );
    CREATE TABLE IF NOT EXISTS consent_event (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      channel TEXT NOT NULL,
      at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS credit_share_log (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      snapshot_id TEXT NOT NULL,
      actor TEXT NOT NULL,
      at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      body TEXT NOT NULL,
      at INTEGER NOT NULL
    );
  `);
}

export { schema } from "./schema";
export * from "./schema";
