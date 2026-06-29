"use server";
import { apiClient } from "@/lib/api/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactAction(
  formData: FormData
): Promise<{ errors?: Record<string, string[]>; success?: boolean }> {
  const raw = { name: formData.get("name") as string, phone: formData.get("phone") as string, location: formData.get("location") as string, email: formData.get("email") as string, subject: formData.get("subject") as string, message: formData.get("message") as string };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      errors[key] = msgs as string[];
    }
    return { errors };
  }
  const result = await apiClient("/contact/", { method: "POST", body: parsed.data });
  if (result.error) {
    if (typeof result.error === "string") return { errors: { non_field_errors: [result.error] } };
    return { errors: result.error };
  }
  return { success: true };
}

export async function subscribeNewsletterAction(email: string): Promise<{ error?: string; success?: boolean }> {
  const result = await apiClient("/cms/newsletter/", { method: "POST", body: { email } });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Subscription failed" };
  return { success: true };
}
