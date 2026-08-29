export type BoardSku = {
  id: string;
  name: string;
  unit: string;
  onHand: number;
  lowStock: number;
};

export type BoardLedger = {
  id: string;
  amountKes: number;
  dir: "in" | "out";
  category: string;
  party: string | null;
  skuId: string | null;
  at: number;
};

export type BoardInsight = {
  type: string;
  copySw: string;
  copyEn: string;
  payload: unknown;
};

export type BoardCredit = {
  score: number;
  band: string;
  factors: { id: string; label: string; max: number; points: number; reason: string }[];
  shared: boolean;
};

export type BoardSavings = {
  name: string;
  targetKes: number;
  balanceKes: number;
  pendingNudge: string | null;
};

export type BoardState = {
  trader: { id: string; name: string; consent: boolean };
  stock: BoardSku[];
  ledger: BoardLedger[];
  briefing: { copySw: string; copyEn: string } | null;
  insights: BoardInsight[];
  credit: BoardCredit | null;
  savings: BoardSavings | null;
  lastReply: string | null;
  updatedAt: number;
};

export type AgentReply = {
  text: string;
  events: string[];
};
