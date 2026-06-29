import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  await new Promise(r => setTimeout(r, 300));
  return NextResponse.json({ id: Date.now(), ...body, created_at: new Date().toISOString() }, { status: 201 });
}
