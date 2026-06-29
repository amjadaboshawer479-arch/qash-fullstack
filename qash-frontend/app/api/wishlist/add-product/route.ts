import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { product_id } = await req.json();
  return NextResponse.json({ message: "Product added to wishlist", product_id }, { status: 201 });
}
