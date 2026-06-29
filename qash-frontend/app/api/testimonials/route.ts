import { NextResponse } from "next/server";
const testimonials = [{ id: 1, user: { id: 1, username: "sarah_m", avatar: null }, title: "Absolutely love the quality!", content: "I ordered two shirts and the quality exceeded my expectations. The fabric is soft and the stitching is perfect. Will definitely order again!", rating: 5, is_approved: true, created_at: "2025-01-15T00:00:00Z" }, { id: 2, user: { id: 2, username: "ahmed_k", avatar: null }, title: "Fast delivery, great product", content: "Received my order in just 2 days. The dress fits perfectly and the color is exactly as shown in the photos. Very happy with my purchase.", rating: 5, is_approved: true, created_at: "2025-01-12T00:00:00Z" }, { id: 3, user: { id: 3, username: "lana_h", avatar: null }, title: "Good quality, reasonable prices", content: "The bag is beautiful and well-made. Leather quality is excellent. A bit pricier than expected but worth every penny.", rating: 4, is_approved: true, created_at: "2025-01-08T00:00:00Z" }];
export async function GET() { return NextResponse.json({ count: testimonials.length, results: testimonials }); }
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ id: Date.now(), ...body, is_approved: false, created_at: new Date().toISOString() }, { status: 201 });
}
