# Duka architecture

**Wantam / Duka** · channel-agnostic shop operating system  
Scale: mama mboga → kiosk → supermarket aisle → multi-branch retail  
Companion to product intent in [Duka-PRD.md](./Duka-PRD.md)

WhatsApp is **one adapter**, not the product. Email, SMS, voice, till files, POS, and bank/M-Pesa payloads all become the same shop events. The agent drafts; rules score; humans (or policy) send.

---

## 1. What this system must do

| Job | Outcome |
| --- | --- |
| Hear the shop | Stock, sales, costs, and payments from whatever the retailer already uses |
| Remember buyers | Who bought what, how often, on which channel (consent-scoped) |
| Tell the truth | Best seller, dead stock, margin squeeze — deterministic ranks |
| Follow up | Draft ads and 1:1 on WhatsApp, SMS, email, later social; send only through the outbox gate |
| Prove the shop | Explainable micro-credit file with **no customer identifiers** |
| Fit the desk | Phone-only kiosk **or** staff dashboard + POS for a bigger floor |

Non-negotiable: LLM writes copy. It does not pick credit scores, invent customers, or send outreach.

---

## 2. Design principles

1. **Canonical events, many mouths.** Every channel maps to `MessageReceived`, `StockDelta`, `Sale`, `Payment`, `Expense`, `ConsentChange`. Nothing important lives only in a WhatsApp payload.
2. **Ports and adapters.** Domain never imports Meta, Africa’s Talking, Gmail, or a till vendor. Swap adapters without rewriting insights.
3. **One tenant model from day one.** `org` → `location` → `staff`. A kiosk is one org, one location, one owner. A chain is the same tables with more rows.
4. **Outbox is the only sender.** Drafts are not sends. `TUMA` / dashboard Approve / policy auto-send (big retail, explicit) all hit the same `outreach_log`.
5. **Rules before models.** Mix, lapsed, credit factors, ping caps are unit-tested TypeScript. The model gets structured facts.
6. **PII minimisation.** Parse then redact. Nickname + last-4. Credit export strips the customer graph.
7. **Scale by extracting processes, not rewriting domain.** Start as a modular monolith. Split workers and API when queues and CPU demand it.

---

## 3. Who connects (small vs big)

| Retailer | How they work | What Duka binds |
| --- | --- | --- |
| Informal / kiosk | Voice notes, forwarded M-Pesa SMS, WhatsApp | WhatsApp + SMS inbound, STT |
| Small shop | Till notebook, email from supplier, SMS blasts | + email in/out, CSV, web dashboard |
| Growing duka | Part-time cashier, printed receipts | + staff logins, barcode/CSV POS dump |
| Supermarket / chain | POS, email, SMS shortcode, maybe WhatsApp Business | + POS adapter, multi-location, roles, API keys |

Same domain. Different **channel bindings** and **roles** per org.

---

## 4. Logical architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              Channel adapters               │
  WhatsApp Cloud    │  SMS (AT/Twilio)  Email (inbound+outbound)  │
  Voice notes       │  Web / PWA        POS / CSV / Excel         │
  M-Pesa SMS/Daraja │  Bank CSV         Social captions (manual)  │
  USSD (later)      │  Partner REST     Supplier email invoices   │
                    └────────────────────┬────────────────────────┘
                                         │ normalize
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │           Ingress + identity plane          │
                    │  org, location, staff, channel_account      │
                    │  consent per channel, customer preference   │
                    └────────────────────┬────────────────────────┘
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │              Canonical event bus            │
                    │     (Postgres outbox → Redis/BullMQ)        │
                    └────────────────────┬────────────────────────┘
                                         ▼
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼               ▼
    Inventory        Ledger          Customers       Insights         Agent
    SKU, stock       payments        sale_event      rules +          tools +
                     COGS            outreach_ok     credit scorer    copy
         └───────────────┴───────────────┴───────────────┴───────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │            Outbox + send gate               │
                    │  draft → approve (TUMA / UI / policy)       │
                    │  cap, quiet hours, channel preference       │
                    └────────────────────┬────────────────────────┘
                                         ▼
                         WhatsApp · SMS · Email · Status copy
                         Dashboard · SACCO file (stripped)
