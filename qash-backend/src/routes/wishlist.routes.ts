import { Router, Response } from "express";
import { Wishlist } from "../models/Wishlist";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// كل الـ routes محمية
router.use(authMiddleware);

// ─── GET /api/wishlist/ ──────────────────────────
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.userId }).populate(
      "products",
    );
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.userId, products: [] });
    }

    const items = wishlist.products.map((p) => ({ product: p }));
    res.json(items);
  } catch {
    res.status(500).json({ detail: "Failed to fetch wishlist" });
  }
});

// ─── POST /api/wishlist/add-product/ ─────────────
router.post("/add-product", async (req: AuthRequest, res: Response) => {
  try {
    const { product_id } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.userId, products: [] });
    }

    // أضف المنتج إذا مش موجود
    if (!wishlist.products.some((p) => String(p) === product_id)) {
      wishlist.products.push(product_id);
      await wishlist.save();
    }

    res.json({ message: "Added to wishlist" });
  } catch {
    res.status(500).json({ detail: "Failed to add product" });
  }
});

// ─── POST /api/wishlist/remove-product/ ──────────
router.post("/remove-product", async (req: AuthRequest, res: Response) => {
  try {
    const { product_id } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => String(p) !== product_id,
      );
      await wishlist.save();
    }

    res.json({ message: "Removed from wishlist" });
  } catch {
    res.status(500).json({ detail: "Failed to remove product" });
  }
});

export default router;
