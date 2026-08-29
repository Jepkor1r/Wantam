"use client";

import { HelpStrip, PaintBars } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";
import Link from "next/link";

export default function DashboardHomePage() {
  const { t } = usePage();
  const shop = getShop();
  const maxWeek = Math.max(...shop.weeks.map((w) => w.kes));

  return (
    <TShell kicker={t.ovKicker} title={t.ovTitle}>
      <p className="font-ui text-[16px] leading-[1.15] tracking-[0.8px] text-bone-white">
        {t.ovBlurb.replace("{score}", String(shop.credit.score))}
      </p>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.ovDo}
        itHelps={t.ovHelp}
      />
      <PaintBars
        title={t.weeksTitle}
        rows={shop.weeks.map((w) => ({
          label: w.label,
          value: w.kes,
          max: maxWeek,
        }))}
      />
      <PaintBars
        title={t.mixTitle}
        rows={shop.mix.map((m) => ({
          label: m.name,
          value: m.pct,
          max: 100,
        }))}
        unit="%"
      />
      <Link
        href="/dashboard/messaging"
        className="w-fit rounded-full bg-bone-white px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-pure-black"
      >
        {t.messaging}
      </Link>
    </TShell>
  );
}
