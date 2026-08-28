"use client";

import { HelpStrip, PaintBars } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";

export default function CreditPage() {
  const { t } = usePage();
  const { credit, factorBars } = getShop();
  return (
    <TShell kicker={t.crKicker} title={t.crTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.crDo}
        itHelps={t.crHelp}
      />
      <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
        <p className="font-display text-[100px] leading-[0.9] tracking-[2px]">
          {credit.score}
        </p>
        <p className="font-ui text-[16px] font-bold tracking-[0.05em]">
          / 100
        </p>
      </article>
      <PaintBars
        title={t.factorsTitle}
        rows={factorBars.map((f) => ({
          label: f.name,
          value: f.pts,
          max: f.max,
        }))}
      />
    </TShell>
  );
}
