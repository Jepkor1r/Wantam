import assert from "node:assert/strict";
import { test } from "node:test";
import { parseStockUtterance } from "./stock-parse";

test("parses Sheng sales voice note", () => {
  const intents = parseStockUtterance("nimeuza kuku tatu, mayai trays mbili");
  const kuku = intents.find((i) => i.kind === "delta" && i.skuId === "kuku");
  const mayai = intents.find((i) => i.kind === "delta" && i.skuId === "mayai");
  assert.deepEqual(kuku, { kind: "delta", skuId: "kuku", delta: -3, raw: "nimeuza kuku tatu, mayai trays mbili" });
  assert.ok(mayai && mayai.kind === "delta" && mayai.delta === -2);
});
