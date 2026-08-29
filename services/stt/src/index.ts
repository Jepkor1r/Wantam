export type Transcript = { text: string; language: string; provider: string };

/**
 * Groq Whisper first, OpenAI fallback. Returns null if no key — the agent
 * then asks the trader (or the board demo) to paste the words.
 */
export async function transcribeAudio(buf: Buffer, mime = "audio/ogg"): Promise<Transcript | null> {
  const groq = process.env.GROQ_API_KEY;
  const openai = process.env.OPENAI_API_KEY;
  if (!groq && !openai) return null;

  const blob = new Blob([buf], { type: mime });
  const form = new FormData();
  form.set("file", blob, "note.ogg");
  form.set("model", groq ? "whisper-large-v3" : "whisper-1");
  form.set("language", "sw");

  const url = groq
    ? "https://api.groq.com/openai/v1/audio/transcriptions"
    : "https://api.openai.com/v1/audio/transcriptions";
  const key = groq ?? openai!;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    if (groq && openai) return transcribeWithOpenAI(buf, mime);
    throw new Error(`STT ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { text?: string };
  return { text: json.text ?? "", language: "sw", provider: groq ? "groq" : "openai" };
}

async function transcribeWithOpenAI(buf: Buffer, mime: string): Promise<Transcript | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const blob = new Blob([buf], { type: mime });
  const form = new FormData();
  form.set("file", blob, "note.ogg");
  form.set("model", "whisper-1");
  form.set("language", "sw");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) throw new Error(`OpenAI STT ${res.status}`);
  const json = (await res.json()) as { text?: string };
  return { text: json.text ?? "", language: "sw", provider: "openai" };
}
