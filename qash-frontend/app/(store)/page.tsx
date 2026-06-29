import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api/client";
import type { Testimonial, PaginatedResponse, Category, Swiper, CMSSection, OfferSection } from "@/types";
import HeroSwiper from "@/components/home/HeroSwiper";
import TestimonialsSection from "@/components/home/TestimonialsSection";

/* Static fallback products — used only if API returns empty */
const PRODUCTS_FIRST = [
  { id: 9,  name: "Globe Pendant Lamp",   name_ar: "مصباح كروي معلق",    slug: "globe-pendant-lamp",   thumbnail: "/images/p-globe-lamp.png",   base_price: "210.00", discount_price: null,     has_discount: false, best_seller: false },
  { id: 10, name: "Boho Shelf Decor",     name_ar: "ديكور رف بوهيمي",    slug: "boho-shelf-decor",     thumbnail: "/images/p-bohemian.png",     base_price: "75.00",  discount_price: null,     has_discount: false, best_seller: false },
  { id: 11, name: "Fiber Art Wall Piece", name_ar: "لوحة فنية جدارية",   slug: "fiber-art-wall",       thumbnail: "/images/p-fiber-art.png",    base_price: "180.00", discount_price: "145.00", has_discount: true,  best_seller: false },
  { id: 12, name: "Macrame & Vase Set",   name_ar: "طقم ماكريمي وإناء",  slug: "macrame-vase-set",     thumbnail: "/images/p-macrame.png",      base_price: "90.00",  discount_price: "72.00",  has_discount: true,  best_seller: false },
  { id: 13, name: "Gallery Wall Art Set", name_ar: "طقم لوحات جدارية",   slug: "gallery-wall-art",     thumbnail: "/images/p-gallery-wall.png", base_price: "155.00", discount_price: null,     has_discount: false, best_seller: true  },
];
const PRODUCTS_REST = [
  { id: 14, name: "Wall Hanging Macrame", name_ar: "ماكريمي جداري معلق",  slug: "wall-hanging-macrame",  thumbnail: "/images/p-wall-hanging.png",   base_price: "120.00", discount_price: "95.00",  has_discount: true,  best_seller: true  },
  { id: 15, name: "Natural Jute Rug",     name_ar: "سجادة جوت طبيعية",    slug: "natural-jute-rug",      thumbnail: "/images/p-rugs-2.png",         base_price: "220.00", discount_price: null,     has_discount: false, best_seller: false },
  { id: 1,  name: "Artisan Rug",          name_ar: "سجادة حرفية",          slug: "artisan-rug",           thumbnail: "/images/p-rugs.png",           base_price: "195.00", discount_price: "160.00", has_discount: true,  best_seller: true  },
  { id: 2,  name: "Ceramic Table Lamp",   name_ar: "مصباح طاولة سيراميك", slug: "ceramic-table-lamp",    thumbnail: "/images/p-ceramic-lamp.png",   base_price: "110.00", discount_price: "88.00",  has_discount: true,  best_seller: true  },
  { id: 3,  name: "Quilted Pouches Set",  name_ar: "طقم حقائب مبطنة",     slug: "quilted-pouches",       thumbnail: "/images/p-bags.png",           base_price: "65.00",  discount_price: null,     has_discount: false, best_seller: false },
  { id: 4,  name: "Artisan Pendant Lamp", name_ar: "مصباح حرفي معلق",     slug: "artisan-pendant-lamp",  thumbnail: "/images/p-pendant-lights.png", base_price: "195.00", discount_price: "160.00", has_discount: true,  best_seller: true  },
  { id: 5,  name: "Boho Wall Macrame",    name_ar: "ماكريمي جداري بوهيمي", slug: "boho-wall-macrame",     thumbnail: "/images/p-wall-decor.png",     base_price: "120.00", discount_price: "95.00",  has_discount: true,  best_seller: true  },
];

type P = typeof PRODUCTS_FIRST[0];

