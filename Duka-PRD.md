# Duka

**WhatsApp shop manager for informal traders**  
Product Requirements Document · v1.1  
Cursor Kenya Build Night

| Field | Value |
| --- | --- |
| Product | Duka |
| Version | 1.1 |
| Date | 28 August 2026 |
| Status | Ready to build |
| Audience | Build Night team, judges, future contributors |
| Themes | AI agents · Voice-first · Developer tools · African communities · Open innovation |

---

## 1. Executive summary

Kenya does not have a bookkeeping problem. It has a *tools built for people with offices* problem.

**Duka** is one WhatsApp number that runs a kiosk: voice notes keep stock honest, M-Pesa SMS keeps the books honest, weekly insights tell the owner what actually made money, and the same history becomes a **micro-credit readiness file** a SACCO officer can read.

It merges two earlier pitches:

- **Wagon** — M-Pesa in, human weekly summary out. Brilliant on money. Blind on the shelf.
- **Duka Voice** — Sheng voice note in, inventory out. Brilliant on tomatoes. Blind on whether those tomatoes made money.

A kiosk is one business. Margin lives in the join. Duka is that join.

**One-liner:** Voice for stock. M-Pesa for money. Insights for the owner. A credit file for Monday morning.

---

## 2. Problem

Informal traders (mama mboga, kiosks, poultry sellers such as Mama Kuku Fresh) already generate the data:

- Voice notes they send suppliers every day
- M-Pesa SMS confirmations
- A paper notebook that never becomes a story a lender can trust

They do not use accounting software because it assumes an office, a chart of accounts, and typing. They also cannot prove cashflow to a SACCO, so working capital stays informal and expensive.

**Cost of the gap**

- Stock and till never talk → fake “good days”
- Best sellers and cost traps stay in someone’s head
- No clean history → no fair shot at micro-credit
- Surplus weeks become consumption, not restock savings

---

## 3. Solution

Duka is a **long-running shop agent** on WhatsApp. No app install. No desktop. Consent first.

| Loop | What happens | What they hear |
| --- | --- | --- |
| Morning | Voice: opening stock | Sawa. Feed iko 2. Nitakuambia ukifika 1. |
| Trade | Voice: *nimeuza tomato mbili, mahindi tano* | Tomato 8 left. Tomato inakwisha. |
| Payments | Forward M-Pesa SMS (after NDIO) | KSh 1,200 from Amina — tagged eggs |
| Purchases | Voice or SMS for feed / stock-in | Feed cost up. Margin inabana. |
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

### 4.2 Non-goals (not tonight)

- Licensed credit bureau or loan origination
- Safaricom Daraja production / live wallet scrape
- KRA eTIMS, USSD, native Android app
- Auto-disbursed credit
- Multi-branch, payroll, staff PINs

---

## 5. Users

**Trader (primary)**  
Mama mboga, kiosk, Mama Kuku. Speaks Swahili, Sheng, or mixed English. Lives in WhatsApp. Will not become an accountant.

**SACCO / microfinance officer**  
Needs 8–12 weeks of *explainable* cashflow, not a black-box score. Reads a one-pager the trader forwards.

**Builder / judge**  
Needs a live loop, open intents, and a capital punchline — not a slide that says “imagine.”

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
- Fail-soft if data is thin (do not invent profit)

**Example (Mama Kuku):**  
*Ulitengeneza asilimia 40 zaidi kuliko wiki iliyopita. Lakini chicken feed inakula margin. Next week: usinunue feed ya duka ile ile bila kuangalia bei.*

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

**What the officer sees:** weeks logged, surplus weeks, top cost concentration, whether books match shelf, savings habit, and caveats in Swahili and English.

### 6.6 Savings nudges

Named goal (example: Restock 5,000 KES). One question. Reply **NDIO** / **HAPANA** / a KSh amount.

| Trigger | Behaviour |
| --- | --- |
| Sales +15% week-on-week and net surplus covers the ask | *You made 15% more this week — want to set aside 500 KES for restocking?* |
| Best-seller SKU low + surplus | *Tomato inakwisha. Weka 300 kwa restock?* |
| Feed-spike / margin-squeeze week | **Do not** ask to save. Warn on margin first. |

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
| NFR-01 | Voice-to-board under 10 seconds on demo network | P0 |
| NFR-02 | No PII of real third parties in the demo | P0 |
| NFR-03 | Scorer is unit-testable; LLM only writes copy | P1 |

---

## 8. System architecture

One agent, two ears (voice, SMS), three writers (inventory, ledger, consent), one insights job that fans out to briefing, credit file, and savings.

```
WhatsApp
   → Ingress (voice note | forwarded SMS | text)
        → Speech-to-text (Whisper / Groq, Swahili)
        → M-Pesa SMS parser (regex + model for messy shapes)
             → Shop agent (tool calls, one clarifying question)
                  → Inventory
                  → Ledger
                       → Insights worker (on-event + weekly)
                            → Briefing copy
                            → Credit snapshot (deterministic scorer)
                            → Savings nudge (rules engine)
                                 → Outbox → WhatsApp + judge board
```

**Trust plane (non-negotiable)**

