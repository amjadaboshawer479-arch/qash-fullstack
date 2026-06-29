import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ id: 102, order_number: "ORD-2025-0102", status: "CANCELLED" }); }
