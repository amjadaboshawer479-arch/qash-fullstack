import { cookies } from "next/headers";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import type { Cart, ShippingOption, Country, PaginatedResponse } from "@/types";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale   = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  const [cartRes, shippingRes, countriesRes] = await Promise.all([
    apiClient<Cart>("/cart/my-cart/", { method: "GET", cache: "no-store" }),
    apiClient<PaginatedResponse<ShippingOption>>("/logistics/shipping-options/", { method: "GET" }),
    apiClient<PaginatedResponse<Country>>("/logistics/countries/", { method: "GET" }),
  ]);

  // Redirect to cart if empty
  if (!cartRes.data || cartRes.data.items.length === 0) {
    redirect("/cart");
  }

  const shippingOptions = shippingRes.data?.results ?? [];
  const countries       = countriesRes.data?.results ?? [];

  return (
    <CheckoutClient
      cart={cartRes.data}
      shippingOptions={shippingOptions}
      countries={countries}
      messages={messages}
      locale={locale}
      currency={currency}
      isAuthenticated={!!token}
    />
  );
}
