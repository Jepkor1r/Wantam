import { aliasToSkuId } from "./aliases";
import { parseCount } from "./numbers";

export type StockIntent =
  | { kind: "delta"; skuId: string; delta: number; raw: string }
  | { kind: "set"; skuId: string; onHand: number; raw: string }
  | { kind: "ambiguous"; question: string };

const SELL = /\b(nimeuza|niluza|sold|uuz(a|i)|nimeuza)\b/i;
const RESTOCK = /\b(nimeweka|stock.?in|nimenunua|imeingia|received)\b/i;
const SET = /\b(iko|nina|on hand|remaining)\b/i;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Parse a Sheng/Swahili/English stock utterance into SKU deltas.
 * One clarifying question if a quantity has no SKU (never a form).
 */
export function parseStockUtterance(text: string): StockIntent[] {
  const tokens = tokenize(text);
  const sign = SELL.test(text) ? -1 : RESTOCK.test(text) ? 1 : SET.test(text) ? 0 : -1;
  const out: StockIntent[] = [];
  const used = new Set<number>();
  const seenSku = new Set<string>();

  for (let i = 0; i < tokens.length; i++) {
    const skuId = aliasToSkuId(tokens[i]!);
    if (!skuId || seenSku.has(skuId)) continue;
    seenSku.add(skuId);

    let count: number | null = null;
    for (const j of [i + 1, i + 2, i - 1, i - 2]) {
      if (j < 0 || j >= tokens.length || used.has(j)) continue;
      const n = parseCount(tokens[j]!);
      if (n != null) {
        count = n;
        used.add(j);
        used.add(i);
        break;
      }
    }
    if (count == null) {
      out.push({
        kind: "ambiguous",
        question: `Ngapi ${skuId}? Reply na number, e.g. "${skuId} tatu".`,
      });
      continue;
    }
    if (sign === 0) {
      out.push({ kind: "set", skuId, onHand: count, raw: text });
    } else {
      out.push({ kind: "delta", skuId, delta: sign * count, raw: text });
    }
  }

  if (out.length === 0) {
    out.push({
      kind: "ambiguous",
      question:
        "Sijaelewa SKU. Sema kama: nimeuza kuku tatu, mayai trays mbili.",
    });
  }
  return out;
}
