import { NextRequest, NextResponse } from "next/server";
import { getCart, cartKey } from "@/lib/cart-store";

export async function GET(req: NextRequest) {
  return NextResponse.json(getCart(cartKey(req)));
}
