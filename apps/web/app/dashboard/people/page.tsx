"use client";

import { HelpStrip, PaintBars } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";

export default function PeoplePage() {
  const { t } = usePage();
  const shop = getShop();
  return (
    <TShell kicker={t.peKicker} title={t.peTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.peDo}
        itHelps={t.peHelp}
      />
      <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
        <h2 className="font-ui text-[16px] font-bold tracking-[0.05em]">
          {shop.behaviour.buyer} · {shop.behaviour.sku} · {shop.behaviour.weeks}
        </h2>
        <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {shop.behaviour.mixLine}
        </p>
      </article>
      <PaintBars
        title={t.mixTitle}
        rows={shop.mix.map((m) => ({
          label: m.name,
          value: m.pct,
          max: 100,
        }))}
        unit="%"
      />
    </TShell>
  );
}
