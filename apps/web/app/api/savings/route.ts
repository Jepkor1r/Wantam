import { NextResponse } from "next/server";
import { answerSavings } from "@/lib/shop-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string };
  if (body.action === "ndio") return NextResponse.json(answerSavings(true));
  if (body.action === "hapana") return NextResponse.json(answerSavings(false));
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
