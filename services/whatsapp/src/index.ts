const GRAPH = "https://graph.facebook.com/v21.0";

export type WaInbound =
  | { kind: "text"; from: string; text: string }
  | { kind: "audio"; from: string; mediaId: string }
  | { kind: "unknown"; from: string };

export function parseWebhook(body: unknown): WaInbound[] {
  const out: WaInbound[] = [];
  const entries = (body as { entry?: unknown[] })?.entry ?? [];
  for (const entry of entries) {
    const changes = (entry as { changes?: unknown[] }).changes ?? [];
    for (const change of changes) {
      const value = (change as { value?: { messages?: unknown[] } }).value;
      for (const msg of value?.messages ?? []) {
        const m = msg as {
          from?: string;
          type?: string;
          text?: { body?: string };
          audio?: { id?: string };
        };
        const from = m.from ?? "unknown";
        if (m.type === "text" && m.text?.body) out.push({ kind: "text", from, text: m.text.body });
        else if (m.type === "audio" && m.audio?.id) out.push({ kind: "audio", from, mediaId: m.audio.id });
        else out.push({ kind: "unknown", from });
      }
    }
  }
  return out;
}

export async function downloadMedia(mediaId: string): Promise<{ buf: Buffer; mime: string } | null> {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) return null;
  const meta = await fetch(`${GRAPH}/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meta.ok) return null;
  const json = (await meta.json()) as { url?: string; mime_type?: string };
  if (!json.url) return null;
  const bin = await fetch(json.url, { headers: { Authorization: `Bearer ${token}` } });
  if (!bin.ok) return null;
  return { buf: Buffer.from(await bin.arrayBuffer()), mime: json.mime_type ?? "audio/ogg" };
}

export async function sendText(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return;
  await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
}
