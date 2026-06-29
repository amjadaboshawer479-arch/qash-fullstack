"use server";
import { apiClient } from "@/lib/api/client";
import type { AuthResponse, User } from "@/types";
import { cookies } from "next/headers";

// التحقق من الكود — وتسجيل دخول تلقائي
export async function verifyEmailAction(
  email: string,
  code: string
): Promise<{ error?: string; success?: boolean; user?: User }> {
  const result = await apiClient<AuthResponse>("/users/verify-email/", {
    method: "POST",
    body: { email, code },
  });

  if (result.error) {
    if (typeof result.error === "string") return { error: result.error };
    const first = Object.values(result.error)[0];
    return { error: Array.isArray(first) ? first[0] : "Invalid code" };
  }

  // بعد التحقق — احفظ الـ token عشان يدخل مباشرة
  const data = result.data!;
  if (data.tokens?.access) {
    const cookieStore = await cookies();
    cookieStore.set("token", data.tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    if (data.user?.role) {
      cookieStore.set("role", data.user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  }

  return { success: true, user: data.user };
}

// إعادة إرسال الكود
export async function resendCodeAction(
  email: string
): Promise<{ error?: string; success?: boolean }> {
  const result = await apiClient("/users/resend-code/", {
    method: "POST",
    body: { email },
  });

  if (result.error) {
    return {
      error:
        typeof result.error === "string" ? result.error : "Failed to resend",
    };
  }

  return { success: true };
}