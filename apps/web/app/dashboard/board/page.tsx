"use client";

import { HelpStrip } from "@/components/PaintBars";
import { JudgeBoard } from "@/components/JudgeBoard";
import { TShell, usePage } from "@/components/TShell";

export default function BoardPage() {
  const { t } = usePage();
  return (
    <TShell kicker={t.boKicker} title={t.boTitle}>
      <HelpStrip
        doLabel={t.youDo}
        helpLabel={t.itHelps}
        youDo={t.boDo}
        itHelps={t.boHelp}
      />
      <JudgeBoard />
    </TShell>
  );
}
