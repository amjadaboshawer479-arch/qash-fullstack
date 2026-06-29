"use client";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import type { Swiper as SwiperType } from "@/types";
import "swiper/css";
import "swiper/css/pagination";

/* Static fallback slides used if API returns empty */
const FALLBACK_SLIDES = [
  { id: 1, image: "/images/p-master-bed.png",     title: "Artisan Living",    title_ar: "الحياة الحرفية",    subtitle: "Handcrafted pieces for your home", subtitle_ar: "قطع مصنوعة يدوياً لمنزلك",  link: "/categories" },
  { id: 2, image: "/images/p-living-room.png",    title: "Bohemian Elegance", title_ar: "الأناقة البوهيمية", subtitle: "Natural textures & warm tones",    subtitle_ar: "ملمس طبيعي ودرجات دافئة",  link: "/categories" },
  { id: 3, image: "/images/p-pendant-lights.png", title: "New Collection",    title_ar: "مجموعة جديدة",      subtitle: "Discover the latest arrivals",     subtitle_ar: "اكتشف أحدث الوصولات",       link: "/categories" },
];

interface Props {
  locale: string;
  swipers?: SwiperType[];
}

export default function HeroSwiper({ locale, swipers }: Props) {
  const isAr  = locale === "ar";
  const slides = swipers && swipers.length > 0 ? swipers : FALLBACK_SLIDES;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SwiperComponent
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, i) => {
          const title    = isAr && slide.title_ar    ? slide.title_ar    : slide.title;
          const subtitle = isAr && slide.subtitle_ar ? slide.subtitle_ar : slide.subtitle;
          const href     = slide.link || "/categories";
          const img      = slide.image || FALLBACK_SLIDES[i % 3].image;
          return (
            <SwiperSlide key={slide.id ?? i} className="relative w-full h-full">
              <Image src={img} alt={title} fill className="object-cover" priority={i === 0} sizes="(max-width:768px) 100vw, 1228px" />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.22)" }} />
              <div className={`absolute inset-0 flex flex-col justify-end pb-10 sm:pb-14 px-6 sm:px-10 lg:px-16 ${isAr ? "items-end text-right" : "items-start text-left"}`}>
                <h1 className="text-white font-semibold leading-tight mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(22px, 4.5vw, 52px)", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                  {title}
                </h1>
                <p className="text-white/85 mb-4 sm:mb-6" style={{ fontSize: "clamp(12px, 1.6vw, 18px)" }}>{subtitle}</p>
                <Link href={href} className="inline-flex items-center gap-2 text-white font-medium rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: "#88B0BE", paddingLeft: "clamp(16px,3vw,28px)", paddingRight: "clamp(16px,3vw,28px)", height: "clamp(38px,5vw,52px)", fontSize: "clamp(11px,1.4vw,14px)" }}>
                  {isAr ? "تسوق الآن" : "Shop Now"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </SwiperComponent>
    </div>
  );
}
