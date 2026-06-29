import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart, cartKey, type CartItem } from "@/lib/cart-store";

const PRODUCTS: Record<number, Record<string, unknown>> = {
  1:  { id: 1,  name: "Rattan Table Lamp",     name_ar: "مصباح طاولة راتان",      slug: "rattan-table-lamp",      thumbnail: "/images/p-table-lamp.png",     base_price: "85.00",  discount_price: null,     has_discount: false },
  2:  { id: 2,  name: "Boho Wall Macrame",      name_ar: "ماكريمي جداري",           slug: "boho-wall-macrame",       thumbnail: "/images/p-wall-decor.png",     base_price: "120.00", discount_price: "95.00",  has_discount: true  },
  3:  { id: 3,  name: "Woven Pendant Light",    name_ar: "مصباح معلق منسوج",        slug: "woven-pendant-light",     thumbnail: "/images/p-pendant-lights.png", base_price: "140.00", discount_price: null,     has_discount: false },
  4:  { id: 4,  name: "Quilted Pouches Set",    name_ar: "طقم حقائب مبطنة",         slug: "quilted-pouches",         thumbnail: "/images/p-bags.png",           base_price: "65.00",  discount_price: null,     has_discount: false },
  5:  { id: 5,  name: "Artisan Pendant Lamp",   name_ar: "مصباح حرفي",               slug: "artisan-pendant-lamp",    thumbnail: "/images/p-pendant-lights.png", base_price: "195.00", discount_price: "160.00", has_discount: true  },
  6:  { id: 6,  name: "Globe Pendant Lamp",     name_ar: "مصباح كروي",               slug: "globe-pendant-lamp",      thumbnail: "/images/p-globe-lamp.png",     base_price: "210.00", discount_price: null,     has_discount: false },
  7:  { id: 7,  name: "Boho Shelf Decor",       name_ar: "ديكور رف بوهيمي",         slug: "boho-shelf-decor",        thumbnail: "/images/p-bohemian.png",       base_price: "75.00",  discount_price: null,     has_discount: false },
  8:  { id: 8,  name: "Macrame & Vase Set",     name_ar: "طقم ماكريمي وإناء",       slug: "macrame-vase-set",        thumbnail: "/images/p-macrame.png",        base_price: "90.00",  discount_price: "72.00",  has_discount: true  },
  9:  { id: 9,  name: "Globe Pendant Lamp",     name_ar: "مصباح كروي معلق",          slug: "globe-pendant-lamp",      thumbnail: "/images/p-globe-lamp.png",     base_price: "210.00", discount_price: null,     has_discount: false },
  10: { id: 10, name: "Boho Shelf Decor",       name_ar: "ديكور رف بوهيمي",         slug: "boho-shelf-decor",        thumbnail: "/images/p-bohemian.png",       base_price: "75.00",  discount_price: null,     has_discount: false },
  11: { id: 11, name: "Fiber Art Wall Piece",   name_ar: "لوحة فنية جدارية",        slug: "fiber-art-wall",          thumbnail: "/images/p-fiber-art.png",      base_price: "180.00", discount_price: "145.00", has_discount: true  },
  12: { id: 12, name: "Macrame & Vase Set",     name_ar: "طقم ماكريمي وإناء",       slug: "macrame-vase-set",        thumbnail: "/images/p-macrame.png",        base_price: "90.00",  discount_price: "72.00",  has_discount: true  },
  13: { id: 13, name: "Gallery Wall Art Set",   name_ar: "طقم لوحات جدارية",        slug: "gallery-wall-art",        thumbnail: "/images/p-gallery-wall.png",   base_price: "155.00", discount_price: null,     has_discount: false },
  14: { id: 14, name: "Wall Hanging Macrame",   name_ar: "ماكريمي جداري معلق",      slug: "wall-hanging-macrame",    thumbnail: "/images/p-wall-hanging.png",   base_price: "120.00", discount_price: "95.00",  has_discount: true  },
  15: { id: 15, name: "Natural Jute Rug",       name_ar: "سجادة جوت طبيعية",        slug: "natural-jute-rug",        thumbnail: "/images/p-rugs-2.png",         base_price: "220.00", discount_price: null,     has_discount: false },
};

export async function POST(req: NextRequest) {
  const key = cartKey(req);
  const body = await req.json();
  const { product: productId, quantity = 1 } = body;
  const productData = PRODUCTS[productId] ?? {
    id: productId, name: "Product", slug: "product",
    thumbnail: "/images/p-table-lamp.png",
    base_price: "95.00", discount_price: null, has_discount: false,
  };
  const price = (productData.discount_price as string | null) ?? (productData.base_price as string);
  const cart = getCart(key);

  const existing = cart.items.find((i) => (i.product as Record<string, unknown>).id === productId);
  if (existing) {
    existing.quantity += quantity;
    existing.total_price = (parseFloat(price) * existing.quantity).toFixed(2);
  } else {
    cart.items.push({
      id: Date.now(), product: productData,
      variation: null, combination: null,
      quantity, unit_price: price,
      total_price: (parseFloat(price) * quantity).toFixed(2),
    });
  }
  return NextResponse.json(saveCart(key, cart));
}
