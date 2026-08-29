"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BoardState } from "@wantam/shared";

const VOICE = "nimeuza kuku tatu, mayai trays mbili";
const SMS =
  "AMINA confirmed. You have received Ksh1,200.00 from Amina 254700000000 on 28/8/26 at 2:14 PM. New M-PESA balance is Ksh3,400. Transaction ID NAI123XYZ.";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/wantam-api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export function Board() {
  const [state, setState] = useState<BoardState | null>(null);
  const [voice, setVoice] = useState(VOICE);
  const [sms, setSms] = useState(SMS);
  const [chatInput, setChatInput] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await api<BoardState>("/board/state");
      setState(s);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "API down");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const t = setInterval(() => void refresh(), 1000);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [state?.chat.length]);

  async function run(path: string, body: unknown) {
    setBusy(true);
    try {
      const r = await api<{ text: string }>(path, { method: "POST", body: JSON.stringify(body) });
      setFlash(r.text);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    await run("/demo/text", { text });
  }

  if (!state) {
    return (
      <main className="grid min-h-screen place-items-center p-8">
        <p className="text-amber-200/80">{err ?? "Connecting to Wantam API…"}</p>
      </main>
    );
  }

  const credit = state.credit;

  return (
    <main className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-maize">Wantam · Duka</p>
          <h1 className="font-display text-4xl text-amber-50 md:text-5xl">{state.trader.name}</h1>
          <p className="text-sm text-amber-200/70">
            Voice for stock. M-Pesa for money. Live for judges.
            {state.trader.consent ? " · Consent NDIO" : " · Waiting NDIO"}
          </p>
        </div>
        <div className="text-right text-xs text-amber-200/50">
          Board polls every 1s · updated {new Date(state.updatedAt).toLocaleTimeString()}
        </div>
      </header>

      {flash ? (
        <div className="card border-leaf/50 bg-leaf/10 text-lg text-emerald-100">{flash}</div>
      ) : null}
      {err ? <div className="card border-red-500/40 text-red-200">{err}</div> : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {state.stock.map((s) => {
          const low = s.onHand <= s.lowStock;
          return (
            <div key={s.id} className={`card ${low ? "border-clay/70" : ""}`}>
              <p className="text-xs uppercase tracking-wider text-amber-200/60">{s.unit}</p>
              <p className="font-display text-lg">{s.name}</p>
              <p className={`font-display text-4xl ${low ? "text-clay" : "text-maize"}`}>
                {s.onHand}
              </p>
              {low ? <p className="text-xs text-clay">Low stock</p> : null}
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="card flex h-[520px] flex-col lg:col-span-1">
          <h2 className="mb-2 font-display text-xl">WhatsApp</h2>
          <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {state.chat.length === 0 ? (
              <p className="text-sm text-amber-200/50">No messages yet. Send a voice line or SMS.</p>
            ) : (
              state.chat.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm ${
                    m.dir === "in"
                      ? "ml-auto bg-leaf/30 text-emerald-50"
                      : "bg-black/30 text-amber-50"
                  }`}
                >
                  {m.body}
                </div>
              ))
            )}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendChat();
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-full border border-amber-900/50 bg-black/30 px-3 py-2 text-sm"
              placeholder="Type like WhatsApp…"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-leaf px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>

        <div className="card lg:col-span-1">
          <h2 className="mb-2 font-display text-xl">Ledger</h2>
          <ul className="space-y-2 text-sm">
            {state.ledger.map((r) => (
              <li key={r.id} className="flex justify-between gap-2 border-b border-amber-900/30 pb-2">
                <span>
                  <span className={r.dir === "in" ? "text-leaf" : "text-clay"}>
                    {r.dir === "in" ? "+" : "−"}KSh {r.amountKes.toLocaleString()}
                  </span>
                  <span className="block text-amber-200/50">
                    {r.party} · {r.category}
                  </span>
                </span>
                <span className="text-amber-200/40">{new Date(r.at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h2 className="font-display text-xl">Sunday briefing</h2>
          {state.briefing ? (
            <>
              <p className="text-lg leading-snug">{state.briefing.copySw}</p>
              <p className="text-sm text-amber-200/60">{state.briefing.copyEn}</p>
            </>
          ) : (
            <p className="text-amber-200/50">No briefing yet.</p>
          )}
          <ul className="space-y-2">
            {state.insights.map((i) => (
              <li key={`${i.type}-${i.copyEn}`} className="rounded-xl bg-black/20 px-3 py-2 text-sm">
                <span className="text-maize">{i.type.replaceAll("_", " ")}</span>
                <span className="block">{i.copyEn}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h2 className="font-display text-xl">Micro-credit file</h2>
          {credit ? (
            <>
              <p className="font-display text-5xl text-maize">
                {credit.score}
                <span className="text-2xl text-amber-200/60"> / 100</span>
              </p>
              <p className="text-leaf">{credit.band}</p>
              {credit.shared ? (
                <p className="text-xs uppercase tracking-wider text-maize">Shared with SACCO</p>
              ) : (
                <p className="text-xs text-amber-200/50">Trader must Share — not auto-sent</p>
              )}
              <ul className="space-y-1 text-sm">
                {credit.factors.map((f) => (
                  <li key={f.id} className="flex justify-between gap-2">
                    <span>
                      {f.label}
                      <span className="block text-xs text-amber-200/40">{f.reason}</span>
                    </span>
                    <span className="text-maize">
                      {f.points}/{f.max}
                    </span>
                  </li>
                ))}
              </ul>
              {credit.shared ? (
                <div className="rounded-xl border border-leaf/40 bg-black/20 p-3 text-sm">
                  <p>{credit.officerSw}</p>
                  <p className="mt-2 text-amber-200/60">{credit.officerEn}</p>
                </div>
              ) : null}
            </>
          ) : (
            <p>No snapshot.</p>
          )}
          {state.savings ? (
            <div className="rounded-xl border border-maize/30 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wider text-maize">Savings</p>
              <p>
                {state.savings.name}: {state.savings.balanceKes} / {state.savings.targetKes} KES
              </p>
              {state.savings.pendingNudge ? (
                <p className="mt-1 text-sm text-emerald-100">{state.savings.pendingNudge}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-xl">90-second demo (no WhatsApp keys required)</h2>
        <p className="text-sm text-amber-200/60">
          Same loop as a voice note + forwarded SMS. Type in the WhatsApp pane, or use the buttons.
          Cloud API webhook: <code>/webhooks/whatsapp</code>.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Voice transcript
            <textarea
              className="mt-1 w-full rounded-xl border border-amber-900/50 bg-black/30 p-3 font-sans text-amber-50"
              rows={3}
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            M-Pesa SMS
            <textarea
              className="mt-1 w-full rounded-xl border border-amber-900/50 bg-black/30 p-3 font-sans text-amber-50"
              rows={3}
              value={sms}
              onChange={(e) => setSms(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            className="rounded-full bg-maize px-4 py-2 font-medium text-soil disabled:opacity-50"
            onClick={() => run("/demo/voice", { transcript: voice })}
          >
            Speak stock
          </button>
          <button
            disabled={busy}
            className="rounded-full bg-leaf px-4 py-2 font-medium text-white disabled:opacity-50"
            onClick={() => run("/demo/sms", { text: sms })}
          >
            Paste SMS
          </button>
          <button
            disabled={busy}
            className="rounded-full border border-amber-200/40 px-4 py-2 disabled:opacity-50"
            onClick={() => run("/demo/text", { text: "Share with SACCO" })}
          >
            Share credit file
          </button>
          <button
            disabled={busy}
            className="rounded-full border border-amber-200/40 px-4 py-2 disabled:opacity-50"
            onClick={() => run("/demo/text", { text: "NDIO" })}
          >
            NDIO save 500
          </button>
          <button
            disabled={busy}
            className="rounded-full border border-amber-200/40 px-4 py-2 disabled:opacity-50"
            onClick={() => run("/demo/text", { text: "HAPANA" })}
          >
            HAPANA
          </button>
          <button
            disabled={busy}
            className="rounded-full border border-clay/50 px-4 py-2 text-clay disabled:opacity-50"
            onClick={() => run("/demo/reset", {})}
          >
            Reset demo
          </button>
        </div>
      </section>
    </main>
  );
}
