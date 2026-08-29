import { NextResponse } from "next/server";
import { ingestMpesaPaste, setConsent } from "@/lib/shop-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string; raw?: string };
  if (body.action === "ndio") {
    return NextResponse.json(setConsent("ndio"));
  }
  if (body.action === "revoke") {
    return NextResponse.json(setConsent("revoked"));
  }
  if (body.action === "paste" && body.raw) {
    return NextResponse.json(ingestMpesaPaste(body.raw));
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
