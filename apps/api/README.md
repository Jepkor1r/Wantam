# apps/api — shop agent

**Stack:** TypeScript · Hono (or Next.js route handlers) · Groq/OpenAI tool loop · Node 20

Owns the WhatsApp webhook, calls STT, runs agent tools:

- `apply_stock_delta`
- `post_ledger`
- `get_week_rollup`
- `get_credit_file` (deterministic scorer)
- `propose_save`
- `share_credit_file`

The model writes copy. This service writes numbers.
