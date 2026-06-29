import { NextRequest, NextResponse } from "next/server";

declare global { var __qashUser: Record<string, unknown> | undefined; }

export async function POST(req: NextRequest) {
  const body = await req.json();
  await new Promise((r) => setTimeout(r, 300));

  const user = {
    id: 2,
    username: body.username || "user",
    email: body.email || "",
    first_name: body.username || "",
    last_name: "",
    phone: null, address: null, date_of_birth: null, avatar: null,
    is_active: true, role: "user",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  // Persist so GET /users/me/ returns same user
  global.__qashUser = user;

  return NextResponse.json({
    message: "Registration successful",
    user,
    tokens: {
      access: "mock.eyJleHAiOjk5OTk5OTk5OTl9.signature",
      refresh: "mock-refresh-token",
    },
  }, { status: 201 });
}
