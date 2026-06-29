import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart, cartKey } from "@/lib/cart-store";

export async function POST(req: NextRequest) {
  const key = cartKey(req);
  const { item_id } = await req.json();
  const cart = getCart(key);
  cart.items = cart.items.filter((i) => i.id !== item_id);
  return NextResponse.json(saveCart(key, cart));
}
