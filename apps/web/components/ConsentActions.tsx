"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

export function ConsentActions() {
  const { t } = useLang();
  const [note, setNote] = useState("");

  async function send(action: "ndio" | "revoke") {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setNote(action === "ndio" ? t.consentOn : t.revoked);
  }

  return (
    <div className="flex flex-col gap-[17px]">
      <button
        type="button"
        onClick={() => send("ndio")}
        className="w-fit rounded-full border-0 bg-bone-white px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-pure-black"
      >
        {t.yes}
      </button>
      <button
        type="button"
        onClick={() => send("revoke")}
        className="w-fit font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white underline underline-offset-[3px]"
      >
        {t.revoke}
      </button>
      {note ? (
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
          {note}
        </p>
      ) : null}
    </div>
  );
}
