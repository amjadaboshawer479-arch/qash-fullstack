import { Router, Request, Response } from "express";
import { Cart } from "../models/cart";
import { Product } from "../models/Product";

const router = Router();

// دالة مساعدة — تجيب أو تنشئ سلة بالـ cart_token
async function getOrCreateCart(cartToken: string) {
  let cart = await Cart.findOne({ cart_token: cartToken }).populate(
    "items.product",
  );
  if (!cart) {
    cart = await Cart.create({ cart_token: cartToken, items: [] });
  }
  return cart;
}

// دالة مساعدة — تحسب الإجمالي
function calculateTotal(
  items: { unit_price: string; quantity: number }[],
): string {
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
    0,
  );
  return total.toFixed(2);
}

// ─── GET /api/cart/my-cart/ ──────────────────────
router.get("/my-cart", async (req: Request, res: Response) => {
  try {
    const cartToken = req.headers["x-cart-token"] as string;
    if (!cartToken) {
      return res.status(400).json({ detail: "Cart token required" });
    }

    const cart = await getOrCreateCart(cartToken);
    res.json({
      id: cart._id,
      cart_token: cart.cart_token,
      items: cart.items,
      total_amount: calculateTotal(cart.items),
    });
  } catch {
    res.status(500).json({ detail: "Failed to fetch cart" });
  }
});

// ─── POST /api/cart/add-item/ ────────────────────
router.post("/add-item", async (req: Request, res: Response) => {
  try {
    const cartToken = req.headers["x-cart-token"] as string;
    const { product, quantity = 1 } = req.body;

    if (!cartToken) {
      return res.status(400).json({ detail: "Cart token required" });
    }

    // تأكد إن المنتج موجود
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ detail: "Product not found" });
    }

    const cart = await getOrCreateCart(cartToken);

    // شوف إذا المنتج موجود بالسلة
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity,
        unit_price: productDoc.discount_price || productDoc.base_price,
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      id: updatedCart!._id,
      items: updatedCart!.items,
      total_amount: calculateTotal(updatedCart!.items),
    });
  } catch {
    res.status(500).json({ detail: "Failed to add item" });
  }
});

// ─── POST /api/cart/update-item/ ─────────────────
router.post("/update-item", async (req: Request, res: Response) => {
  try {
    const cartToken = req.headers["x-cart-token"] as string;
    const { item_id, quantity } = req.body;

    const cart = await getOrCreateCart(cartToken);
    const item = cart.items.find((i) => i._id?.toString() === item_id);

    if (!item) {
      return res.status(404).json({ detail: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      id: updatedCart!._id,
      items: updatedCart!.items,
      total_amount: calculateTotal(updatedCart!.items),
    });
  } catch {
    res.status(500).json({ detail: "Failed to update item" });
  }
});

// ─── POST /api/cart/remove-item/ ─────────────────
router.post("/remove-item", async (req: Request, res: Response) => {
  try {
    const cartToken = req.headers["x-cart-token"] as string;
    const { item_id } = req.body;

    const cart = await getOrCreateCart(cartToken);
    cart.items = cart.items.filter((i) => i._id?.toString() !== item_id);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      id: updatedCart!._id,
      items: updatedCart!.items,
      total_amount: calculateTotal(updatedCart!.items),
    });
  } catch {
    res.status(500).json({ detail: "Failed to remove item" });
  }
});

// ─── POST /api/cart/clear-cart/ ──────────────────
router.post("/clear-cart", async (req: Request, res: Response) => {
  try {
    const cartToken = req.headers["x-cart-token"] as string;

    const cart = await getOrCreateCart(cartToken);
    cart.items = [];
    await cart.save();

    res.json({ id: cart._id, items: [], total_amount: "0.00" });
  } catch {
    res.status(500).json({ detail: "Failed to clear cart" });
  }
});

export default router;
