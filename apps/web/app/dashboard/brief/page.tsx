"use client";

import { HelpStrip, PaintBars } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";

export default function BriefPage() {
  const { t } = usePage();
  const shop = getShop();
  const maxWeek = Math.max(...shop.weeks.map((w) => w.kes));
  return (
    <TShell kicker={t.brKicker} title={t.brTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.brDo}
        itHelps={t.brHelp}
      />
      <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
        <h2 className="font-ui text-[16px] font-bold tracking-[0.05em]">
          {shop.brief.headline}
        </h2>
        <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {shop.brief.body}
        </p>
      </article>
      <PaintBars
        title={t.weeksTitle}
        rows={shop.weeks.map((w) => ({
          label: w.label,
          value: w.kes,
          max: maxWeek,
        }))}
      />
    </TShell>
  );
}
