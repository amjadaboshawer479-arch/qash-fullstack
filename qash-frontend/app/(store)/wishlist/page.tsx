import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import WishlistPageClient from "@/components/products/WishlistPageClient";
import type { WishlistItem } from "@/types";

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  const { data: wishlist } = await apiClient<WishlistItem[]>("/wishlist/", {
    method: "GET",
    cache: "no-store",
  });

  return (
    <WishlistPageClient
      initialItems={wishlist ?? []}
      messages={messages}
      locale={locale}
      currency={currency}
    />
  );
}
