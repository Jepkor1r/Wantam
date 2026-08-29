# Wantam — Duka

Local folder: `C:\Users\USER\projects\Wantam`  
Remote: [github.com/Jepkor1r/Wantam](https://github.com/Jepkor1r/Wantam)

**WhatsApp shop manager for informal traders.** Cursor Kenya Build Night.

Voice notes keep stock honest. M-Pesa SMS keeps the books honest. Weekly insights tell the owner what made money. The same history becomes a SACCO-ready credit file.

## Run the app

```bash
pnpm install
pnpm dev
```

- Judge board: [http://localhost:3000](http://localhost:3000)
- Shop API: [http://localhost:3001/health](http://localhost:3001/health)
- WhatsApp webhook: `POST http://localhost:3001/webhooks/whatsapp` (tunnel with ngrok)

The board seeds **Mama Kuku Fresh** and can run the 90-second demo without Meta/Groq keys: speak stock, paste SMS, share the credit file, NDIO the savings nudge.

Copy `.env.example` to `.env` only when you have WhatsApp Cloud or Whisper keys.

```bash
pnpm test
```

## Folder layout (this repo)

```text
Wantam/
  docs/                 Product + stack
    Duka-PRD.md         Full PRD
    TECH-STACK.md       Stack broken down by section
  apps/
    board/              Live judge dashboard (Next.js)
    api/                Shop agent + webhooks
  packages/
    db/                 SQLite + Drizzle schema
    shared/             Types, SKU aliases
  services/
    whatsapp/           Cloud API adapter
    stt/                Whisper / Groq
    insights/           Best seller, costs, weekly rollup
```

## Tech stack by section

| Section | Folder | Stack |
| --- | --- | --- |
| 1. Channel | `services/whatsapp` | WhatsApp Cloud API, ngrok |
| 2. Speech | `services/stt` | Groq Whisper (Swahili), OpenAI fallback |
| 3. Agent | `apps/api` | TypeScript, Hono, Groq/OpenAI tools |
| 4. Data | `packages/db` | SQLite, Drizzle ORM |
| 5. Shared | `packages/shared` | TypeScript types, SKU aliases |
| 6. Insights | `services/insights` | SQL rollups + copy |
| 7. Credit + savings | `apps/api` | Pure TS scorer + nudge rules |
| 8. Judge board | `apps/board` | Next.js 15, Tailwind, 1s poll |
| 9. Runtime | whole repo | Node 20+, pnpm, TypeScript 5 |

**Rule:** the LLM writes sentences. TypeScript writes numbers (stock, scores, whether to nudge).

Full detail: **[docs/TECH-STACK.md](./docs/TECH-STACK.md)**  
Requirements and demo: **[docs/Duka-PRD.md](./docs/Duka-PRD.md)**

## Product (short)

- Voice-first inventory (Swahili / Sheng)
- Books from forwarded M-Pesa SMS (after NDIO)
- Owner analytics (best seller, biggest cost, margin)
- Micro-credit readiness file (trader must Share)
- Savings nudges on a real up-week
