# Duka

**WhatsApp shop manager for informal traders**  
Product Requirements Document · v1.2  
Cursor Kenya Build Night

| Field | Value |
| --- | --- |
| Product | Duka |
| Version | 1.2 |
| Date | 28 August 2026 |
| Status | Ready to build |
| Audience | Build Night team, judges, future contributors |
| Themes | AI agents · Voice-first · Developer tools · African communities · Open innovation |

---

## 1. Executive summary

Kenya does not have a bookkeeping problem. It has a *tools built for people with offices* problem.

**Duka** is one WhatsApp number that runs a kiosk: voice notes keep stock honest, M-Pesa SMS keeps the books honest, **purchase behaviour** shows which products walk out the door and who comes back, the **shop agent** drafts ads and follow-ups on the channels the trader already uses, weekly insights tell the owner what actually made money, and the same history becomes a **micro-credit readiness file** a SACCO officer can read.

It merges two earlier pitches:

- **Wagon** — M-Pesa in, human weekly summary out. Brilliant on money. Blind on the shelf.
- **Duka Voice** — Sheng voice note in, inventory out. Brilliant on tomatoes. Blind on whether those tomatoes made money.

A kiosk is one business. Margin lives in the join. Repeat customers live in the next join: **what they bought last time**. Duka is both.

**One-liner:** Voice for stock. M-Pesa for money. Purchase memory for who buys what. An agent that follows up. A credit file for Monday morning.

---

## 2. Problem

Informal traders (mama mboga, kiosks, poultry sellers such as Mama Kuku Fresh) already generate the data:

- Voice notes they send suppliers every day
- M-Pesa SMS confirmations
- A paper notebook that never becomes a story a lender can trust
- Customer faces they remember, but no list of *who bought eggs last Friday*

They do not use accounting software because it assumes an office, a chart of accounts, and typing. They also cannot prove cashflow to a SACCO, so working capital stays informal and expensive.

Growth is the same story: they already advertise by shouting, WhatsApp status, and “nitakuita.” There is no CRM. Follow-up dies when the day gets busy. Paid ads on Facebook / Instagram assume a catalog and a pixel they do not have.

**Cost of the gap**

- Stock and till never talk → fake “good days”
- Best sellers and cost traps stay in someone’s head
- No clean history → no fair shot at micro-credit
- Surplus weeks become consumption, not restock savings
- Repeat buyers go quiet → the duka shouts at everyone instead of pinging Amina about eggs
- Ads spend (when it exists) has no link to what actually sold this week

---

## 3. Solution

Duka is a **long-running shop agent** on WhatsApp. No app install. No desktop. Consent first. Same agent, four jobs: shelf, till, **customer memory**, **outreach**.

| Loop | What happens | What they hear |
| --- | --- | --- |
| Morning | Voice: opening stock | Sawa. Feed iko 2. Nitakuambia ukifika 1. |
| Trade | Voice: *nimeuza tomato mbili, mahindi tano* | Tomato 8 left. Tomato inakwisha. |
| Payments | Forward M-Pesa SMS (after NDIO) | KSh 1,200 from Amina — tagged eggs |
| Purchases | Voice or SMS for feed / stock-in | Feed cost up. Margin inabana. |
| Behaviour | Same rows → who bought what, how often | Amina: eggs 3 weeks running. Mahindi haijasonga. |
| Follow-up | Agent drafts; trader taps NDIO to send | *Amina, mayai iko fresh leo. Unataka tray?* |
| Advertise | Status / SMS / later FB-IG copy from top SKUs | One status line + one SMS blast list, never silent |
| Sunday | They rest | Weekly roast in Sheng + English |
| Owner analytics | Same rows, no extra input | Tomatoes top seller. Feed biggest cost. |
| Capital | Trader taps Share | Explainable 0–100 credit file |
| Savings | Up-week + surplus | Set aside 500 KES for restocking? |

---

## 4. Goals and non-goals

### 4.1 Goals

