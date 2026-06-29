import { NextResponse } from "next/server";
let mockCart = { id: 1, token: "mock-cart-token", items: [], total_items: 0, subtotal: "0.00" };
export async function GET() { return NextResponse.json(mockCart); }
export async function POST(req: Request) {
  const body = await req.json();
  const newItem = { id: Date.now(), product: { id: body.product_id, name: "Product", slug: "product", thumbnail: null, base_price: "25.00", discount_price: null, has_discount: false }, variation: null, combination: null, quantity: body.quantity || 1, unit_price: "25.00", line_total: (25 * (body.quantity || 1)).toFixed(2) };
  mockCart = { ...mockCart, items: [...mockCart.items, newItem] as typeof mockCart.items, total_items: mockCart.total_items + (body.quantity || 1) };
  return NextResponse.json(mockCart, { status: 201 });
}
export async function DELETE() { mockCart = { id: 1, token: "mock-cart-token", items: [], total_items: 0, subtotal: "0.00" }; return NextResponse.json({ message: "Cart cleared" }); }
