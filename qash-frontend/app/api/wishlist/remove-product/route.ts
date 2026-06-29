import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { product_id } = await req.json();
  return NextResponse.json({ message: "Product removed from wishlist", product_id });
}
