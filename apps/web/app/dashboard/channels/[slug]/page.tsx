"use client";

import { HelpStrip } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChannelDetailPage() {
  const { t } = usePage();
  const params = useParams<{ slug: string }>();
  const ch = getShop().channels.find((c) => c.id === params.slug);
  if (!ch) return null;

  return (
    <TShell kicker={`${t.channels} · ${ch.id.toUpperCase()}`} title={ch.name}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.chDo}
        itHelps={t.chHelp}
      />
      <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {t.howIn}
        </p>
        <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {ch.how}
        </p>
      </article>
      <article className="rounded-md bg-lilac-shadow p-[17px] text-bone-white">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {t.hears}
        </p>
        <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {ch.hears}
        </p>
      </article>
      <article className="rounded-md bg-matcha-cream p-[17px] text-ink-black">
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {t.talks}
        </p>
        <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {ch.talks}
        </p>
      </article>
      <Link
        href="/dashboard/messaging?tab=in"
        className="w-fit rounded-full border-[2px] border-hi-vis-yellow px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-hi-vis-yellow"
      >
        {t.seeInbox}
      </Link>
    </TShell>
  );
}
