import { NextResponse } from "next/server";
export async function POST() {
  await new Promise(r => setTimeout(r, 500));
  return NextResponse.json({ id: 105, order_number: "ORD-2025-0105", status: "PENDING", total_amount: "58.47", discount_amount: "0.00", created_at: new Date().toISOString() }, { status: 201 });
}
