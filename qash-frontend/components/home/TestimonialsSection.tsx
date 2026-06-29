"use client";
import type { Testimonial } from "@/types";
import { Star } from "lucide-react";

// SVG: testimonials section has footer-like background #F4F1EA
interface Props {
  testimonials: Testimonial[];
  locale: string;
}

export default function TestimonialsSection({ testimonials, locale }: Props) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ backgroundColor: "#F4F1EA" }}>
      <h2
        className="text-[#1A1A1A] text-2xl font-semibold mb-8 text-center"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        {locale === "ar" ? "آراء عملائنا" : "What Our Customers Say"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {testimonials.slice(0, 6).map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-lg">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < t.rating ? "fill-[#D88F65] text-[#D88F65]" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <p className="text-[#313131] text-sm leading-relaxed mb-4">{t.content}</p>
            <p className="text-[#D88F65] text-xs font-semibold tracking-wide">
              — {t.user?.username || "Customer"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
