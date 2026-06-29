import { NextRequest, NextResponse } from "next/server";

declare global { var __qashUser: Record<string, unknown> | undefined; }

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.email || !body.password) {
    return NextResponse.json(
      { email: ["This field is required."], password: ["This field is required."] },
      { status: 400 }
    );
  }
  await new Promise((r) => setTimeout(r, 300));

  // Build user from login credentials
  const username = (body.email as string).split("@")[0];
  const user = {
    id: 1, username,
    email: body.email,
    first_name: username.charAt(0).toUpperCase() + username.slice(1),
    last_name: "",
    phone: null, address: null, date_of_birth: null, avatar: null,
    is_active: true, is_staff: false, is_superuser: false, role: "user",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  // Persist so GET /users/me/ returns same user
  global.__qashUser = user;

  return NextResponse.json({
    message: "Login successful",
    user,
    tokens: {
      access: "mock.eyJleHAiOjk5OTk5OTk5OTl9.signature",
      refresh: "mock-refresh-token",
    },
  }, { status: 200 });
}
