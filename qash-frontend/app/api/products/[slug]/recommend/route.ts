import { NextResponse } from "next/server";
const recommended = [
  { id: 5, name: "Artisan Pendant Lamp", name_ar: "مصباح حرفي معلق", slug: "artisan-pendant-lamp", thumbnail: "/images/product-lighting.png", base_price: "195.00", discount_price: "160.00", has_discount: true, best_seller: true, is_available: true },
  { id: 3, name: "Woven Pendant Light", name_ar: "مصباح معلق منسوج", slug: "woven-pendant-light", thumbnail: "/images/product-pendant.png", base_price: "140.00", discount_price: null, has_discount: false, best_seller: false, is_available: true },
  { id: 12, name: "Ceramic Table Lamp", name_ar: "مصباح طاولة سيراميك", slug: "ceramic-table-lamp", thumbnail: "/images/product-ceramic-lamp.png", base_price: "110.00", discount_price: "88.00", has_discount: true, best_seller: true, is_available: true },
  { id: 6, name: "Globe Pendant Lamp", name_ar: "مصباح كروي معلق", slug: "globe-pendant-lamp", thumbnail: "/images/product-globe-lamp.png", base_price: "210.00", discount_price: null, has_discount: false, best_seller: false, is_available: true },
];
export async function GET() {
  return NextResponse.json(recommended);
}
