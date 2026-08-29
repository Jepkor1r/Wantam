"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

export function PasteSms() {
  const { t } = useLang();
  const [raw, setRaw] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "paste", raw }),
    });
    setOk(t.inboxOk);
    setRaw("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-[17px]">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={t.pasteSms}
        className="min-h-28 rounded-md border border-ink-black bg-bone-white p-[17px] font-mono text-[12px] leading-[1] text-ink-black"
      />
      <button
        type="submit"
        className="w-fit rounded-full border-[2px] border-hi-vis-yellow bg-transparent px-[17px] py-3 font-ui text-[16px] font-bold tracking-[0.05em] text-hi-vis-yellow"
      >
        {t.parseTill}
      </button>
      {ok ? (
        <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em] text-bone-white">
          {ok}
        </p>
      ) : null}
    </form>
  );
}
