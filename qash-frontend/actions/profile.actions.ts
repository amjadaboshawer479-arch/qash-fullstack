"use server";
import { apiClient, apiClientFormData } from "@/lib/api/client";
import type { User } from "@/types";
import { z } from "zod";

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
});

export async function updateProfileAction(
  formData: FormData
): Promise<{ errors?: Record<string, string[]>; success?: boolean; user?: User }> {
  const raw = { first_name: formData.get("first_name") as string, last_name: formData.get("last_name") as string, phone: formData.get("phone") as string, address: formData.get("address") as string, date_of_birth: formData.get("date_of_birth") as string };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      errors[key] = msgs as string[];
    }
    return { errors };
  }
  const result = await apiClient<User>("/users/me/", { method: "PUT", body: parsed.data });
  if (result.error) {
    if (typeof result.error === "string") return { errors: { non_field_errors: [result.error] } };
    return { errors: result.error };
  }
  return { success: true, user: result.data! };
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<{ error?: string; user?: User }> {
  const result = await apiClientFormData<User>("/users/me/", formData, "PATCH");
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Upload failed" };
  return { user: result.data! };
}
