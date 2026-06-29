"use client";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

// SVG: 5 cards at y=818, each 233×301px, starting at x=32 with 12px gap
// Exact images from SVG
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Lighting", name_ar: "الإضاءة", slug: "lighting", image: "/images/product-table-lamp.png" },
  { id: 2, name: "Rugs", name_ar: "السجاد", slug: "rugs", image: "/images/product-rugs.png" },
  { id: 3, name: "Wall Decor", name_ar: "ديكور الجدران", slug: "wall-decor", image: "/images/product-wall-decor.png" },
  { id: 4, name: "Bags", name_ar: "الحقائب", slug: "bags", image: "/images/product-bags.png" },
  { id: 5, name: "Pendants", name_ar: "المعلقات", slug: "pendants", image: "/images/product-pendant.png" },
];

interface Props {
  categories?: Category[];
  locale: string;
}

export default function FeaturedCategories({ categories, locale }: Props) {
  const items = categories && categories.length > 0 ? categories.slice(0, 5) : DEFAULT_CATEGORIES;

  return (
    // SVG: categories start at y=818 right after hero
    <section className="px-8 pt-8">
      {/* 5 equal columns, each 233px wide, gap 12px */}
      <div className="grid grid-cols-5 gap-3">
        {items.map((cat, i) => {
          const imgSrc = cat.image || DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length]?.image || "/images/product-table-lamp.png";
          const label = locale === "ar" && cat.name_ar ? cat.name_ar : cat.name;
          return (
            <Link
              key={cat.id}
              href={`/products?category_slug=${cat.slug}`}
              className="group block"
            >
              {/* SVG card: 233×301px */}
              <div
                className="relative overflow-hidden"
                style={{ height: 301 }}
              >
                <Image
                  src={imgSrc}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="233px"
                />
              </div>
              {/* Category name below image — SVG shows text underneath */}
              <div className="pt-2 pb-1">
                <p
                  className="text-[#1A1A1A] text-sm font-medium text-center"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
