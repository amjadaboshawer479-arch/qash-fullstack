import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    count: 3, next: null, previous: null,
    results: [
      { id: 1, title: "Artisan Living", title_ar: "الحياة الحرفية", subtitle: "Handcrafted pieces for your home", subtitle_ar: "قطع مصنوعة يدوياً لمنزلك", image: "/images/hero-bedroom.png", link: "/products", is_active: true, order: 1 },
      { id: 2, title: "Bohemian Elegance", title_ar: "الأناقة البوهيمية", subtitle: "Natural textures & warm tones", subtitle_ar: "ملمس طبيعي ودرجات دافئة", image: "/images/hero-living-room.png", link: "/products", is_active: true, order: 2 },
      { id: 3, title: "New Collection", title_ar: "مجموعة جديدة", subtitle: "Discover the latest arrivals", subtitle_ar: "اكتشف أحدث الوصولات", image: "/images/product-master-bed.png", link: "/products", is_active: true, order: 3 },
    ]
  });
}
