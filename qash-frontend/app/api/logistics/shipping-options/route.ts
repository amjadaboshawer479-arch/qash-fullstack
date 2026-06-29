import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ count: 2, next: null, previous: null, results: [{ id: 1, name: "Standard Delivery", name_ar: "توصيل عادي", price: "5.00", estimated_days: 3, is_active: true }, { id: 2, name: "Express Delivery", name_ar: "توصيل سريع", price: "12.00", estimated_days: 1, is_active: true }] }); }