| ID | Goal | Demo success |
| --- | --- | --- |
| G1 | Voice note updates stock live | Judges see counts move in under 10 seconds |
| G2 | M-Pesa SMS becomes a ledger row | Categorized income/expense on the board |
| G3 | Weekly briefing | “Feed is eating margin” lands in the room |
| G4 | Owner analytics | Best seller + biggest cost from the same data |
| G5 | Credit readiness | 0–100 file with reasons; trader must Share |
| G6 | Savings nudge + goal | “+15% this week — set aside 500 KES?” |
| G7 | Purchase behaviour | Board shows SKU mix + one repeat customer (Amina / eggs) |
| G8 | Agent follow-up | Draft WhatsApp ping from last purchase; send only on NDIO |
| G9 | Multi-channel copy | Same insight → WhatsApp + SMS draft; social marked Next |

### 4.2 Non-goals (not tonight)

- Licensed credit bureau or loan origination
- Safaricom Daraja production / live wallet scrape
- KRA eTIMS, USSD, native Android app
- Auto-disbursed credit
- Multi-branch, payroll, staff PINs
- Meta Ads Manager / Google Ads spend, pixels, or lookalike audiences
- Silent customer messaging (no send without trader NDIO)
- Buying or scraping phone books; no third-party data brokers

---

## 5. Users

**Trader (primary)**  
Mama mboga, kiosk, Mama Kuku. Speaks Swahili, Sheng, or mixed English. Lives in WhatsApp. Will not become an accountant or a performance marketer.

**Customer (secondary, consented)**  
Pays via M-Pesa or cash (voice-tagged). May receive a follow-up **only** if the trader sends it and (for named outreach) the customer has been marked as OK to ping. Demo uses fictional buyers.

**SACCO / microfinance officer**  
Needs 8–12 weeks of *explainable* cashflow, not a black-box score. Reads a one-pager the trader forwards. Does **not** see customer names on the credit file.

**Builder / judge**  
Needs a live loop, open intents, and a capital punchline — not a slide that says “imagine.” Behaviour + follow-up is the second hook: same SKU on the shelf, in the books, and in a message to Amina.

---

## 6. Product requirements

### 6.1 Voice-first inventory

- Accept WhatsApp voice notes in Swahili, Sheng, and English code-switch.
- Transcribe, parse SKUs and units, apply stock deltas.
- Alias dictionary (example: *nyanya* = tomato).
- If ambiguous: **one** clarifying question, never a form.
- Low-stock: at most one ping per SKU per day.

### 6.2 Books from M-Pesa

- First message: explain that Duka reads voice notes and SMS for stock and money only. Continue only on **NDIO**. Revoke anytime.
- Parse forwarded M-Pesa SMS (amount, party, till, reference).
- Categorize income/expense; link to SKU when confident.
- Store amounts and categories; do not keep a full raw inbox after parse.

### 6.3 Weekly briefing

Plain language, Sheng + English. Must include:

- Sales vs last week
- One margin or cost warning
- One behaviour line when data exists (top SKU, or one lapsed regular)
- Fail-soft if data is thin (do not invent profit or invent customers)

**Example (Mama Kuku):**  
*Ulitengeneza asilimia 40 zaidi kuliko wiki iliyopita. Lakini chicken feed inakula margin. Amina alinunua mayai weeks tatu — week hii hajaonekana. Next week: usinunue feed ya duka ile ile bila kuangalia bei.*

### 6.4 Owner growth / analytics

No extra input. Insights are **deterministic rules**; the model only writes the sentence.

| Insight | Rule | Example copy |
| --- | --- | --- |
| Best seller | Highest sales KSh among SKUs with ≥ 3 events | Tomatoes are your top seller |
| Biggest cost | Highest expense share | Chicken feed is your biggest cost |
| Dead stock | Units in stock, zero sales for 7 days | Mahindi haijasonga — punguza order |
| Margin squeeze | COGS / sales up vs last week | Feed costs are eating your margin |
| Thin data | Not enough events | Data bado kidogo — hatuwezi kusema best seller |

### 6.5 Micro-credit readiness (financial inclusion)

Duka does **not** decide loans. It produces a **Micro-credit readiness file** the trader can show a human officer.

**Score: 0–100. Five labeled factors. The LLM never picks the number.**

| Factor | Max points | What we measure |
| --- | --- | --- |
| Record streak | 25 | Consecutive weeks with ≥ 3 stock events and ≥ 1 money event |
| Cashflow stability | 25 | Share of weeks in surplus; income variance band |
| Expense discipline | 20 | COGS/sales vs prior week; concentration of one cost line |
| Stock hygiene | 15 | Voice updates vs sales SMS (shelf matches books) |
| Savings habit | 15 | Nudges accepted; goal progress |

