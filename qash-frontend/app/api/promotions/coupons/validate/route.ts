import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.code === "SAVE10") return NextResponse.json({ code: "SAVE10", discount_type: "percentage", discount_value: "10.00", discount_amount: (parseFloat(body.subtotal || "0") * 0.1).toFixed(2), minimum_order_amount: "20.00", valid_until: "2025-12-31T23:59:59Z" });
  return NextResponse.json({ detail: "Coupon code is invalid or expired" }, { status: 400 });
}
