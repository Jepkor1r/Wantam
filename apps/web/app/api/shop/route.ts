import { NextResponse } from "next/server";
import { getShop } from "@/lib/shop-store";

export function GET() {
  return NextResponse.json(getShop());
}
