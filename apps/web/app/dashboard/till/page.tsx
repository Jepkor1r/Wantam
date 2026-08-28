"use client";

import { HelpStrip } from "@/components/PaintBars";
import { PasteSms } from "@/components/PasteSms";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";

export default function TillPage() {
  const { t } = usePage();
  const shop = getShop();
  return (
    <TShell kicker={t.tiKicker} title={t.tiTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.tiDo}
        itHelps={t.tiHelp}
      />
      {shop.ledger.map((row) => (
        <article
          key={`${row.party}-${row.amountKes}`}
          className="rounded-md bg-bone-white p-[17px] text-ink-black"
        >
          <p className="font-ui text-[16px] leading-none tracking-[0.8px]">
            KSh {row.amountKes.toLocaleString()} · {row.party} · {row.sku}
          </p>
        </article>
      ))}
      <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
        <PasteSms />
      </article>
    </TShell>
  );
}
