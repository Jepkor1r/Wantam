"use client";

import { ConsentActions } from "@/components/ConsentActions";
import { HelpStrip } from "@/components/PaintBars";
import { TShell, usePage } from "@/components/TShell";
import Link from "next/link";

export default function ConsentPage() {
  const { t } = usePage();
  return (
    <TShell kicker={t.coKicker} title={t.coTitle}>
      <article className="rounded-md bg-bone-white p-[17px] text-ink-black">
        <p className="font-ui text-[16px] leading-[1.15] tracking-[0.8px]">
          {t.coBody}
        </p>
      </article>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.coDo}
        itHelps={t.coHelp}
      />
      <ConsentActions />
      <Link
        href="/dashboard/channels"
        className="w-fit rounded-full border-[2px] border-hi-vis-yellow px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-hi-vis-yellow"
      >
        {t.bind}
      </Link>
    </TShell>
  );
}
