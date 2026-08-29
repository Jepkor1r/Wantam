import assert from "node:assert/strict";
import { test } from "node:test";
import { looksLikeMpesa, parseMpesaSms } from "./mpesa";

test("parses a received M-Pesa SMS", () => {
  const text =
    "AMINA confirmed. You have received Ksh1,200.00 from Amina 254700000000 on 28/8/26 at 2:14 PM. New M-PESA balance is Ksh3,400. Transaction ID NAI123XYZ.";
  assert.equal(looksLikeMpesa(text), true);
  const p = parseMpesaSms(text);
  assert.ok(p);
  assert.equal(p.amountKes, 1200);
  assert.equal(p.dir, "in");
  assert.match(p.party, /Amina/i);
  assert.equal(p.mpesaRef, "NAI123XYZ");
});
