"use server";
import { apiClient } from "@/lib/api/client";
import type { Cart, AddToCartPayload } from "@/types";

export async function addToCartAction(payload: AddToCartPayload): Promise<{ error?: string; cart?: Cart }> {
  // API spec: POST /cart/add-item/
  const result = await apiClient<Cart>("/cart/add-item/", {
    method: "POST",
    body: {
      product: payload.product_id,
      variation: payload.variation_id ?? null,
      combination: payload.combination_id ?? null,
      quantity: payload.quantity,
    },
  });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to add to cart" };
  return { cart: result.data! };
}

export async function updateCartItemAction(itemId: number, quantity: number): Promise<{ error?: string; cart?: Cart }> {
  // API spec: POST /cart/update-item/
  const result = await apiClient<Cart>("/cart/update-item/", {
    method: "POST",
    body: { item_id: itemId, quantity },
  });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to update cart" };
  return { cart: result.data! };
}

export async function removeCartItemAction(itemId: number): Promise<{ error?: string; cart?: Cart }> {
  // API spec: POST /cart/remove-item/
  const result = await apiClient<Cart>("/cart/remove-item/", {
    method: "POST",
    body: { item_id: itemId },
  });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to remove item" };
  return { cart: result.data! };
}

export async function clearCartAction(): Promise<{ error?: string; cart?: Cart }> {
  // API spec: POST /cart/clear-cart/
  const result = await apiClient<Cart>("/cart/clear-cart/", { method: "POST" });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to clear cart" };
  return { cart: result.data! };
}