function ProductCard({ p, isAr, sym }: { p: P; isAr: boolean; sym: string }) {
  const price = p.discount_price || p.base_price;
  const name  = isAr ? p.name_ar : p.name;
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="relative overflow-hidden bg-[#F4F1EA]" style={{ aspectRatio: "233/301" }}>
        <Image src={p.thumbnail} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:480px) 47vw, (max-width:768px) 32vw, 234px" />
        {p.best_seller && <span className="absolute top-2 left-2 px-2 py-0.5 text-white text-[10px] font-medium" style={{ backgroundColor: "#D88E63" }}>Best Seller</span>}
        {p.has_discount && <span className="absolute top-2 right-2 px-2 py-0.5 text-white text-[10px] font-medium" style={{ backgroundColor: "#D88F65" }}>Sale</span>}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-full py-2.5 text-white text-[11px] sm:text-[12px] font-medium text-center" style={{ backgroundColor: "#D88F65" }}>
            {isAr ? "أضف للسلة" : "Add to Cart"}
          </div>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-[#1E1E1E] text-[12px] sm:text-[13px] font-medium leading-snug line-clamp-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[#D88F65] text-[12px] sm:text-[13px] font-semibold">{sym} {parseFloat(price).toFixed(2)}</span>
          {p.has_discount && <span className="text-[#999] text-[10px] line-through">{sym} {parseFloat(p.base_price).toFixed(2)}</span>}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const cookieStore = await cookies();
  // §Phase2.1 + §1.4: If user is not authenticated, redirect to login
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const locale   = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const currency = cookieStore.get("NEXT_CURRENCY")?.value || "JOD";
  const isAr = locale === "ar";
  const sym  = currency === "JOD" ? "JD" : currency;

  // Fetch all CMS data from real API endpoints
  const [swiperRes, categoriesRes, sectionsRes, offerRes, testimonialRes] = await Promise.all([
    apiClient<PaginatedResponse<Swiper>>("/cms/swipers/", { next: { revalidate: 300 } }),
    apiClient<PaginatedResponse<Category>>("/categories/?featured=true", { next: { revalidate: 300 } }),
    apiClient<{ results: CMSSection[] }>("/cms/sections/", { next: { revalidate: 300 } }),
    apiClient<{ results: OfferSection[] }>("/cms/offer-sections/", { next: { revalidate: 300 } }),
    apiClient<{ results: Testimonial[] }>("/testimonials/", { next: { revalidate: 300 } }),
  ]);

  const swipers      = swiperRes.data?.results ?? [];
  const apiCategories = categoriesRes.data?.results ?? [];
  const testimonials = testimonialRes.data?.results ?? [];
  const offers       = offerRes.data?.results ?? [];

  // Use API categories if available, else fallback
  const displayCategories = apiCategories.length > 0 ? apiCategories : [
    { id: 1, name: "Lighting",  name_ar: "الإضاءة",  slug: "lighting",  image: "/images/p-table-lamp.png" },
    { id: 2, name: "Rugs",      name_ar: "السجاد",    slug: "rugs",      image: "/images/p-rugs.png" },
    { id: 3, name: "Ceramics",  name_ar: "السيراميك", slug: "ceramics",  image: "/images/p-ceramic-lamp.png" },
    { id: 4, name: "Bags",      name_ar: "الحقائب",   slug: "bags",      image: "/images/p-bags.png" },
    { id: 5, name: "Pendants",  name_ar: "المعلقات",  slug: "pendants",  image: "/images/p-pendant-lights.png" },
  ];

  const offerImage = offers[0]?.image || "/images/p-wall-decor.png";
  const offerTitle = isAr
    ? (offers[0]?.title_ar || "عروض خاصة — خصم يصل إلى 40%")
    : (offers[0]?.title   || "Special Offers — Up to 40% Off");
  const offerLink  = offers[0]?.link || "/categories";

  return (
    <div style={{ backgroundColor: "var(--bg)" }} dir={isAr ? "rtl" : "ltr"}>

      {/* ── Hero Swiper — data from GET /cms/swipers/ ─── */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-[26px] pt-4 sm:pt-5 lg:pt-8">
        <div className="relative overflow-hidden w-full" style={{ borderRadius: "clamp(16px,3vw,44px)", height: "clamp(200px,38vw,495px)" }}>
          <HeroSwiper locale={locale} swipers={swipers} />
        </div>
      </div>

      {/* ── Featured Categories — data from GET /categories/?featured=true ── */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {displayCategories.slice(0, 5).map((cat) => {
            const label = isAr && cat.name_ar ? cat.name_ar : cat.name;
            const img   = cat.image || "/images/p-table-lamp.png";
            return (
              <Link key={cat.id} href={`/categories?tab=${cat.slug}`} className="group block">
                <div className="relative overflow-hidden w-full" style={{ aspectRatio: "233/301" }}>
                  <Image src={img} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:480px) 47vw, (max-width:768px) 32vw, 20vw" />
                </div>
                <div className="flex items-center justify-between pt-1.5 pr-1">
                  <span className="text-[#1E1E1E] text-[11px] sm:text-[13px] font-medium" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{label}</span>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="shrink-0 ml-1" aria-hidden="true"><path d="M1 5H9M9 5L6 2M9 5L6 8" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── First 5 Products (white bg) ─────────────────── */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            {isAr ? "منتجاتنا" : "Our Products"}
          </h2>
          <Link href="/categories" className="text-[#D88F65] text-xs sm:text-sm font-medium hover:underline">
            {isAr ? "عرض الكل ←" : "View All →"}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {PRODUCTS_FIRST.map((p) => <ProductCard key={p.id} p={p} isAr={isAr} sym={sym} />)}
        </div>
      </section>

      {/* ── Offer Banner — data from GET /cms/offer-sections/ ─── */}
      <div className="relative overflow-hidden mx-3 sm:mx-4 md:mx-6 lg:mx-8 mt-8 sm:mt-10" style={{ minHeight: "clamp(160px,28vw,380px)" }}>
        <Image src={offerImage} alt={offerTitle} fill className="object-cover" sizes="(max-width:768px) 100vw, 90vw" />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} />
        <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16 ${isAr ? "items-end text-right" : "items-start"}`}>
          <p className="text-white/80 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase mb-1">Special Offer</p>
          <p className="text-white font-semibold leading-tight mb-3 sm:mb-5" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(18px,3.5vw,36px)" }}>
            {offerTitle}
          </p>
          <Link href={offerLink} className="inline-flex items-center gap-2 text-white font-medium rounded-full transition-opacity hover:opacity-90 text-xs sm:text-sm" style={{ backgroundColor: "#88B0BE", paddingLeft: 20, paddingRight: 20, height: "clamp(36px,5vw,48px)" }}>
            {isAr ? "تسوق الآن" : "Shop Now"}
          </Link>
        </div>
      </div>

      {/* ── Best Products (F4F1EA bg) ────────────────────── */}
      <section className="mt-8 sm:mt-10" style={{ backgroundColor: "#F4F1EA" }}>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="text-base sm:text-xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              {isAr ? "أفضل المنتجات" : "THE BEST PRODUCTS"}
            </h2>
            <Link href="/categories" className="text-[#D88F65] text-xs sm:text-sm font-medium hover:underline">
              {isAr ? "عرض الكل ←" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {PRODUCTS_REST.map((p) => <ProductCard key={p.id} p={p} isAr={isAr} sym={sym} />)}
          </div>
          <div className="flex justify-center mt-8 sm:mt-10">
            <Link href="/categories" className="inline-flex items-center justify-center gap-2 text-white font-medium rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: "#88B0BE", height: 50, paddingLeft: 32, paddingRight: 32, fontSize: 13 }}>
              {isAr ? "عرض كل المنتجات" : "View All Products"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} locale={locale} />}

    </div>
  );
}
