import { NextResponse } from "next/server";
export async function PATCH() { return NextResponse.json({ id: 1, quantity: 2 }); }
export async function DELETE() { return NextResponse.json({ message: "Item removed" }); }