```

---

## 5. Canonical domain

### 5.1 Tenancy

| Entity | Role |
| --- | --- |
| `org` | Legal/shop owner (kiosk or company) |
| `location` | Single till / branch |
| `staff` | Owner, cashier, manager; WhatsApp user mapped to staff |
| `channel_account` | Phone, WhatsApp WABA, email inbox, SMS sender ID, POS shop id |

### 5.2 Commerce (unchanged intent from the PRD)

`sku`, `stock_event`, `ledger_entry`, `customer`, `sale_event`, `insight_card`, `campaign_draft`, `outreach_log`, `credit_snapshot`, `savings_goal`, `consent_event`

Add for scale:

| Entity | Role |
| --- | --- |
| `inbound_message` | Channel, external id, media refs, raw hash, parsed JSON |
| `integration` | Adapter type + credentials (vault) |
| `file_ingest` | CSV/XLSX/PDF job status |
| `idempotency_key` | Dedupe M-Pesa refs, email Message-IDs, POS receipt ids |

### 5.3 Event types (internal)

```
MessageReceived { org, location, channel, payload_ref, lang }
StockDeltaApplied { sku, qty, source }
SaleRecorded { sku, qty, kes, customer?, channel, at }
PaymentRecorded { amount, dir, method, ref, sku? }
InsightComputed { type, payload }     # no LLM
DraftCreated { channel, body, rule_id, customer? }
OutreachApproved { actor, draft_id }
OutreachSent { provider_message_id }
ConsentChanged { subject, channel, state }
CustomerForgotten { customer_id }
CreditSnapshotTaken { score, factors }  # no PII
```

---

## 6. Channel adapters

Each adapter implements:

- **Inbound:** verify webhook / poll / parse file → `MessageReceived` or direct `Sale`/`Payment`
- **Outbound:** `send(channel, to, body, media?)` used **only** by outbox
- **Health:** last success, error, rate limit

| Channel | Inbound (hear the shop) | Outbound (talk) | Small | Big |
| --- | --- | --- | --- | --- |
| WhatsApp | Text, voice, forwarded SMS screenshot/text | 1:1, later template | P0 | P1 (WABA) |
| SMS | Africa’s Talking / Twilio inbound, M-Pesa SMS | Follow-up, OTP, blasts | P0 | P0 |
| Email | **Brevo** inbound (invoices, order lines) | Receipts, weekly brief, campaigns | P1 | P0 |
| Voice | WhatsApp/phone voicemail → STT | Callbacks via agent draft | P0 | P2 |
| Web dashboard | Typed stock, paste SMS, upload CSV | Same drafts as chat | P1 | P0 |
| POS / CSV / Excel | Nightly till export, barcode sales | — | P2 | P0 |
| M-Pesa | Forwarded SMS; later Daraja C2B | STK is **not** required for v1 | P0 | P0 |
| Bank / card | CSV statement; later Paystack/Pesapal webhook | — | P2 | P1 |
| Social | — | Caption generator; human posts | P2 | P1 |
| USSD | Feature-phone stock verbs | Short menus | Next | Next |
| REST | Partner POS, Shopify/Woo later | Webhooks out | Next | P0 |

**Idempotency:** M-Pesa `receipt`, email `Message-ID`, POS `receipt_no`, WhatsApp `wamid`.

---

## 7. Shop agent

One **org-scoped** agent (not one global chatbot). Context: location, language, consent, open draft.

**Tools (domain, channel-blind):**  
`apply_stock_delta`, `post_ledger`, `tag_buyer`, `ingest_file_summary`, `get_week_rollup`, `get_behaviour`, `draft_followup`, `draft_ad`, `send_outreach` (gate only), `get_credit_file`, `share_credit_file`, `propose_save`, `forget_customer`

**Copy routing:** the agent chooses **channel + template**. The adapter sends bytes.

**Big retail mode:** cashier never sees credit share; manager approves bulk SMS in the dashboard; agent still cannot bypass outbox.

If margin-squeeze rules fire: **no ad drafts** that night — same as savings.

---

## 8. Insights and credit

Run in workers after events (and on a weekly schedule):

- SKU mix, repeat, lapsed, pairs, dead stock, WoW sales, COGS share
- Credit 0–100 five factors (PRD) — **export DTO omits customers, phones, campaign copy**
- Savings nudges only on surplus weeks

LLM: sentence generation from JSON cards only.

---

## 9. Trust plane

| Control | Behaviour |
| --- | --- |
| Org consent | Books/voice/email ingest |
| Customer `outreach_ok` + channel preference | WhatsApp / SMS / email separately |
| Send gate | Chat `TUMA`, UI Approve, or org policy `auto_send_transactional` (receipts only) |
| Caps | 1:1 marketing: 1 / 3 days / customer / org |
| Forget | Tombstone customer; stop future pings |
| Secrets | Channel tokens in a vault, not in SQLite files on a laptop for production |
| Demo | Fictional buyers; no live stranger wallets |

Marketing ≠ receipts. A payment receipt email can be transactional; “Amina, eggs leo” is marketing.

---

## 10. Tech stack of choice

One language (TypeScript) from webhook to board so adapters, tools, and rules share types.

| Concern | Choice | Why |
| --- | --- | --- |
| Language / runtime | **TypeScript on Node.js 22** | One domain, web, workers, agent tools |
| Monorepo | **pnpm + Turborepo** | `apps/*` + `packages/*` without a rewrite |
| HTTP API | **Hono** (`apps/api`) | Small, fast, adapters as routes; extract from Next later with no domain change |
| Web | **Next.js 15** (App Router) | Owner dashboard, judge board, file upload |
| ORM / SQL | **Drizzle + PostgreSQL 16** | Real tenants, JSON, jobs; SQLite **tests only** |
| Jobs / bus | **Redis + BullMQ** | Ingest, STT, insights, send retries |
| Objects | **S3-compatible (Cloudflare R2)** | Voice notes, CSV, invoice PDFs |
| Agent | **Vercel AI SDK** + Groq (or OpenAI-compatible) | Tool calling; swap models |
| STT | **Groq Whisper** | Swahili latency for voice |
| WhatsApp | **Meta Cloud API** | Official WABA |
| SMS | **Africa’s Talking** (primary KE) + **Twilio** adapter | Local + global |
| Email | **Brevo** inbound parse (webhook) + **Brevo** transactional/marketing send | One vendor for shop email in and out; still gated by outbox |
| Auth (web) | **Better Auth** | Staff sessions; WhatsApp remains a channel identity |
| Hosting | **Render** — Web Service (`api`/`web`), Background Worker (`worker`), Render PostgreSQL, Render Redis | Your host; scale workers independently |
| Secrets | Render env groups (prod) · `.env` local | Tokens for every adapter |
| Observability | **OpenTelemetry → Grafana / Axiom** | Trace from inbound id to sale_event |
| Tests | **Vitest** on `packages/insights` and parsers | Scorer and behaviour must not need an LLM |

**Explicitly not chosen for v1:** Kafka, multi-repo microservices, LangGraph, vector DB (aliases are a dictionary), Meta Ads APIs, live Daraja as the only money path.

---

## 11. Repository layout

```
apps/api              # Hono: webhooks, REST, agent invoke
apps/web              # Next.js dashboard + demo board
apps/worker           # BullMQ: stt, parse, insights, send
packages/domain       # entities, invariants
packages/db           # Drizzle schema + migrations
packages/channels     # whatsapp, sms, email, pos-csv, mpesa
packages/agent        # tool defs, system prompt, loop
packages/insights     # ranks, credit, caps (no I/O)
packages/outbox       # approve + dispatch
```

Night-of shortcut: one Render Web Service + one Background Worker, Render Postgres, Render Redis. Do not merge insights into the LLM package.

---

## 12. Build in three slices

| Slice | Ship | Infra |
| --- | --- | --- |
| **Night** | WhatsApp + paste SMS + Brevo sandbox or stub + board + TUMA | Render Web Service + worker, Render Postgres/Redis |
| **Launch** | Real AT SMS, **Brevo** in+out, dashboard staff, CSV POS | Same architecture, more adapters |
| **Scale** | Multi-location, POS vendor, Daraja, inbound email at volume | More Render workers, PgBouncer, per-org rate limits |

---

## 13. Quality bars

- Voice or file-to-board: interactive path under 10s on demo network (STT async with optimistic UI if needed)
- Duplicate M-Pesa receipt → one ledger row
- Credit snapshot tests: zero customer fields in export JSON
- Send without approval → fail closed
- Adapter down → ingest queue retries; shop agent says the channel is sick, does not hallucinate sales

---

## 14. Decision record

| Decision | Choice |
| --- | --- |
| Product surface | Multi-channel shop OS; WhatsApp is not the database |
| Architecture style | Modular monolith, ports & adapters |
| Source of truth | PostgreSQL canonical events |
| Agent | Tool-calling, org-scoped |
| Outreach | Unified outbox |
| Stack | TypeScript, Hono, Next.js, Drizzle, Postgres, Redis/BullMQ, Groq, AT + **Brevo** + Meta |
| Email | **Brevo** (inbound webhook + transactional/marketing API) |
| Hosting | **Render** (web, worker, Postgres, Redis) |

When a new retailer “form of data” appears (another till, another inbox), **add an adapter**. Do not add a second product.

---

*Duka architecture · Wantam · Cursor Kenya Build Night*