**Bands**

| Score | Label |
| --- | --- |
| 80–100 | Strong file |
| 60–79 | Ready with notes |
| 40–59 | Building history |
| 0–39 | Too early |

**Demo snapshot (illustrative Mama Kuku, 4 weeks): 72 / 100 — Ready with notes**  
Streak 18 · cashflow 20 · margin 12 (feed concentrated) · stock hygiene 14 · savings 8.

**Share gate:** reading SMS/voice is one consent. Exporting the file is a second act (**Share with SACCO**). Log who, when, snapshot id. No silent upload.

**What the officer sees:** weeks logged, surplus weeks, top cost concentration, whether books match shelf, savings habit, and caveats in Swahili and English. **No customer names, no phone numbers, no campaign copy.**

### 6.6 Savings nudges

Named goal (example: Restock 5,000 KES). One question. Reply **NDIO** / **HAPANA** / a KSh amount.

| Trigger | Behaviour |
| --- | --- |
| Sales +15% week-on-week and net surplus covers the ask | *You made 15% more this week — want to set aside 500 KES for restocking?* |
| Best-seller SKU low + surplus | *Tomato inakwisha. Weka 300 kwa restock?* |
| Feed-spike / margin-squeeze week | **Do not** ask to save. Warn on margin first. |

### 6.7 Behavioural purchase analytics

The books already know *that* money moved. Behaviour is *what product, which buyer, how often*. Built from the same voice + SMS rows — no extra app.

**What we store (after trader NDIO)**

- Sale event: SKU, units, KSh, time, source (voice \| M-Pesa)
- Buyer handle when present: M-Pesa name / phone last-4 / trader-given nickname (`Amina`)
- Cash sales stay SKU-only unless the trader names the buyer in the voice note

**Deterministic cards (LLM writes copy only)**

| Card | Rule | Example copy |
| --- | --- | --- |
| Basket / mix | Share of week sales KSh by SKU | Mayai 40%. Kuku 35%. Feed 0% (expense). |
| Repeat rhythm | Same buyer + same SKU ≥ 2 distinct weeks | Amina: mayai, 3 weeks |
| Lapsed regular | Repeat buyer, no sale in 7 days (configurable) | Amina hajaonekana since last Friday |
| First-time vs returning | Returning buyers’ KSh share | 60% of sales from people you’ve seen before |
| Attach / pair | Two SKUs in same day for same buyer ≥ 2 times | Eggs + sukuma often together — mention both |
| Quiet SKU | In catalog, sales below threshold | Mahindi: 1 sale, still 20 units |

**Privacy rules**

- Nickname + last-4, not a dump of full M-Pesa inbox
- Customer graph is for the **trader’s shop**, not sold, not used to score credit
- Credit file aggregates SKUs only
- Delete / forget: trader can say *futa Amina* — tombstone the customer row

**Thin data:** fewer than 3 tagged sales → *Bado hatujui nani anarudi. Tag jina next sale.* Never invent Amina.

### 6.8 Advertise and follow-up (multi-channel)

Duka does not run a silent ad network. The **agent proposes**; the **trader sends**.

**Channel ladder**

| Channel | Build Night | Role |
| --- | --- | --- |
| WhatsApp (1:1) | P0 | Follow up a named regular (Amina / eggs) |
| WhatsApp Status copy | P1 | One line from best seller or restock |
| SMS (trader’s SIM / Africa’s Talking later) | P1 | Same copy, short; list of consented numbers |
| Facebook / Instagram / TikTok caption | Next | Image caption + hashtags from top SKUs; trader posts manually |
| Paid Meta / Google ads | Cut / later | Out of scope until catalog + consent are real |

**Follow-up types (rules engine picks the type; agent writes the words)**

| Type | Trigger | Must not |
| --- | --- | --- |
| Restock ping | Regular’s usual SKU is in stock again | Ping if SKU is out |
| Lapsed regular | No purchase 7+ days, was a repeat | Guilt, debt-shaming, or “you owe us” |
| Bundle nudge | Pair rule fired | Invent a pair from one event |
| Status blast | Best seller or surplus SKU | Claim discounts we cannot honour |
| Quiet week | Thin sales | Blast the whole contact list |

