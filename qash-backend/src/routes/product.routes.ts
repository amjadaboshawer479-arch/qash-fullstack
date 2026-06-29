import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

const router = Router();

// ─── GET /api/products/ ──────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search,
      category_slug,
      price_min,
      price_max,
      ordering,
      best_seller,
      page = "1",
      page_size = "12",
    } = req.query;

    // بناء فلتر البحث
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category_slug) {
      filter.category = category_slug;
    }
    if (best_seller === "true") {
      filter.best_seller = true;
    }
    if (price_min || price_max) {
      filter.base_price = {};
      if (price_min)
        (filter.base_price as Record<string, unknown>).$gte = price_min;
      if (price_max)
        (filter.base_price as Record<string, unknown>).$lte = price_max;
    }

    // الترتيب
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (ordering === "price") sort = { base_price: 1 };
    if (ordering === "-price") sort = { base_price: -1 };
    if (ordering === "newest") sort = { createdAt: -1 };

    // الـ pagination
    const pageNum = parseInt(page as string);
    const pageSize = parseInt(page_size as string);
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.json({
      count: total,
      next: skip + pageSize < total ? `?page=${pageNum + 1}` : null,
      previous: pageNum > 1 ? `?page=${pageNum - 1}` : null,
      results: products,
    });
  } catch {
    res.status(500).json({ detail: "Failed to fetch products" });
  }
});

// ─── GET /api/products/:slug/ ────────────────────
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ detail: "Product not found" });
    }
    res.json(product);
  } catch {
    res.status(500).json({ detail: "Failed to fetch product" });
  }
});
// ─── POST /api/products/ (للإضافة فقط - تجريبي) ──
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ detail: "Failed to create product", error });
  }
});
// ─── GET /api/products/:slug/recommend/ ──────────
router.get("/:slug/recommend", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ detail: "Product not found" });
    }

    // جيب منتجات من نفس الفئة (ما عدا المنتج نفسه)
    const recommended = await Product.find({
      category: product.category,
      slug: { $ne: req.params.slug },
    }).limit(4);

    res.json(recommended);
  } catch {
    res.status(500).json({ detail: "Failed to fetch recommendations" });
  }
});
export default router;
