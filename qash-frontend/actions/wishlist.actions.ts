"use server";
import { apiClient } from "@/lib/api/client";

export async function addToWishlistAction(productId: number): Promise<{ error?: string }> {
  // API spec: POST /wishlist/add-product/
  const result = await apiClient("/wishlist/add-product/", {
    method: "POST",
    body: { product_id: productId },
  });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to add to wishlist" };
  return {};
}

export async function removeFromWishlistAction(productId: number): Promise<{ error?: string }> {
  // API spec: POST /wishlist/remove-product/
  const result = await apiClient("/wishlist/remove-product/", {
    method: "POST",
    body: { product_id: productId },
  });
  if (result.error) return { error: typeof result.error === "string" ? result.error : "Failed to remove from wishlist" };
  return {};
}
