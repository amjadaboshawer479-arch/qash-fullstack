import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    count: 1,
    results: [
      { id: 1, title: "New Arrivals — Up to 30% Off", title_ar: "وصولات جديدة — خصم يصل إلى 30%", image: "/images/hero-living-room.png", link: "/products?ordering=-created_at", is_active: true },
    ],
  });
}
