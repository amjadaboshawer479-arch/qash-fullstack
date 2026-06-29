import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const categories = [
  { id: 1, name: "Lighting", name_ar: "الإضاءة", slug: "lighting", image: "/images/product-table-lamp.png", featured: true, parent: null, children: [], product_count: 5 },
  { id: 2, name: "Wall Decor", name_ar: "ديكور الجدران", slug: "wall-decor", image: "/images/product-wall-decor.png", featured: true, parent: null, children: [], product_count: 4 },
  { id: 3, name: "Bags", name_ar: "الحقائب", slug: "bags", image: "/images/product-bags.png", featured: true, parent: null, children: [], product_count: 2 },
  { id: 4, name: "Home Decor", name_ar: "ديكور المنزل", slug: "decor", image: "/images/product-bohemian.png", featured: true, parent: null, children: [], product_count: 3 },
  { id: 5, name: "Rugs", name_ar: "السجاد", slug: "rugs", image: "/images/product-rugs.png", featured: true, parent: null, children: [], product_count: 2 },
  { id: 6, name: "Bedroom", name_ar: "غرفة النوم", slug: "bedroom", image: "/images/product-master-bed.png", featured: false, parent: null, children: [], product_count: 3 },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const featured = url.searchParams.get("featured");
  const results = featured === "true" ? categories.filter(c => c.featured) : categories;
  return NextResponse.json({ count: results.length, next: null, previous: null, results });
}