**Send gate (non-negotiable)**

1. Trader has shop-level consent (NDIO) for Duka to *draft* outreach.
2. For 1:1: customer is tagged `outreach_ok` (trader said they asked, or demo fixture).
3. Agent shows **preview** in WhatsApp: channel, who, why (rule id), message.
4. Trader replies **TUMA** / **NDIO** to send, **HAPANA** to drop, or edits the line.
5. Log `outreach_log`: who, channel, template, timestamp, snapshot of rule. Cap: **one 1:1 ping per customer per 3 days**.

**Copy constraints:** Sheng + English mix matching the trader. No fake scarcity. No loan offers. No sharing another customer’s purchases.

**Example preview**

*Follow-up · WhatsApp · Amina · reason: lapsed_regular (mayai)*  
*Amina, mayai fresh iko leo. Tray bado 6. Unataka nikuwekee?*  
Reply **TUMA** / **HAPANA**.

### 6.9 Shop AI agent (expanded)

One long-running agent, not a chatbot FAQ. Tool-calling. One clarifying question. Never a dashboard the trader must learn.

**Jobs**

| Job | Tools | Human gate |
| --- | --- | --- |
| Shelf | `apply_stock_delta` | Clarify SKU if unsure |
| Till | `post_ledger` | Consent already on |
| Memory | `get_behaviour`, `tag_buyer` | Trader names cash buyers |
| Outreach | `draft_followup`, `draft_ad`, `send_outreach` | TUMA / HAPANA |
| Sunday | `get_week_rollup` | None (read-only) |
| Capital | `get_credit_file`, `share_credit_file` | Share |
| Savings | `propose_save` | NDIO / HAPANA / amount |

**Personality:** shop assistant, not a marketer. Lead with stock and money. Outreach is optional and quiet. If margin is squeezing, **do not** pitch ads — warn on feed cost first (same as savings).

---

## 7. Functional and non-functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | Accept WhatsApp voice notes (Swahili / Sheng / English mix) | P0 |
| FR-02 | Transcribe and apply stock deltas with alias dictionary | P0 |
| FR-03 | Parse forwarded M-Pesa SMS into the ledger after NDIO | P0 |
| FR-04 | Reply in the trader’s language; one question if ambiguous | P0 |
| FR-05 | Weekly briefing: sales WoW, margin, one cost warning | P0 |
| FR-06 | Best seller / biggest cost / dead stock cards | P1 |
| FR-07 | Credit readiness 0–100 with five labeled factors | P1 |
| FR-08 | Share credit file as WhatsApp text + board view | P1 |
| FR-09 | Savings goals + NDIO/HAPANA/amount; balance display | P1 |
| FR-10 | Low-stock flag once per SKU per day | P2 |
| FR-11 | Sale events linked to SKU + optional buyer handle | P0 |
| FR-12 | Behaviour cards: mix, repeat, lapsed (deterministic) | P1 |
| FR-13 | Draft 1:1 WhatsApp follow-up from a behaviour rule | P0 |
| FR-14 | Send outreach only after TUMA/NDIO; log + 3-day cap | P0 |
| FR-15 | Draft SMS + Status copy from the same insight | P1 |
| FR-16 | Social caption generator (manual post) | P2 |
| NFR-01 | Voice-to-board under 10 seconds on demo network | P0 |
| NFR-02 | No PII of real third parties in the demo | P0 |
| NFR-03 | Scorer and behaviour ranks are unit-testable; LLM only writes copy | P1 |
| NFR-04 | Credit file never includes customer identifiers | P0 |
| NFR-05 | No outbound customer message without trader confirm | P0 |

---

## 8. System architecture

One agent, two ears (voice, SMS), writers for inventory, ledger, consent, **customers**, **outreach**. Insights job fans out to briefing, behaviour cards, credit file, savings, and **draft campaigns**.

