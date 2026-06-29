"use server";
import { apiClient } from "@/lib/api/client";
import type { AuthResponse, User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  phone: z.string().min(7, "Valid phone number is required"),
});

export async function loginAction(
  formData: FormData
): Promise<{ errors?: Record<string, string[]>; success?: boolean; user?: User }> {
  const raw = { email: formData.get("email") as string, password: formData.get("password") as string };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      errors[key] = msgs as string[];
    }
    return { errors };
  }
  const result = await apiClient<AuthResponse>("/users/login/", { method: "POST", body: parsed.data });
  if (result.error) {
    if (typeof result.error === "string") return { errors: { non_field_errors: [result.error] } };
    return { errors: result.error };
  }
  const cookieStore = await cookies();
  const { tokens, user } = result.data!;
  cookieStore.set("token", tokens.access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 });
  cookieStore.set("role", user.role, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" });
  // Fetch full profile after login to populate all user fields
  const profileResult = await apiClient<User>("/users/me/");
  return { success: true, user: profileResult.data || user };
}

export async function registerAction(
  formData: FormData
): Promise<{ errors?: Record<string, string[]>; success?: boolean; user?: User }> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      errors[key] = msgs as string[];
    }
    return { errors };
  }
  const result = await apiClient<AuthResponse>("/users/register/", { method: "POST", body: parsed.data });
  if (result.error) {
    if (typeof result.error === "string") return { errors: { non_field_errors: [result.error] } };
    return { errors: result.error };
  }
  // ما نحفظ token — المستخدم لازم يتحقق أول
  const { user } = result.data!;
  return { success: true, user };
}

export async function logoutAction(): Promise<void> {
  await apiClient("/accounts/auth/logout/", { method: "POST" });
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");
  cookieStore.delete("cart_token");
  redirect("/login");
}

export async function setLocaleCookie(locale: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, { sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
}

export async function setCurrencyCookie(currency: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_CURRENCY", currency, { sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
}