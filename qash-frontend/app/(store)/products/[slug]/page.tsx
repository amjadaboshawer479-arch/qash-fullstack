import { apiClient } from "@/lib/api/client";
import type { Product, ProductListItem } from "@/types";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";

async function getMessages(locale: string) {
  try { return (await import(`../../../../messages/${locale}.json`)).default; }
  catch { return (await import("../../../../messages/en.json")).default; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const currency = cookieStore.get("NEXT_CURRENCY")?.value || "JOD";
  const messages = await getMessages(locale);

  const [productRes, recommendedRes] = await Promise.all([
    apiClient<Product>(`/products/${slug}/`),
    apiClient<Product[]>(`/products/${slug}/recommend/`),
  ]);

  if (productRes.error || !productRes.data) notFound();

  return (
    <ProductDetailClient
      product={productRes.data}
      recommended={(recommendedRes.data as Product[]) || []}
      locale={locale}
      currency={currency}
      messages={messages}
    />
  );
}