```
WhatsApp
   → Ingress (voice note | forwarded SMS | text)
        → Speech-to-text (Whisper / Groq, Swahili)
        → M-Pesa SMS parser (regex + model for messy shapes)
             → Shop agent (tool calls, one clarifying question)
                  → Inventory
                  → Ledger
                  → Customers + sale_events
                       → Insights worker (on-event + weekly)
                            → Briefing copy
                            → Behaviour cards (deterministic)
                            → Credit snapshot (deterministic scorer)
                            → Savings nudge (rules engine)
                            → Outreach drafts (rules → copy)
                                 → Outbox → WhatsApp + judge board
                                      → send_outreach only after TUMA
```

**Trust plane (non-negotiable)**

- `consent_state`: none / ndio / revoked
- SMS redacted or hashed after parse
- `credit_share_log`: actor, time, snapshot id
- `outreach_ok` per customer; `outreach_log` on every send
- No Daraja production on Build Night
- Fail-soft: thin data → say so
- Credit export strips customer graph

### 8.1 Night-of services

| Service | Role |
| --- | --- |
| whatsapp-webhook | Cloud API, media download |
| stt | Groq / Whisper, Swahili |
| sms-parser | M-Pesa message shapes |
| agent | Intents, tools, copy |
| inventory | SKUs, stock events |
| ledger | Income, expense, categories |
| customers | Handles, outreach_ok, forget |
| behaviour | Mix, repeat, lapsed, pairs |
| outreach | Drafts, caps, channel, send gate |
| insights-worker | Weekly + on-event rollups |
| credit-file | Deterministic 0–100 + reasons |
| savings | Goals, nudges, NDIO amounts |
| board | Next.js projector for judges |

### 8.2 Agent tools

| Tool | Does | Must not |
| --- | --- | --- |
| apply_stock_delta | Parse units and aliases | Guess SKU silently |
| post_ledger | Income/expense + category | Originate a loan |
| tag_buyer | Attach nickname / last-4 to a sale | Scrape a phone book |
| get_week_rollup | Sales, COGS, SKU ranks | Hallucinate ranks |
| get_behaviour | Mix, repeats, lapsed, pairs | Invent customers |
| draft_followup | One 1:1 message + reason id | Send it |
| draft_ad | Status / SMS / social caption | Place a paid ad |
| send_outreach | After TUMA, respect cap | Silent or bulk-without-list |
| get_credit_file | Deterministic score + reasons | Change weights ad hoc; include names |
| propose_save | One nudge if rules pass | Nudge on squeeze weeks |
| share_credit_file | After explicit Share | Auto-send to a lender |

### 8.3 Data model

| Table | Key fields | Used by |
| --- | --- | --- |
| traders | id, wa_number, lang, consent_at | All |
| sku | id, aliases, unit, low_stock, trader_id | Voice parse, insights |
| stock_event | sku, delta, source (voice\|sms), raw_ref | Inventory, hygiene score |
| ledger_entry | amount, dir, category, sku?, mpesa_ref | Books, credit, savings |
| customer | trader_id, nickname, mpesa_last4, outreach_ok | Behaviour, follow-up |
| sale_event | customer_id?, sku, units, kes, at, source | Behaviour cards |
| insight_card | week, type, payload, copy_sw, copy_en | Briefing, board |
| campaign_draft | channel, body, rule_id, status | Outreach preview |
| outreach_log | customer_id, channel, at, rule_id | Caps, audit |
| credit_snapshot | score, factors JSON, valid_from | SACCO export |
| savings_goal | name, target_kes, balance, active | Nudges |
| consent_event | kind, at, channel | Trust, share gate |

---

## 9. Privacy and consent

1. **Onboard:** *Duka itasoma voice notes na SMS kwa stock na pesa tu. Hapana share. Reply NDIO.*
2. **Operate:** parse, categorize, brief. Build SKU + optional buyer memory **inside the shop**.
3. **Outreach:** *Duka inaweza kuandika message kwa Amina. Hautumiwi mpaka useme TUMA.* Separate from books consent if we need a second NDIO on first draft.
4. **Share credit file:** separate explicit Share. Logged. **No customer list on that file.**
5. **Forget:** *futa Amina* removes the customer row and future pings.
6. **Demo:** dedicated test number, sample SMS, **fictional** Amina. Never a stranger’s live wallet or live customer blast.
7. **No third-party marketing lists.** Status/SMS/social copy is for the trader to post or send themselves unless they confirm TUMA on a consented 1:1.

