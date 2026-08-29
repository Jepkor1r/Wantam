"use client";

import { HelpStrip } from "@/components/PaintBars";
import { JudgeBoard } from "@/components/JudgeBoard";
import { TShell, usePage } from "@/components/TShell";

export default function SavingsPage() {
  const { t } = usePage();
  return (
    <TShell kicker={t.saKicker} title={t.saTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.saDo}
        itHelps={t.saHelp}
      />
      <JudgeBoard />
    </TShell>
  );
}