- `consent_state`: none / ndio / revoked
- SMS redacted or hashed after parse
- `credit_share_log`: actor, time, snapshot id
- No Daraja production on Build Night
- Fail-soft: thin data → say so

### 8.1 Night-of services

| Service | Role |
| --- | --- |
| whatsapp-webhook | Cloud API, media download |
| stt | Groq / Whisper, Swahili |
| sms-parser | M-Pesa message shapes |
| agent | Intents, tools, copy |
| inventory | SKUs, stock events |
| ledger | Income, expense, categories |
| insights-worker | Weekly + on-event rollups |
| credit-file | Deterministic 0–100 + reasons |
| savings | Goals, nudges, NDIO amounts |
| board | Next.js projector for judges |

### 8.2 Agent tools

| Tool | Does | Must not |
| --- | --- | --- |
| apply_stock_delta | Parse units and aliases | Guess SKU silently |
| post_ledger | Income/expense + category | Originate a loan |
| get_week_rollup | Sales, COGS, SKU ranks | Hallucinate ranks |
| get_credit_file | Deterministic score + reasons | Change weights ad hoc |
| propose_save | One nudge if rules pass | Nudge on squeeze weeks |
| share_credit_file | After explicit Share | Auto-send to a lender |

### 8.3 Data model

| Table | Key fields | Used by |
| --- | --- | --- |
| traders | id, wa_number, lang, consent_at | All |
| sku | id, aliases, unit, low_stock, trader_id | Voice parse, insights |
| stock_event | sku, delta, source (voice\|sms), raw_ref | Inventory, hygiene score |
| ledger_entry | amount, dir, category, sku?, mpesa_ref | Books, credit, savings |
| insight_card | week, type, payload, copy_sw, copy_en | Briefing, board |
| credit_snapshot | score, factors JSON, valid_from | SACCO export |
| savings_goal | name, target_kes, balance, active | Nudges |
| consent_event | kind, at, channel | Trust, share gate |

---

## 9. Privacy and consent

1. **Onboard:** *Duka itasoma voice notes na SMS kwa stock na pesa tu. Hapana share. Reply NDIO.*
2. **Operate:** parse, categorize, brief. No third-party marketing.
3. **Share credit file:** separate explicit Share. Logged.
4. **Demo:** dedicated test number and sample SMS. Never a stranger’s live wallet.

Duka is a **file for a human officer**, not a licensed bureau and not a loan decision.

---

## 10. Build Night scope

| Ship tonight | Next | Cut |
| --- | --- | --- |
| Voice → stock live on the board | Credit share PDF | Native M-Pesa API / Daraja production |
| Paste SMS → ledger + category | Credit sales (*anadaiwa*) | Multi-branch, staff PINs, payroll |
| Weekly briefing SW + EN | Multi-SKU packs | USSD, Android app, KRA eTIMS |
| One insight card (best seller / biggest cost) | SACCO portal view | Auto-disburse loans |
| Credit snapshot on the board | Longer history scoring | Bureau license |
| One savings NDIO on an up-week | Recurring auto-save | Silent lender upload |

**Suggested stack:** WhatsApp Cloud API · Whisper/Groq · LLM agent · SQLite · small Next.js board.

**Developer-tools angle:** open-source Swahili commerce intents (SKU aliases, stock verbs) and a Cursor skill so others fork Duka for ugali, mitumba, or boda parts.

---

## 11. Judge demo (90 seconds)

Phone on a stand. WhatsApp open. Projector on the live board.

| Time | Action | Room sees |
| --- | --- | --- |
| 0–10s | Speak Sheng | *nimeuza kuku tatu, mayai trays mbili* |
| 10–25s | Agent replies | Stock: kuku 37. Mayai 6 trays. |
| 25–45s | Paste sample M-Pesa SMS | Ledger row appears live |
| 45–70s | Weekly briefing + insight | Tomato top seller. Feed biggest cost. |
| 70–90s | Credit file + savings | 72/100 Ready with notes. *Set aside 500 KES?* |

The join is the hook: **same SKU on the shelf and in the books — and a file a SACCO can take seriously.**

---

## 12. Success metrics (after the night)

| Metric | Meaning |
| --- | --- |
| Time-to-first-stock-update | Seconds from voice note to board |
| Categorization rate | Share of SMS rows auto-tagged with high confidence |
| Insight honesty | Zero invented bestsellers on thin weeks |
| Share rate | Traders who export a credit file (consented) |
| Nudge quality | Nudges only on surplus weeks; skip squeeze weeks |

---

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| Hallucinated bestsellers | Deterministic ranks; fail-soft copy |
| “We score loans” lands badly | Position as summary for a human officer |
| Consent as theater | NDIO and Share as real states, logged |
| M-Pesa SMS formats drift | Regex + model; uncategorized bucket |
| Sheng / code-switch STT errors | Alias dictionary + one clarifying question |

---

## 14. Positioning

**Sunday:** Duka tells the owner the truth.  
**Monday:** the same rows become a file a SACCO can read.

Bookkeeping is the means. The product is a duka that can prove it is alive — without anyone becoming an accountant.

---

*End of document · Duka PRD v1.1 · Cursor Kenya Build Night*
