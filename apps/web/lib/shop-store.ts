export type ChannelId =
  | "whatsapp"
  | "sms"
  | "brevo"
  | "mpesa"
  | "pos"
  | "web";

export type ChannelBind = {
  id: ChannelId;
  name: string;
  status: "linked" | "ready" | "later";
  hears: string;
  talks: string;
  how: string;
  landsOn: string;
};

export type InboundEvent = {
  id: string;
  channel: ChannelId;
  raw: string;
  becomes: string;
  at: string;
};

export type ShopSnapshot = {
  trader: string;
  consent: "none" | "ndio" | "revoked";
  channels: ChannelBind[];
  inbox: InboundEvent[];
  stock: { sku: string; label: string }[];
  voice: string;
  ledger: { amountKes: number; party: string; sku: string }[];
  behaviour: { buyer: string; sku: string; weeks: number; mixLine: string };
  brief: { headline: string; body: string };
  draft: {
    channel: string;
    to: string;
    body: string;
    status: "draft" | "sent" | "dropped";
  };
  credit: { score: number; band: string; factors: string };
  mix: { name: string; pct: number }[];
  weeks: { label: string; kes: number }[];
  factorBars: { name: string; pts: number; max: number }[];
  savings: { askKes: number; status: "open" | "yes" | "no" };
};

const shop: ShopSnapshot = {
  trader: "Mama Kuku Fresh",
  consent: "ndio",
  channels: [
    {
      id: "whatsapp",
      name: "WhatsApp",
      status: "linked",
      hears: "Voice notes + text. Sheng stock verbs.",
      talks: "Agent replies + 1:1 follow-up after TUMA",
      how: "Retailer saves Duka’s Business number. Cloud API webhook → STT → stock_event / sale_event.",
      landsOn: "/shelf and /people",
    },
    {
      id: "sms",
      name: "SMS · Africa’s Talking",
      status: "ready",
      hears: "Inbound SMS, M-Pesa forwards, shortcodes",
      talks: "Follow-up SMS from the same outbox",
      how: "AT inbound URL hits Duka. Parser normalizes to MessageReceived.",
      landsOn: "/dashboard/messaging",
    },
    {
      id: "brevo",
      name: "Brevo email",
      status: "ready",
      hears: "Supplier invoices, order lines, weekly dump",
      talks: "Receipts, Sunday brief, campaigns (gated)",
      how: "Inbound parse webhook (Message-ID idempotency) → expense or sale. Outbound only via outbox.",
      landsOn: "/till and /brief",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      status: "linked",
      hears: "Forwarded SMS now. Daraja C2B later.",
      talks: "No STK in v1",
      how: "Paste or forward SMS. Receipt id deduped. Amount + party → ledger_entry, SKU when tagged.",
      landsOn: "/till",
    },
    {
      id: "pos",
      name: "POS / CSV / Excel",
      status: "later",
      hears: "Nightly till export, barcode sales",
      talks: "—",
      how: "Upload file → file_ingest job → sale_events. receipt_no idempotency.",
      landsOn: "/shelf and /till",
    },
    {
      id: "web",
      name: "This dashboard",
      status: "linked",
      hears: "Type stock, paste SMS, upload CSV",
      talks: "Approve drafts (same TUMA gate)",
      how: "Same canonical events. Phone-first kiosk can skip this screen.",
      landsOn: "every page",
    },
  ],
  inbox: [
    {
      id: "in-1",
      channel: "whatsapp",
      raw: "nimeuza kuku tatu, mayai trays mbili",
      becomes: "StockDelta · kuku −3 · mayai −2 trays",
      at: "today 08:12",
    },
    {
      id: "in-2",
      channel: "mpesa",
      raw: "Confirmed. Ksh1,200.00 received from AMINA 2547***",
      becomes: "Payment + Sale · Amina · mayai · 1200",
      at: "today 08:14",
    },
    {
      id: "in-3",
      channel: "brevo",
      raw: "Invoice · feed 4 bags · KSh 8,400",
      becomes: "Expense · feed · COGS up",
      at: "yesterday",
    },
  ],
  stock: [
    { sku: "kuku", label: "Kuku — 37" },
    { sku: "mayai", label: "Mayai — 6 trays" },
    { sku: "tomato", label: "Tomato — inakwisha" },
  ],
  voice: "nimeuza kuku tatu, mayai trays mbili",
  ledger: [{ amountKes: 1200, party: "Amina", sku: "mayai" }],
  behaviour: {
    buyer: "Amina",
    sku: "mayai",
    weeks: 3,
    mixLine: "Mix this week: mayai 40%. Week hii hajaonekana.",
  },
  brief: {
    headline: "TOMATO TOP SELLER",
    body: "Feed inakula margin. Usinunue feed ya duka ile ile bila kuangalia bei.",
  },
  draft: {
    channel: "whatsapp",
    to: "Amina",
    body: "Amina, mayai fresh iko leo. Tray bado 6. Unataka nikuwekee?",
    status: "draft",
  },
  credit: {
    score: 72,
    band: "READY WITH NOTES",
    factors: "Streak 18 · cashflow 20 · margin 12 · hygiene 14 · savings 8",
  },
  mix: [
    { name: "Eggs", pct: 40 },
    { name: "Chicken", pct: 35 },
    { name: "Tomato", pct: 18 },
    { name: "Other", pct: 7 },
  ],
  weeks: [
    { label: "W1", kes: 6200 },
    { label: "W2", kes: 7100 },
    { label: "W3", kes: 5400 },
    { label: "W4", kes: 8900 },
  ],
  factorBars: [
    { name: "Streak", pts: 18, max: 25 },
    { name: "Cashflow", pts: 20, max: 25 },
    { name: "Margin", pts: 12, max: 20 },
    { name: "Hygiene", pts: 14, max: 15 },
    { name: "Savings", pts: 8, max: 15 },
  ],
  savings: { askKes: 500, status: "open" },
};

export function getShop(): ShopSnapshot {
  return structuredClone(shop);
}

export function setConsent(state: ShopSnapshot["consent"]): ShopSnapshot {
  shop.consent = state;
  return getShop();
}

export function approveOutreach(): ShopSnapshot {
  if (shop.draft.status !== "draft") return getShop();
  shop.draft.status = "sent";
  return getShop();
}

export function dropOutreach(): ShopSnapshot {
  if (shop.draft.status !== "draft") return getShop();
  shop.draft.status = "dropped";
  return getShop();
}

export function answerSavings(yes: boolean): ShopSnapshot {
  if (shop.savings.status !== "open") return getShop();
  shop.savings.status = yes ? "yes" : "no";
  return getShop();
}

export function ingestMpesaPaste(raw: string): ShopSnapshot {
  const trimmed = raw.trim();
  if (!trimmed) return getShop();
  shop.inbox.unshift({
    id: `in-${Date.now()}`,
    channel: "mpesa",
    raw: trimmed.slice(0, 180),
    becomes: "Payment · queued parse · till",
    at: "now",
  });
  return getShop();
}
