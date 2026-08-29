export type ParsedMpesa = {
  amountKes: number;
  dir: "in" | "out";
  party: string;
  mpesaRef: string | null;
  rawShape: string;
};

const RECEIVED =
  /(?:received|umepokea|you have received)\s*(?:ksh|kes)?\s*([\d,]+(?:\.\d+)?)/i;
const SENT =
  /(?:sent|umenotuma|paid to|umepeleka)\s*(?:ksh|kes)?\s*([\d,]+(?:\.\d+)?)/i;
const AMOUNT = /(?:ksh|kes)\s*([\d,]+(?:\.\d+)?)/i;
const FROM = /from\s+([A-Za-z][A-Za-z\s]{1,40}?)(?:\s+\d{8,}|\s+on\b|$)/i;
const TO = /(?:to|kwenda)\s+([A-Za-z][A-Za-z\s]{1,40}?)(?:\s+\d{8,}|\s+on\b|$)/i;
const REF = /(?:transaction(?:\s+id)?|receipt|ref(?:erence)?)\s*[:#]?\s*([A-Z0-9]{6,})/i;

function kes(s: string): number {
  return Math.round(Number(s.replace(/,/g, "")));
}

export function looksLikeMpesa(text: string): boolean {
  return /m-?pesa|ksh|kes\s*\d/i.test(text) && /\d/.test(text);
}

export function parseMpesaSms(text: string): ParsedMpesa | null {
  const received = text.match(RECEIVED);
  const sent = text.match(SENT);
  const amountMatch = received ?? sent ?? text.match(AMOUNT);
  if (!amountMatch) return null;
  const amountKes = kes(amountMatch[1]!);
  if (!Number.isFinite(amountKes) || amountKes <= 0) return null;

  const dir: "in" | "out" = sent && !received ? "out" : "in";
  const partyMatch = dir === "in" ? text.match(FROM) : text.match(TO);
  const party = (partyMatch?.[1] ?? "Unknown").replace(/\s+/g, " ").trim();
  const mpesaRef = text.match(REF)?.[1] ?? null;

  return { amountKes, dir, party, mpesaRef, rawShape: dir === "in" ? "received" : "sent" };
}

export function categorizeLedger(input: {
  dir: "in" | "out";
  party: string;
  text: string;
}): { category: string; skuId: string | null } {
  const blob = `${input.party} ${input.text}`.toLowerCase();
  if (/feed|mash|unga/.test(blob)) return { category: "feed", skuId: "feed" };
  if (/egg|mayai/.test(blob)) return { category: "eggs", skuId: "mayai" };
  if (/kuku|chicken/.test(blob)) return { category: "poultry", skuId: "kuku" };
  if (/nyanya|tomato/.test(blob)) return { category: "produce", skuId: "tomato" };
  if (/mahindi|maize/.test(blob)) return { category: "produce", skuId: "mahindi" };
  if (input.dir === "out") return { category: "expense", skuId: null };
  return { category: "sales", skuId: null };
}
