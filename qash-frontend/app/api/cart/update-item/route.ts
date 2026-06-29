import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart, cartKey } from "@/lib/cart-store";

export async function POST(req: NextRequest) {
  const key = cartKey(req);
  const { item_id, quantity } = await req.json();
  const cart = getCart(key);
  const item = cart.items.find((i) => i.id === item_id);
  if (item) {
    item.quantity = quantity;
    item.total_price = (parseFloat(item.unit_price) * quantity).toFixed(2);
  }
  return NextResponse.json(saveCart(key, cart));
}
