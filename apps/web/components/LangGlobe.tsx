"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3c2.8 3 4.2 6 4.2 9s-1.4 6-4.2 9c-2.8-3-4.2-6-4.2-9S9.2 6 12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function LangGlobe({ light = false }: { light?: boolean }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const options: { id: Lang; label: string }[] = [
    { id: "en", label: t.english },
    { id: "sw", label: t.kiswahili },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={t.languages}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-[2px] ${
          light
            ? "border-hi-vis-yellow text-hi-vis-yellow"
            : "border-bone-white text-bone-white"
        }`}
      >
        <GlobeIcon className="h-5 w-5" />
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 min-w-40 rounded-md bg-bone-white p-[17px] text-ink-black">
          <p className="font-mono text-[12px] leading-[0.8] tracking-[0.05em]">
            {t.languages}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setLang(opt.id);
                  setOpen(false);
                }}
                className={`rounded-md px-2 py-2 text-left font-ui text-[16px] font-bold tracking-[0.05em] ${
                  lang === opt.id ? "bg-hi-vis-yellow text-pure-black" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
