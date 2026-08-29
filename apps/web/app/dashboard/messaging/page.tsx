"use client";

import {
  HelpStrip,
  PaintBars,
  PaintColumns,
  PaintShare,
} from "@/components/PaintBars";
import { JudgeBoard } from "@/components/JudgeBoard";
import { TShell, usePage } from "@/components/TShell";
import { getShop } from "@/lib/shop-store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Tab = "in" | "out" | "how";

function MessagingInner() {
  const { t } = usePage();
  const shop = getShop();
  const params = useSearchParams();
  const tab = (params.get("tab") as Tab) || "in";

  const byPipe = [
    {
      label: "WhatsApp",
      value: shop.inbox.filter((e) => e.channel === "whatsapp").length,
    },
    {
      label: "M-Pesa",
      value: shop.inbox.filter((e) => e.channel === "mpesa").length,
    },
    {
      label: "Brevo",
      value: shop.inbox.filter((e) => e.channel === "brevo").length,
    },
    {
      label: "SMS",
      value: shop.inbox.filter((e) => e.channel === "sms").length,
    },
  ];

  const waiting = shop.draft.status === "draft" ? 1 : 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "in", label: t.tabIn },
    { id: "out", label: t.tabOut },
    { id: "how", label: t.tabHow },
  ];

  return (
    <TShell kicker={t.msgKicker} title={t.msgTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.msgDo}
        itHelps={t.msgHelp}
      />

      <div className="flex flex-wrap gap-[17px]">
        {tabs.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/messaging?tab=${item.id}`}
            className={
              tab === item.id
                ? "rounded-full bg-bone-white px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-pure-black"
                : "rounded-full border-[2px] border-hi-vis-yellow px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-hi-vis-yellow"
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      {tab === "in" ? (
        <>
          <PaintColumns title={t.chartByPipe} rows={byPipe} />
          <p className="font-ui text-[16px] leading-[1.15] tracking-[0.8px] text-bone-white">
            {t.chartHint}
          </p>
          <PaintShare title={t.chartShare} rows={byPipe} />
          <PaintBars
            title={t.chartFlow}
            rows={[
              { label: t.inCount, value: shop.inbox.length, max: 10 },
              { label: t.waitCount, value: waiting, max: 10 },
            ]}
          />
          {shop.inbox.map((ev, i) => (
            <article
              key={ev.id}
              className={`rounded-md p-[17px] ${
                i % 2 === 0
                  ? "bg-bone-white text-ink-black"
                  : "bg-lilac-shadow text-bone-white"
              }`}
            >
              <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
                {ev.channel.toUpperCase()} · {ev.at}
              </p>
              <p className="mt-4 font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
                {ev.raw}
              </p>
              <p className="mt-4 font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
                {t.plainBecomes} · {ev.becomes}
              </p>
            </article>
          ))}
        </>
      ) : null}

      {tab === "out" ? (
        <>
          <PaintBars
            title={t.chartFlow}
            rows={[
              { label: t.inCount, value: shop.inbox.length, max: 10 },
              { label: t.waitCount, value: waiting, max: 10 },
            ]}
          />
          <JudgeBoard />
        </>
      ) : null}

      {tab === "how" ? (
        <div className="flex flex-col gap-10">
          {[t.methodWa, t.methodSms, t.methodBrevo, t.methodMpesa].map(
            (line, i) => (
              <article
                key={line}
                className={`rounded-md p-[17px] ${
                  i % 2 === 0
                    ? "bg-matcha-cream text-ink-black"
                    : "bg-bone-white text-ink-black"
                }`}
              >
                <p className="font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
                  {line}
                </p>
              </article>
            ),
          )}
        </div>
      ) : null}
    </TShell>
  );
}

export default function MessagingPage() {
  return (
    <Suspense>
      <MessagingInner />
    </Suspense>
  );
}
