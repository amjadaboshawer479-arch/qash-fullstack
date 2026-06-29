"use client";
import Image from "next/image";
import Link from "next/link";
import type { OfferSection } from "@/types";

// SVG: offer banner at y=2526, x=475 w=773 h=500 — right-aligned with white caption box
// White caption box at y=2553 x=476 w=434 h=97

interface Props {
  offer: OfferSection;
  locale: string;
  cta?: string;
}

export default function OfferBanner({ offer, locale, cta = "Shop Now" }: Props) {
  const title = locale === "ar" && offer.title_ar ? offer.title_ar : offer.title;
  const imgSrc = offer.image || "/images/hero-living-room.png";

  return (
    <section className="px-8 py-8">
      <div className="relative" style={{ height: 500 }}>
        {/* Full offer image — right portion of section */}
        <div className="absolute right-0 top-0 bottom-0" style={{ width: "60%" }}>
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="773px"
          />
        </div>

        {/* White caption box — SVG: x=476 y=2553 w=434 h=97, appears on top-left of image */}
        <div
          className="absolute bg-white flex flex-col justify-center px-6 z-10"
          style={{ left: "0%", top: "5%", width: 434, minHeight: 97, maxWidth: "55%" }}
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D88F65] mb-1">
            Special Offer
          </p>
          <h2
            className="text-[#1A1A1A] text-2xl font-semibold leading-tight mb-2"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {title}
          </h2>
          <Link
            href={offer.link || "/products"}
            className="text-[#D88F65] text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            {cta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
