"use client";
import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import type { PaginatedResponse, Product, Category, ProductFilter } from "@/types";

interface Props {
  initialProducts: PaginatedResponse<Product> | null;
  categories: Category[];
  filters?: ProductFilter[];
  locale: string;
  currency: string;
  messages: Record<string, Record<string, string>>;
  searchParams: Record<string, string>;
}

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "-created_at", label: "Newest" },
  { value: "base_price", label: "Price: Low to High" },
  { value: "-base_price", label: "Price: High to Low" },
];

export default function ProductsPageClient({
  initialProducts, categories, filters = [], locale, currency, messages, searchParams,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ categories: true, price: true });

  const current = new URLSearchParams(searchParams as Record<string, string>);

  function push(params: URLSearchParams) {
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }

  function toggleSection(key: string) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("search") as string;
    const p = new URLSearchParams(current);
    if (q) p.set("search", q); else p.delete("search");
    p.delete("page");
    push(p);
  }

  function handleCategory(slug: string) {
    const p = new URLSearchParams(current);
    if (p.get("category_slug") === slug) p.delete("category_slug");
    else p.set("category_slug", slug);
    p.delete("page");
    push(p);
  }

  function handleBestSeller() {
    const p = new URLSearchParams(current);
    if (p.get("best_seller") === "true") p.delete("best_seller");
    else p.set("best_seller", "true");
    p.delete("page");
    push(p);
  }

  function handleSort(val: string) {
    const p = new URLSearchParams(current);
    if (val) p.set("ordering", val); else p.delete("ordering");
    push(p);
  }

  function handlePage(page: number) {
    const p = new URLSearchParams(current);
    p.set("page", String(page));
    push(p);
  }

  function clearAll() {
    router.push("/products");
  }

  const hasFilters = current.get("search") || current.get("category_slug") || current.get("best_seller") || current.get("price_min") || current.get("price_max");
  const totalPages = products ? Math.ceil(products.count / 12) : 1;
  const currentPage = parseInt(current.get("page") || "1");

  // SVG shows: search bar at top (y=453), filter sidebar left, 4-col grid right
  // Sidebar has: search, categories, price range, attributes checkboxes
  return (
    <div style={{ backgroundColor: "var(--bg)" }} className="min-h-screen">
      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <h1
          className="text-3xl font-semibold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {locale === "ar" ? "جميع المنتجات" : "All Products"}
        </h1>
        {products && (
          <p className="text-sm text-[#313131]/60">
            {products.count} {locale === "ar" ? "منتج" : "products"}
          </p>
        )}
      </div>

      {/* Search bar — SVG: x=56.5 y=453.5 w=1167 h=51 rx=16.5 stroke=#AFAFAF */}
      <div className="px-8 pb-4">
        <form onSubmit={handleSearch}>
          <div
            className="flex items-center gap-3 bg-white px-5"
            style={{ border: "1px solid #AFAFAF", borderRadius: 16.5, height: 51 }}
          >
            <Search size={18} className="text-[#AFAFAF] shrink-0" />
            <input
              name="search"
              defaultValue={current.get("search") || ""}
              placeholder={locale === "ar" ? "ابحث عن منتج..." : "Search products..."}
              className="flex-1 bg-transparent text-sm text-[#313131] placeholder-[#AFAFAF] outline-none"
            />
            {current.get("search") && (
              <button type="button" onClick={() => { const p = new URLSearchParams(current); p.delete("search"); push(p); }}>
                <X size={16} className="text-[#AFAFAF]" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="px-8 pb-12 flex gap-6">
        {/* FILTER SIDEBAR — SVG shows left sidebar with category list */}
        <aside className="hidden md:block shrink-0" style={{ width: 188 }}>

          {/* Sort */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#313131] mb-3">Sort By</p>
            <div className="space-y-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className={`block w-full text-left text-[13px] py-1 transition-colors ${
                    current.get("ordering") === opt.value || (!current.get("ordering") && !opt.value)
                      ? "text-[#D88F65] font-medium"
                      : "text-[#313131]/70 hover:text-[#313131]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8DED4] mb-6" />

          {/* Best Seller filter */}
          <div className="mb-6">
            <button
              onClick={handleBestSeller}
              className={`flex items-center gap-2 text-[13px] transition-colors ${
                current.get("best_seller") === "true" ? "text-[#D88F65] font-medium" : "text-[#313131]/70 hover:text-[#313131]"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                current.get("best_seller") === "true" ? "bg-[#D88F65] border-[#D88F65]" : "border-[#D5C9BC]"
              }`}>
                {current.get("best_seller") === "true" && <span className="text-white text-[10px]">✓</span>}
              </div>
              Best Sellers
            </button>
          </div>

          <div className="border-t border-[#E8DED4] mb-6" />

          {/* Categories */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full mb-3"
              onClick={() => toggleSection("categories")}
            >
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#313131]">Categories</p>
              {openSections.categories ? <ChevronUp size={14} className="text-[#313131]/50" /> : <ChevronDown size={14} className="text-[#313131]/50" />}
            </button>
            {openSections.categories && (
              <div className="space-y-2">
                {categories.map((cat) => {
                  const label = locale === "ar" && cat.name_ar ? cat.name_ar : cat.name;
                  const active = current.get("category_slug") === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(cat.slug)}
                      className={`flex items-center gap-2 w-full text-left text-[13px] transition-colors py-0.5 ${
                        active ? "text-[#D88F65] font-medium" : "text-[#313131]/70 hover:text-[#313131]"
                      }`}
                    >
                      {/* SVG shows line/dot indicator for active category */}
                      <span className={`w-1 h-4 rounded-full shrink-0 transition-colors ${active ? "bg-[#D88F65]" : "bg-transparent"}`} />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price range */}
          <div className="border-t border-[#E8DED4] mb-6 pt-6">
            <button
              className="flex items-center justify-between w-full mb-3"
              onClick={() => toggleSection("price")}
            >
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#313131]">Price Range</p>
              {openSections.price ? <ChevronUp size={14} className="text-[#313131]/50" /> : <ChevronDown size={14} className="text-[#313131]/50" />}
            </button>
            {openSections.price && (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={current.get("price_min") || ""}
                  onBlur={(e) => {
                    const p = new URLSearchParams(current);
                    if (e.target.value) p.set("price_min", e.target.value); else p.delete("price_min");
                    push(p);
                  }}
                  className="w-full border border-[#D5C9BC] rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#D88F65]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={current.get("price_max") || ""}
                  onBlur={(e) => {
                    const p = new URLSearchParams(current);
                    if (e.target.value) p.set("price_max", e.target.value); else p.delete("price_max");
                    push(p);
                  }}
                  className="w-full border border-[#D5C9BC] rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#D88F65]"
                />
              </div>
            )}
          </div>

          {/* Filter attributes */}
          {filters.map((filter) => (
            <div key={filter.id} className="border-t border-[#E8DED4] mb-6 pt-6">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#313131] mb-3">
                {locale === "ar" && filter.name_ar ? filter.name_ar : filter.name}
              </p>
              <div className="space-y-1.5">
                {filter.values.map((val) => {
                  const valLabel = locale === "ar" && val.value_ar ? val.value_ar : val.value;
                  const currentVals = (current.get("filter_values") || "").split(",").filter(Boolean);
                  const active = currentVals.includes(String(val.id));
                  return (
                    <button
                      key={val.id}
                      onClick={() => {
                        const p = new URLSearchParams(current);
                        const vals = (p.get("filter_values") || "").split(",").filter(Boolean);
                        if (active) {
                          const newVals = vals.filter(v => v !== String(val.id));
                          if (newVals.length) p.set("filter_values", newVals.join(","));
                          else p.delete("filter_values");
                        } else {
                          p.set("filter_values", [...vals, String(val.id)].join(","));
                        }
                        push(p);
                      }}
                      className={`flex items-center gap-2 w-full text-left text-[13px] transition-colors py-0.5 ${
                        active ? "text-[#D88F65] font-medium" : "text-[#313131]/70 hover:text-[#313131]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        active ? "bg-[#D88F65] border-[#D88F65]" : "border-[#D5C9BC]"
                      }`}>
                        {active && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      {valLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#D88F65] hover:underline mt-2"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {current.get("search") && (
                <span className="flex items-center gap-1 bg-[#F4F1EA] text-[#313131] text-[12px] px-3 py-1 rounded-full">
                  "{current.get("search")}"
                  <button onClick={() => { const p = new URLSearchParams(current); p.delete("search"); push(p); }}><X size={12} /></button>
                </span>
              )}
              {current.get("category_slug") && (
                <span className="flex items-center gap-1 bg-[#F4F1EA] text-[#313131] text-[12px] px-3 py-1 rounded-full">
                  {categories.find(c => c.slug === current.get("category_slug"))?.name || current.get("category_slug")}
                  <button onClick={() => { const p = new URLSearchParams(current); p.delete("category_slug"); push(p); }}><X size={12} /></button>
                </span>
              )}
              {current.get("best_seller") === "true" && (
                <span className="flex items-center gap-1 bg-[#F4F1EA] text-[#313131] text-[12px] px-3 py-1 rounded-full">
                  Best Sellers
                  <button onClick={() => { const p = new URLSearchParams(current); p.delete("best_seller"); push(p); }}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid — SVG: 4 columns, matching homepage */}
          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products && products.results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.results.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} currency={currency} />
                ))}
              </div>

              {/* Pagination — SVG: teal #88B0BE rounded pill button */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] disabled:opacity-30 hover:border-[#D88F65] hover:text-[#D88F65] transition-colors"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePage(page)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "text-white"
                            : "border border-[#D5C9BC] text-[#313131] hover:border-[#D88F65] hover:text-[#D88F65]"
                        }`}
                        style={page === currentPage ? { backgroundColor: "#88B0BE" } : {}}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-9 h-9 rounded-full border border-[#D5C9BC] flex items-center justify-center text-sm text-[#313131] disabled:opacity-30 hover:border-[#D88F65] hover:text-[#D88F65] transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#313131]/50 text-lg mb-4">No products found</p>
              <button onClick={clearAll} className="text-[#D88F65] text-sm hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
