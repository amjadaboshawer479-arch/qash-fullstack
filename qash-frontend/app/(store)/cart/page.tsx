import { cookies } from "next/headers";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import CartPageClient from "@/components/cart/CartPageClient";
import type { Cart } from "@/types";

export default async function CartPage() {
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  const { data: cart } = await apiClient<Cart>("/cart/my-cart/", {
    method: "GET",
    cache: "no-store",
  });

  return (
    <CartPageClient
      initialCart={cart ?? null}
      messages={messages}
      locale={locale}
      currency={currency}
    />
  );
}
