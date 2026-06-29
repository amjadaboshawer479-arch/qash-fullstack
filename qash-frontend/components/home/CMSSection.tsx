"use client";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/products/ProductCard";
import type { CMSSection } from "@/types";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  section: CMSSection;
  locale: string;
  currency: string;
}

export default function CMSSection({ section, locale, currency }: Props) {
  const title = locale === "ar" && section.title_ar ? section.title_ar : section.title;

  return (
    <section className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-[#1A1A1A] text-2xl font-semibold"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {title}
        </h2>
        <a
          href="/products"
          className="text-[#D88F65] text-sm font-medium hover:underline"
        >
          View All →
        </a>
      </div>
      <SwiperComponent
        modules={[Navigation]}
        navigation
        spaceBetween={12}
        slidesPerView={4}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {section.products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              locale={locale}
              currency={currency}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
}
