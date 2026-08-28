# Wantam — Duka

**Shop operating system for informal and formal retail.**  
Cursor Kenya Build Night.

Voice, SMS, email, till files, POS, and M-Pesa all become the same shop events. WhatsApp is one channel, not the product. Purchase history shows what walked out the door. The shop agent drafts follow-ups on WhatsApp, SMS, and email. Weekly insights tell the owner what made money. The same history becomes a micro-credit readiness file a SACCO officer can read.

Remote: [github.com/Jepkor1r/Wantam](https://github.com/Jepkor1r/Wantam)

## Folder layout (this repo)

```text
Wantam/
  docs/                 Product + stack
    Duka-PRD.md         Full PRD
    TECH-STACK.md       Stack broken down by section
  ARCHITECTURE.md       Multi-channel system design (Brevo, Render)
  apps/
    web/                Live dashboard (Next.js, Flying Papers)
    board/              Judge-board notes
    api/                Shop agent + webhooks
  packages/
    db/                 SQLite + Drizzle schema
    shared/             Types, SKU aliases
  services/
    whatsapp/           Cloud API adapter
    stt/                Whisper / Groq
    insights/           Best seller, costs, weekly rollup
  design/               Poster / token preview
```

## Tech stack by section

| Section | Folder | Stack |
| --- | --- | --- |
| 1. Channel | `services/whatsapp` | WhatsApp Cloud API, ngrok |
| 2. Speech | `services/stt` | Groq Whisper (Swahili), OpenAI fallback |
| 3. Agent | `apps/api` | TypeScript, Hono or Next routes, Groq/OpenAI tools |
| 4. Data | `packages/db` | SQLite, Drizzle ORM |
| 5. Shared | `packages/shared` | TypeScript types, SKU aliases |
| 6. Insights | `services/insights` | SQL rollups + LLM copy |
| 7. Credit + savings | `apps/api` | Pure TS scorer + nudge rules |
| 8. Judge board | `apps/web` | Next.js 15, Tailwind, live updates |
| 9. Runtime | whole repo | Node 20, pnpm, TypeScript 5 |

**Rule:** the LLM writes sentences. TypeScript writes numbers (stock, scores, whether to nudge).

Full detail: **[docs/TECH-STACK.md](./docs/TECH-STACK.md)**  
Requirements and demo: **[docs/Duka-PRD.md](./docs/Duka-PRD.md)**  
System design: **[ARCHITECTURE.md](./ARCHITECTURE.md)** (email: **Brevo**, host: **Render**)

## Product

**Duka** runs a kiosk or a floor. Phone-first for a mama mboga; dashboard + POS ingest for a bigger retailer. Consent first.

- Voice-first inventory (Swahili / Sheng) plus typed / CSV / POS
- Books from M-Pesa SMS, later Daraja, email invoices, bank CSV
- Behavioural purchase analytics (what sold, to whom, how often)
- AI shop agent: stock, books, advertise + follow up (WhatsApp, SMS, email, later social captions)
- Owner analytics (best seller, biggest cost, margin)
- Micro-credit readiness score (explainable, trader must Share)
- Savings nudges tied to a restock goal
