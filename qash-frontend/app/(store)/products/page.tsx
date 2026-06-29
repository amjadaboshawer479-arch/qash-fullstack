import { apiClient } from "@/lib/api/client";
import { cookies } from "next/headers";
import { getLocale, getCurrency, getMessages } from "@/lib/i18n";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import type { PaginatedResponse, Product, Category, ProductFilter } from "@/types";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const messages = await getMessages(locale);

  // Build query string from URL params
  const qs = new URLSearchParams(params).toString();

  const [productsRes, categoriesRes, filtersRes] = await Promise.all([
    apiClient<PaginatedResponse<Product>>(`/products/?${qs}&page_size=12`),
    apiClient<PaginatedResponse<Category>>("/categories/"),
    apiClient<PaginatedResponse<ProductFilter>>("/filters/"),
  ]);

  return (
    <ProductsPageClient
      initialProducts={productsRes.data}
      categories={categoriesRes.data?.results ?? []}
      filters={filtersRes.data?.results ?? []}
      locale={locale}
      currency={currency}
      messages={messages}
      searchParams={params}
    />
  );
}
