import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import OrderDetailClient from "@/components/orders/OrderDetailClient";
import type { Order } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  const { data: order } = await apiClient<Order>(`/orders/${id}/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!order) notFound();

  return <OrderDetailClient order={order} messages={messages} locale={locale} currency={currency} />;
}
