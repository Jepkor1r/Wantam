import { NextResponse } from "next/server";
import { approveOutreach, dropOutreach } from "@/lib/shop-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string };
  if (body.action === "tuma") return NextResponse.json(approveOutreach());
  if (body.action === "hapana") return NextResponse.json(dropOutreach());
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
