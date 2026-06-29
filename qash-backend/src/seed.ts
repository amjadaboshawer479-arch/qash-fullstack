import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product";

dotenv.config();

const products = [
  { name: "Globe Pendant Lamp", name_ar: "مصباح كروي معلق", slug: "globe-pendant-lamp", base_price: "210.00", discount_price: null, has_discount: false, best_seller: true, thumbnail: "/images/p-globe-lamp.png", category: "lighting", stock: 15 },
  { name: "Boho Shelf Decor", name_ar: "ديكور رف بوهيمي", slug: "boho-shelf-decor", base_price: "75.00", discount_price: null, has_discount: false, best_seller: false, thumbnail: "/images/p-bohemian.png", category: "decor", stock: 20 },
  { name: "Fiber Art Wall Piece", name_ar: "لوحة فنية جدارية", slug: "fiber-art-wall", base_price: "180.00", discount_price: "145.00", has_discount: true, best_seller: false, thumbnail: "/images/p-fiber-art.png", category: "wall-decor", stock: 10 },
  { name: "Macrame & Vase Set", name_ar: "طقم ماكريمي وإناء", slug: "macrame-vase-set", base_price: "90.00", discount_price: "72.00", has_discount: true, best_seller: false, thumbnail: "/images/p-macrame.png", category: "decor", stock: 12 },
  { name: "Gallery Wall Art Set", name_ar: "طقم لوحات جدارية", slug: "gallery-wall-art", base_price: "155.00", discount_price: null, has_discount: false, best_seller: true, thumbnail: "/images/p-gallery-wall.png", category: "wall-decor", stock: 8 },
  { name: "Wall Hanging Macrame", name_ar: "ماكريمي جداري معلق", slug: "wall-hanging-macrame", base_price: "120.00", discount_price: "95.00", has_discount: true, best_seller: true, thumbnail: "/images/p-wall-hanging.png", category: "wall-decor", stock: 18 },
  { name: "Natural Jute Rug", name_ar: "سجادة جوت طبيعية", slug: "natural-jute-rug", base_price: "220.00", discount_price: null, has_discount: false, best_seller: false, thumbnail: "/images/p-rugs-2.png", category: "rugs", stock: 7 },
  { name: "Artisan Rug", name_ar: "سجادة حرفية", slug: "artisan-rug", base_price: "195.00", discount_price: "160.00", has_discount: true, best_seller: true, thumbnail: "/images/p-rugs.png", category: "rugs", stock: 9 },
  { name: "Ceramic Table Lamp", name_ar: "مصباح طاولة سيراميك", slug: "ceramic-table-lamp", base_price: "110.00", discount_price: "88.00", has_discount: true, best_seller: true, thumbnail: "/images/p-ceramic-lamp.png", category: "lighting", stock: 14 },
  { name: "Quilted Pouches Set", name_ar: "طقم حقائب مبطنة", slug: "quilted-pouches", base_price: "65.00", discount_price: null, has_discount: false, best_seller: false, thumbnail: "/images/p-bags.png", category: "bags", stock: 25 },
  { name: "Artisan Pendant Lamp", name_ar: "مصباح حرفي معلق", slug: "artisan-pendant-lamp", base_price: "195.00", discount_price: "160.00", has_discount: true, best_seller: true, thumbnail: "/images/p-pendant-lights.png", category: "lighting", stock: 11 },
  { name: "Boho Wall Macrame", name_ar: "ماكريمي جداري بوهيمي", slug: "boho-wall-macrame", base_price: "120.00", discount_price: "95.00", has_discount: true, best_seller: true, thumbnail: "/images/p-wall-decor.png", category: "wall-decor", stock: 16 },
  { name: "Master Bedroom Set", name_ar: "طقم غرفة نوم رئيسية", slug: "master-bedroom-set", base_price: "450.00", discount_price: null, has_discount: false, best_seller: false, thumbnail: "/images/p-master-bed.png", category: "bedroom", stock: 5 },
  { name: "Table Lamp Classic", name_ar: "مصباح طاولة كلاسيكي", slug: "table-lamp-classic", base_price: "95.00", discount_price: null, has_discount: false, best_seller: false, thumbnail: "/images/p-table-lamp.png", category: "lighting", stock: 13 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    // احذف المنتجات القديمة
    await Product.deleteMany({});
    console.log("🗑️  Cleared old products");

    // أضف المنتجات الجديدة
    await Product.insertMany(products);
    console.log(`✅ Added ${products.length} products`);

    await mongoose.disconnect();
    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();