"use client";

import { Ghost } from "@/components/Ghost";
import { LangGlobe } from "@/components/LangGlobe";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export function HomeHero() {
  const { t } = useLang();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-dusk-violet">
      <div className="absolute top-[17px] right-5 z-20">
        <LangGlobe light />
      </div>
      <p className="px-5 py-[17px] text-center font-display text-[30px] font-extrabold leading-[0.9] tracking-[0.02em] text-hi-vis-yellow [font-feature-settings:'calt'_0]">
        DUKA
      </p>
      <div className="relative flex min-h-[calc(100dvh-80px)] flex-col items-center px-5 pb-16">
        <h1 className="text-center font-display text-[clamp(72px,14vw,244px)] font-black leading-[0.82] tracking-[0.02em] [font-variation-settings:'wdth'_125] [font-feature-settings:'calt'_0]">
          <span className="text-hi-vis-yellow">SHELF.</span>
          <br />
          <span className="inline-flex items-center justify-center text-buttery-yellow">
            T
            <Ghost className="mx-[-0.06em] inline-block h-[0.92em] w-auto translate-y-[0.08em]" />
            LL.
          </span>
          <br />
          <span className="text-hi-vis-yellow">PING.</span>
        </h1>
        <p className="mt-8 max-w-md text-center font-ui text-[16px] leading-[1.15] tracking-[0.8px] text-bone-white">
          {t.tagline}
        </p>
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="rounded-full border-0 bg-bone-white px-[17px] py-3 font-ui text-[16px] font-bold leading-none tracking-[0.05em] text-pure-black"
          >
            {t.enter}
          </Link>
        </div>
      </div>
    </main>
  );
}
