"use server";
import { apiClient } from "@/lib/api/client";
import type { CheckoutPayload, CheckoutResponse } from "@/types";
import { z } from "zod";

const checkoutSchema = z.object({
  shipping_address: z.object({ full_name: z.string().min(2), phone: z.string().min(7), address_line: z.string().min(5), city: z.string().min(2), state: z.string().optional().default(""), postal_code: z.string().optional().default(""), country: z.string().length(2) }),
  shipping_option: z.number(),
  payment_method: z.literal("CASH_ON_DELIVERY"),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
  guest_email: z.string().email().optional().or(z.literal("")),
});

export async function checkoutAction(
  payload: CheckoutPayload
): Promise<{ errors?: Record<string, string[]>; order?: CheckoutResponse }> {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      errors[key] = [issue.message];
    }
    return { errors };
  }
  const result = await apiClient<CheckoutResponse>("/orders/checkout/", { method: "POST", body: payload });
  if (result.error) {
    if (typeof result.error === "string") return { errors: { non_field_errors: [result.error] } };
    return { errors: result.error };
  }
  return { order: result.data! };
}

export async function cancelOrderAction(orderId: number): Promise<{ error?: string; success?: boolean }> {
  const result = await apiClient(`/orders/${orderId}/cancel/`, { method: "POST" });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to cancel order" };
  return { success: true };
}
