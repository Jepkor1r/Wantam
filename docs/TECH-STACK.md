# Tech stack — by section

Wantam (Duka) is a TypeScript monorepo. One language, one package manager, shippable in a Build Night.

**Package manager:** pnpm  
**Language:** TypeScript 5  
**Runtime:** Node.js 20+

---

## 1. Channel — WhatsApp

The trader never leaves WhatsApp.

| Piece | Choice | Why |
| --- | --- | --- |
| Messaging | WhatsApp Cloud API (Meta) | Official voice notes + text; no app install |
| Local tunnel (demo) | ngrok or Cloudflare Tunnel | Public HTTPS webhook for the phone |
| Media | Cloud API media download | Voice notes arrive as `.ogg` / opus |

**Folder:** `services/whatsapp`

---

## 2. Speech — voice notes to text

| Piece | Choice | Why |
| --- | --- | --- |
| STT | Groq Whisper (`whisper-large-v3`) | Fast, cheap, decent Swahili |
| Fallback | OpenAI Whisper | If Groq is down on demo night |
| Language hint | `sw` + allow English mix | Sheng / code-switch |

**Folder:** `services/stt`

Do not build your own ASR. Spend the night on SKU aliases and the agent.

---

## 3. Agent — shop brain

| Piece | Choice | Why |
| --- | --- | --- |
| API | Next.js Route Handlers **or** Hono on Node | Webhook + tools in one process for the night |
| LLM | Groq Llama 3.3 70B, or OpenAI `gpt-4.1-mini` | Tool calling + Sheng copy |
| Tools | Deterministic functions in TypeScript | Stock, ledger, credit score, savings — numbers never come from the model |
| Orchestration | Simple tool loop (no LangGraph tonight) | Debuggable in front of judges |

**Folder:** `apps/api`

**Rule:** the model writes *sentences*. TypeScript writes *numbers* (stock, score, nudge eligibility).

---

## 4. Data — inventory + ledger

| Piece | Choice | Why |
| --- | --- | --- |
| Database | SQLite | Zero ops, file on disk, easy demo reset |
| ORM | Drizzle ORM | Typed SQL, tiny, good for SQLite |
| Later | Postgres on Railway / Neon | When more than one trader is real |

**Folder:** `packages/db`  
**Shared types / SKU aliases:** `packages/shared`

Tables: `traders`, `sku`, `stock_event`, `ledger_entry`, `insight_card`, `credit_snapshot`, `savings_goal`, `consent_event`.

---

## 5. Insights — owner analytics

| Piece | Choice | Why |
| --- | --- | --- |
| Rollups | SQL + TypeScript (on-event + weekly) | Best seller / biggest cost must be deterministic |
| Copy | LLM from a JSON payload | “Tomato ndiyo best seller…” only after ranks exist |
| Schedule | `node-cron` in-process | No Redis on Build Night |

**Folder:** `services/insights`

---

## 6. Credit file + savings

| Piece | Choice | Why |
| --- | --- | --- |
| Credit score | Pure TypeScript scorer + unit tests | 0–100, five factors, LLM never picks the number |
| Savings rules | TypeScript (`+15%` WoW, skip squeeze weeks) | Same: rules first, copy second |
| Export | WhatsApp text + board view | PDF can wait |

**Folders:** logic lives in `apps/api` (credit + savings modules). Schema in `packages/db`.

---

## 7. Judge board — live UI

| Piece | Choice | Why |
| --- | --- | --- |
| App | Next.js 15 (App Router) | Fast to ship, projector-friendly |
| UI | Tailwind CSS | Speed over design system |
| Live updates | Server-Sent Events or 1s poll | Watch stock move when the voice note lands |
| Host (demo) | localhost + projector; optional Vercel | Board can stay local if the API is tunneled |

**Folder:** `apps/board`

---

## 8. Trust — consent and secrets

| Piece | Choice | Why |
| --- | --- | --- |
| Env | `.env` (never commit) | WhatsApp tokens, Groq/OpenAI keys |
| Consent | `consent_event` in SQLite | NDIO to read; Share to export credit file |
| SMS | Parse then redact | No full inbox of other people’s numbers |

---

## 9. What we are not using tonight

- Python FastAPI (unless you already live there) — stay in TS for one repo
- LangChain / LangGraph — extra moving parts
- Native Daraja / M-Pesa API — forwarded SMS only
- Redis, Kafka, Kubernetes
- Licensed credit bureau APIs

---

## Suggested install (when you start coding)

```text
Wantam/
  apps/board     pnpm create next-app (Tailwind)
  apps/api       Hono + @hono/node-server   OR Next route handlers inside board
  packages/db    drizzle-orm + better-sqlite3
  packages/shared
```

**Minimum keys:** Meta WhatsApp Cloud (phone number id, token, verify token) · Groq (or OpenAI) · ngrok authtoken for the webhook.
