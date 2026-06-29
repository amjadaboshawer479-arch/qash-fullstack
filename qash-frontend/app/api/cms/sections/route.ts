import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    count: 1,
    results: [
      {
        id: 1,
        title: "Best Sellers",
        title_ar: "الأكثر مبيعاً",
        is_active: true,
        order: 1,
        products: [
          { id: 2, name: "Boho Wall Macrame", name_ar: "ماكريمي جداري", slug: "boho-wall-macrame", thumbnail: "/images/product-wall-decor.png", base_price: "120.00", discount_price: "95.00", has_discount: true, best_seller: true, is_available: true },
          { id: 5, name: "Artisan Pendant Lamp", name_ar: "مصباح حرفي", slug: "artisan-pendant-lamp", thumbnail: "/images/product-lighting.png", base_price: "195.00", discount_price: "160.00", has_discount: true, best_seller: true, is_available: true },
          { id: 9, name: "Gallery Wall Art Set", name_ar: "طقم لوحات جدارية", slug: "gallery-wall-art", thumbnail: "/images/product-gallery-wall.png", base_price: "155.00", discount_price: null, has_discount: false, best_seller: true, is_available: true },
          { id: 12, name: "Ceramic Table Lamp", name_ar: "مصباح طاولة سيراميك", slug: "ceramic-table-lamp", thumbnail: "/images/product-ceramic-lamp.png", base_price: "110.00", discount_price: "88.00", has_discount: true, best_seller: true, is_available: true },
        ],
      },
    ],
  });
}
