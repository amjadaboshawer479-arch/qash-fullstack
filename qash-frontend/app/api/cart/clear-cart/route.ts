import { NextRequest, NextResponse } from "next/server";
import { saveCart, cartKey, type CartData } from "@/lib/cart-store";

export async function POST(req: NextRequest) {
  const key = cartKey(req);
  const empty: CartData = {
    id: "cart-001", user: null, cart_token: key, is_active: true,
    items: [], total_amount: "0.00",
    currency_info: { code: "JOD", symbol: "JD", exchange_rate: "1.000" },
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  return NextResponse.json(saveCart(key, empty));
}
