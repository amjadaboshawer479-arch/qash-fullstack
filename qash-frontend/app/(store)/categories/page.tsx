import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api/client";
import { getLocale, getCurrency } from "@/lib/i18n";
import type { Category, PaginatedResponse, Product, ProductFilter } from "@/types";
import CategoriesClient from "@/components/categories/CategoriesClient";

const FILTER_TABS = [
  { label: "All",      label_ar: "الكل",      slug: "" },
  { label: "Lighting", label_ar: "الإضاءة",   slug: "lighting" },
  { label: "Rugs",     label_ar: "السجاد",    slug: "rugs" },
  { label: "Decor",    label_ar: "الديكور",   slug: "decor" },
  { label: "Bags",     label_ar: "الحقائب",   slug: "bags" },
];

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const locale = getLocale(cookieStore);
  const currency = getCurrency(cookieStore);
  const isAr = locale === "ar";
  const activeTab = sp.tab || "";
  const searchQ = sp.q || "";
  const page = sp.page || "1";

  // Build real query params for GET /products/
  const productParams = new URLSearchParams();
  if (activeTab)   productParams.set("category_slug", activeTab);
  if (searchQ)     productParams.set("search", searchQ);
  if (page !== "1") productParams.set("page", page);
  productParams.set("page_size", "12");

  const [categoriesRes, productsRes, filtersRes] = await Promise.all([
    apiClient<PaginatedResponse<Category>>("/categories/"),
    apiClient<PaginatedResponse<Product>>(`/products/?${productParams.toString()}`),
    apiClient<PaginatedResponse<ProductFilter>>("/filters/"),
  ]);

  const categories = categoriesRes.data?.results ?? [];
  const products   = productsRes.data;
  const filters    = filtersRes.data?.results ?? [];

  return (
    <CategoriesClient
      categories={categories}
      products={products}
      filters={filters}
      filterTabs={FILTER_TABS}
      activeTab={activeTab}
      searchQ={searchQ}
      page={parseInt(page)}
      locale={locale}
      currency={currency}
    />
  );
}
