"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import type {
  Category,
  PaginatedResponse,
  Product,
  ProductFilter,
} from "@/types";
import ProductCard from "@/components/products/ProductCard";

interface FilterTab {
  label: string;
  label_ar: string;
  slug: string;
}

interface Props {
  categories: Category[];
  products: PaginatedResponse<Product> | null;
  filters: ProductFilter[];
  filterTabs: FilterTab[];
  activeTab: string;
  searchQ: string;
  page: number;
  locale: string;
  currency: string;
}

const SIDEBAR_CATS = [
  { name: "Lighting", name_ar: "الإضاءة", slug: "lighting" },
  { name: "Wall Decor", name_ar: "ديكور الجدران", slug: "wall-decor" },
  { name: "Rugs", name_ar: "السجاد", slug: "rugs" },
  { name: "Bags", name_ar: "الحقائب", slug: "bags" },
  { name: "Bedroom", name_ar: "غرفة النوم", slug: "bedroom" },
];

export default function CategoriesClient({
  categories,
  products,
  filters,
  filterTabs,
  activeTab,
  searchQ,
  page,
  locale,
  currency,
}: Props) {
  const router = useRouter();
  const isAr = locale === "ar";
  const [q, setQ] = useState(searchQ);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (activeTab) params.set("tab", activeTab);
    if (searchQ) params.set("q", searchQ);
    if (page > 1) params.set("page", String(page));
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return `/categories?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildHref({ q, page: "" }));
  }

  const totalPages = products ? Math.ceil(products.count / 12) : 1;

  return (
    <div style={{ backgroundColor: "var(--bg)" }} dir={isAr ? "rtl" : "ltr"}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(140px,22vw,265px)" }}
      >
        <Image
          src="/images/p-living-room.png"
          alt="Categories"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            className="text-white font-semibold"
            style={{
              fontFamily: "var(--font-cormorant),Georgia,serif",
              fontSize: "clamp(22px,4vw,40px)",
            }}
          >
            {isAr ? "الفئات والمنتجات" : "Categories & Products"}
          </h1>
        </div>
      </div>

      {/* ── Search + Filter Tabs ──────────────────────────── */}
      <div className="px-3 sm:px-5 lg:px-8 pt-5">
        {/* Search */}
        <form onSubmit={handleSearch}>
          <div
            className="flex items-center gap-3 bg-white px-4 mb-5"
            style={{
              border: "1px solid #AFAFAF",
              borderRadius: 16.5,
              height: 51,
            }}
          >
            <Search size={16} className="text-[#AFAFAF] shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
              className="flex-1 bg-transparent text-sm text-[#313131] placeholder-[#AFAFAF] outline-none"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap pb-1">
            {filterTabs.map((tab, i) => {
              const isActive = activeTab === tab.slug;
              const label = isAr ? tab.label_ar : tab.label;
              const widths = [100, 80, 72, 72, 72];
              return (
                <Link
                  key={tab.slug}
                  href={buildHref({ tab: tab.slug, page: "" })}
                  className="flex items-center justify-center text-[12px] sm:text-[13px] font-medium transition-colors whitespace-nowrap px-3"
                  style={{
                    minWidth: widths[i] || 72,
                    height: isActive ? 40 : 38,
                    borderRadius: isActive ? 8 : 7,
                    backgroundColor: isActive ? "#D88E63" : "transparent",
                    color: isActive ? "white" : "#D88E63",
                    border: isActive ? "none" : "2px solid #D88E63",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </form>
      </div>

      {/* ── Main layout: sidebar + product grid ───────────── */}
      <div className="flex px-3 sm:px-5 lg:px-8 mt-5 gap-4 sm:gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block shrink-0" style={{ width: 148 }}>
          <div>
            {SIDEBAR_CATS.map((cat, i) => (
              <div key={cat.slug}>
                <Link
                  href={buildHref({ tab: cat.slug, page: "" })}
                  className={`block py-3 text-[13px] font-medium transition-colors hover:text-[#D88F65] ${
                    activeTab === cat.slug ? "text-[#D88F65]" : "text-[#1E1E1E]"
                  }`}
                >
                  {isAr ? cat.name_ar : cat.name}
                </Link>
                {i < SIDEBAR_CATS.length - 1 && (
                  <div
                    className="w-full"
                    style={{ height: 1, backgroundColor: "rgba(0,0,0,0.18)" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Filter attributes from API */}
          {filters.length > 0 && (
            <div className="mt-6 border-t border-[#E8DED4] pt-4">
              {filters.map((filter) => (
                <div key={filter.id} className="mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#313131] mb-2">
                    {isAr && filter.name_ar ? filter.name_ar : filter.name}
                  </p>
                  <div className="space-y-1">
                    {filter.values.map((val) => (
                      <p
                        key={val.id}
                        className="text-[12px] text-[#313131]/70 py-0.5"
                      >
                        {isAr && val.value_ar ? val.value_ar : val.value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {products && products.count > 0 && (
            <p className="text-[12px] text-[#313131]/50 mb-3">
              {products.count} {isAr ? "منتج" : "products"}
            </p>
          )}
          {!products || products.results.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-[#313131]/50 text-lg mb-4">
                {isAr ? "لا توجد منتجات" : "No products found"}
              </p>
              <Link
                href="/categories"
                className="text-[#D88F65] text-sm hover:underline"
              >
                {isAr ? "مسح الفلاتر" : "Clear filters"}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {products.results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    currency={currency}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link
                      href={buildHref({ page: String(page - 1) })}
                      className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] hover:border-[#D88F65] hover:text-[#D88F65] transition-colors"
                    >
                      ‹
                    </Link>
                  )}
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
                      const p = i + 1;
                      return (
                        <Link
                          key={p}
                          href={buildHref({ page: String(p) })}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors border"
                          style={
                            p === page
                              ? {
                                  backgroundColor: "#88B0BE",
                                  color: "white",
                                  borderColor: "#88B0BE",
                                }
                              : { borderColor: "#D5C9BC", color: "#313131" }
                          }
                        >
                          {p}
                        </Link>
                      );
                    },
                  )}
                  {page < totalPages && (
                    <Link
                      href={buildHref({ page: String(page + 1) })}
                      className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] hover:border-[#D88F65] hover:text-[#D88F65] transition-colors"
                    >
                      ›
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Category cards section ───────────────────────── */}
      <section className="px-3 sm:px-5 lg:px-8 mt-10 mb-8">
        <h2
          className="text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-cormorant),Georgia,serif" }}
        >
          {isAr ? "تصفح الفئات" : "Browse Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {categories.slice(0, 12).map((cat) => {
            const label = isAr && cat.name_ar ? cat.name_ar : cat.name;
            return (
              <Link
                key={cat.id}
                href={buildHref({ tab: cat.slug, page: "" })}
                className="group relative overflow-hidden"
                style={{ aspectRatio: "1/1.2" }}
              >
                <Image
                  src={cat.image || "/images/p-table-lamp.png"}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width:640px) 45vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white text-[11px] sm:text-[12px] font-medium px-1">
                  {label}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
