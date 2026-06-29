import { NextRequest, NextResponse } from "next/server";

// In-memory user store — updated on login/register
declare global { var __qashUser: Record<string, unknown> | undefined; }

const DEFAULT_USER = {
  id: 1, username: "user", email: "user@example.com",
  first_name: "", last_name: "", phone: null, address: null,
  date_of_birth: null, avatar: null, is_active: true,
  is_staff: false, is_superuser: false, role: "user",
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};

function getUser() {
  return global.__qashUser ?? DEFAULT_USER;
}

export async function GET() {
  return NextResponse.json(getUser());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = { ...getUser(), ...body, updated_at: new Date().toISOString() };
  global.__qashUser = updated;
  return NextResponse.json(updated);
}

export async function PATCH() {
  const updated = {
    ...getUser(),
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    updated_at: new Date().toISOString(),
  };
  global.__qashUser = updated;
  return NextResponse.json(updated);
}
