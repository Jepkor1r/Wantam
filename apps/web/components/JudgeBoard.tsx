"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { ShopSnapshot } from "@/lib/shop-store";

async function postJson(url: string, action: string): Promise<ShopSnapshot> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export function JudgeBoard() {
  const { t } = useLang();
  const [shop, setShop] = useState<ShopSnapshot | null>(null);

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then(setShop);
  }, []);

  if (!shop) {
    return (
      <p className="px-5 font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
        {t.loading}
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-5 pb-20">
      <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
        {shop.trader.toUpperCase()} · {t.consent} {shop.consent.toUpperCase()}
      </p>

      <section className="grid gap-10 md:grid-cols-2">
        <article className="rounded-md bg-matcha-cream p-[17px] text-ink-black">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.shelf}
          </p>
          <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
            STOCK LIVE
          </h2>
          <ul className="mt-4 space-y-2 font-ui text-[16px] leading-none tracking-[0.8px]">
            {shop.stock.map((row) => (
              <li key={row.sku}>{row.label}</li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {shop.voice}
          </p>
        </article>

        <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.till}
          </p>
          <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
            LEDGER
          </h2>
          <p className="mt-4 font-ui text-[16px] leading-none tracking-[0.8px]">
            KSh {shop.ledger[0].amountKes.toLocaleString()} from{" "}
            {shop.ledger[0].party} — tagged {shop.ledger[0].sku}
          </p>
        </article>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.people}
          </p>
          <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
            {shop.behaviour.buyer.toUpperCase()} ·{" "}
            {shop.behaviour.sku.toUpperCase()} · {shop.behaviour.weeks} WEEKS
          </h2>
          <p className="mt-4 font-ui text-[16px] leading-none tracking-[0.8px]">
            {shop.behaviour.mixLine}
          </p>
        </article>

        <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.brief}
          </p>
          <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
            {shop.brief.headline}
          </h2>
          <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
            {shop.brief.body}
          </p>
        </article>
      </section>

      <section className="rounded-md bg-hi-vis-yellow p-[17px] text-pure-black">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {t.messaging} · {shop.draft.channel.toUpperCase()}
        </p>
        <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
          DRAFT TO {shop.draft.to.toUpperCase()}
        </h2>
        <p className="mt-4 max-w-xl font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {shop.draft.body}
        </p>
        <p className="mt-3 font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          POST /api/outreach · SMS · BREVO STILL GATED · BADO LANGO
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-[17px]">
          {shop.draft.status === "draft" ? (
            <>
              <button
                type="button"
                className="rounded-full border-[2px] border-pure-black bg-transparent px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-pure-black"
                onClick={() =>
                  postJson("/api/outreach", "tuma").then(setShop)
                }
              >
                {t.send}
              </button>
              <button
                type="button"
                className="rounded-full bg-bone-white px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-pure-black"
                onClick={() =>
                  postJson("/api/outreach", "hapana").then(setShop)
                }
              >
                {t.no}
              </button>
            </>
          ) : (
            <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
              {shop.draft.status === "sent"
                ? "OUTBOX TICK · SENT · 3-DAY CAP STARTS"
                : "DROPPED · NO PING"}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.credit}
          </p>
          <p className="mt-3 font-display text-[100px] leading-[0.9] tracking-[2px] text-ink-black">
            {shop.credit.score}
          </p>
          <p className="font-ui text-[16px] font-bold tracking-[0.05em]">
            / 100 · {shop.credit.band}
          </p>
          <p className="mt-4 font-mono text-[12px] leading-[1] tracking-[0.05em]">
            {shop.credit.factors}
          </p>
        </article>

        <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.savings}
          </p>
          <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
            SET ASIDE {shop.savings.askKes} KES?
          </h2>
          <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
            {t.saDo}
          </p>
          <div className="mt-6 flex flex-wrap gap-[17px]">
            {shop.savings.status === "open" ? (
              <>
                <button
                  type="button"
                  className="rounded-full border-[2px] border-hi-vis-yellow bg-transparent px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-hi-vis-yellow"
                  onClick={() =>
                    postJson("/api/savings", "ndio").then(setShop)
                  }
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  className="font-mono text-[12px] leading-[0.8] text-bone-white underline underline-offset-4"
                  onClick={() =>
                    postJson("/api/savings", "hapana").then(setShop)
                  }
                >
                  {t.no}
                </button>
              </>
            ) : (
              <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
                {shop.savings.status === "yes"
                  ? `${shop.savings.askKes} KES PARKED FOR RESTOCK`
                  : "SKIPPED THIS WEEK"}
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
