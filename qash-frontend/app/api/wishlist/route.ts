import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      product: {
        id: 6, name: "Master Bedroom Suite", name_ar: "طقم غرفة نوم رئيسية",
        slug: "master-bedroom-suite", thumbnail: "/images/p-master-bed.png",
        base_price: "450.00", discount_price: null, has_discount: false, best_seller: false, is_available: true,
      },
      added_at: "2025-01-20T10:00:00Z",
    }
  ]);
}
