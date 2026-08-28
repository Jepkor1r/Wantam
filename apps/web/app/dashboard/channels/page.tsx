"use client";

import { HelpStrip } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";
import Link from "next/link";

const PAINT = [
  "bg-matcha-cream text-ink-black",
  "bg-bone-white text-ink-black",
  "bg-lilac-shadow text-bone-white",
] as const;

export default function ChannelsPage() {
  const { t } = usePage();
  const { channels } = getShop();

  return (
    <TShell kicker={t.chKicker} title={t.chTitle}>
      <p className="font-ui text-[16px] leading-[1.15] tracking-[0.8px] text-bone-white">
        {t.chBlurb}
      </p>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.chDo}
        itHelps={t.chHelp}
      />
      <div className="flex flex-col gap-10">
        {channels.map((ch, i) => (
          <Link key={ch.id} href={`/dashboard/channels/${ch.id}`} className="block">
            <article className={`rounded-md p-[17px] ${PAINT[i % PAINT.length]}`}>
              <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
                {ch.status.toUpperCase()}
              </p>
              <h2 className="mt-3 font-ui text-[16px] font-bold tracking-[0.05em]">
                {ch.name.toUpperCase()}
              </h2>
              <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
                {t.hears}: {ch.hears}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </TShell>
  );
}