Duka is a **file for a human officer**, not a licensed bureau and not a loan decision. It is also **not** an ad network.

---

## 10. Build Night scope

| Ship tonight | Next | Cut |
| --- | --- | --- |
| Voice → stock live on the board | Credit share PDF | Native M-Pesa API / Daraja production |
| Paste SMS → ledger + category + SKU tag | Credit sales (*anadaiwa*) | Multi-branch, staff PINs, payroll |
| Sale → buyer nickname (Amina) on board | Multi-SKU packs | USSD, Android app, KRA eTIMS |
| One behaviour card (repeat or mix) | SMS via Africa’s Talking | Auto-disburse loans |
| Draft + TUMA WhatsApp follow-up | WhatsApp Status helper | Bureau license |
| Weekly briefing SW + EN | SACCO portal view | Silent lender upload |
| One insight card (best seller / biggest cost) | Facebook/IG caption + image prompt | Meta/Google paid ads, pixels |
| Credit snapshot on the board | Longer history scoring | Data-broker audiences |
| One savings NDIO on an up-week | Recurring auto-save | Silent customer messaging |

**Suggested stack:** WhatsApp Cloud API · Whisper/Groq · LLM agent · SQLite · small Next.js board.

**Developer-tools angle:** open-source Swahili commerce intents (SKU aliases, stock verbs, follow-up templates) and a Cursor skill so others fork Duka for ugali, mitumba, or boda parts.

---

## 11. Judge demo (90 seconds)

Phone on a stand. WhatsApp open. Projector on the live board.

| Time | Action | Room sees |
| --- | --- | --- |
| 0–10s | Speak Sheng | *nimeuza kuku tatu, mayai trays mbili* |
| 10–25s | Agent replies | Stock: kuku 37. Mayai 6 trays. |
| 25–40s | Paste sample M-Pesa SMS | Ledger: KSh 1,200 Amina — mayai |
| 40–55s | Behaviour card | Amina: mayai 3 weeks. Mix: mayai 40%. |
| 55–70s | Weekly briefing + insight | Tomato top seller. Feed biggest cost. |
| 70–85s | Follow-up preview → TUMA | Draft to Amina; outbox ticks sent |
| 85–90s | Credit file + savings | 72/100 Ready with notes. *Set aside 500 KES?* |

The join is the hook: **same SKU on the shelf, in the books, and in a message to the person who actually buys it — plus a file a SACCO can take seriously.**

---

## 12. Success metrics (after the night)

| Metric | Meaning |
| --- | --- |
| Time-to-first-stock-update | Seconds from voice note to board |
| Categorization rate | Share of SMS rows auto-tagged with high confidence |
| Insight honesty | Zero invented bestsellers on thin weeks |
| Behaviour honesty | Zero invented customers; tagged-sale rate |
| Follow-up accept rate | TUMA vs HAPANA; no sends without TUMA |
| Channel mix | Share of drafts that stay WhatsApp vs SMS vs social |
| Share rate | Traders who export a credit file (consented) |
| Nudge quality | Nudges only on surplus weeks; skip squeeze weeks |

---

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| Hallucinated bestsellers | Deterministic ranks; fail-soft copy |
| Hallucinated customers | Require tagged sale_event; fail-soft |
| Spam / “Duka is harassing my buyers” | TUMA gate, 3-day cap, outreach_ok, forget |
| Credit file leaks names | Strip customer graph on export; tests |
| “We score loans” lands badly | Position as summary for a human officer |
| Consent as theater | NDIO, TUMA, and Share as real states, logged |
| M-Pesa SMS formats drift | Regex + model; uncategorized bucket |
| Sheng / code-switch STT errors | Alias dictionary + one clarifying question |
| Scope blow for ads | Paid social is Cut; captions are Next |

---

## 14. Positioning

**Sunday:** Duka tells the owner the truth — including who stopped buying eggs.  
**Monday:** the same rows become a file a SACCO can read.  
**Tuesday:** if they want, the agent drafts one message. They still tap send.

Bookkeeping is the means. Memory of the shelf and the customer is the next means. The product is a duka that can prove it is alive — without anyone becoming an accountant or a media buyer.

---

*End of document · Duka PRD v1.2 · Cursor Kenya Build Night*
