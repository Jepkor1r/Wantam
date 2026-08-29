import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { seedDemo } from "@wantam/db";
import { downloadMedia, parseWebhook, sendText } from "@wantam/whatsapp";
import { transcribeAudio } from "@wantam/stt";
import { handleInboundText, handleVoiceTranscript, refreshShop } from "./shop";
import { loadState } from "./state";
import { bump, gen } from "./events";

const app = new Hono();
const boardOrigin = process.env.BOARD_ORIGIN ?? "http://localhost:3000";

app.use(
  "*",
  cors({
    origin: [boardOrigin, "http://127.0.0.1:3000", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, service: "wantam-api" }));

app.get("/board/state", (c) => c.json(loadState()));

app.get("/events", (c) =>
  streamSSE(c, async (s) => {
    let seen = -1;
    while (true) {
      if (gen() !== seen) {
        seen = gen();
        await s.writeSSE({ event: "board", data: JSON.stringify(loadState()) });
      }
      await s.sleep(300);
    }
  }),
);

app.get("/webhooks/whatsapp", (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");
  if (mode === "subscribe" && token === (process.env.WHATSAPP_VERIFY_TOKEN ?? "wantam-verify")) {
    return c.text(challenge ?? "");
  }
  return c.text("forbidden", 403);
});

app.post("/webhooks/whatsapp", async (c) => {
  const body = await c.req.json();
  const inbound = parseWebhook(body);
  const replies: string[] = [];
  for (const msg of inbound) {
    if (msg.kind === "text") {
      const r = handleInboundText(msg.text);
      replies.push(r.text);
      await sendText(msg.from, r.text);
    } else if (msg.kind === "audio") {
      const media = await downloadMedia(msg.mediaId);
      if (!media) {
        const r = handleInboundText("Duka haijapata voice file. Type the stock line.");
        replies.push(r.text);
        await sendText(msg.from, r.text);
        continue;
      }
      const tr = await transcribeAudio(media.buf, media.mime);
      if (!tr?.text) {
        const r = handleInboundText("Sijaskia voice note. Type: nimeuza kuku tatu.");
        replies.push(r.text);
        await sendText(msg.from, r.text);
        continue;
      }
      const r = handleVoiceTranscript(tr.text);
      replies.push(r.text);
      await sendText(msg.from, r.text);
    }
  }
  return c.json({ ok: true, replies });
});

app.post("/demo/voice", async (c) => {
  const { transcript } = (await c.req.json()) as { transcript?: string };
  if (!transcript) return c.json({ error: "transcript required" }, 400);
  return c.json(handleVoiceTranscript(transcript));
});

app.post("/demo/sms", async (c) => {
  const { text } = (await c.req.json()) as { text?: string };
  if (!text) return c.json({ error: "text required" }, 400);
  return c.json(handleInboundText(text));
});

app.post("/demo/text", async (c) => {
  const { text } = (await c.req.json()) as { text?: string };
  if (!text) return c.json({ error: "text required" }, 400);
  return c.json(handleInboundText(text));
});

app.post("/demo/reset", (c) => {
  seedDemo({ reset: true });
  refreshShop();
  bump();
  return c.json({ ok: true, state: loadState() });
});

export function boot() {
  seedDemo({ reset: true });
  refreshShop();
  bump();
  const port = Number(process.env.PORT ?? 3001);
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
    console.log(`Wantam API on http://0.0.0.0:${port}`);
  });
}

export { app };
