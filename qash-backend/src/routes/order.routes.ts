import { Router, Request, Response } from "express";
import { Order } from "../models/Order";
import { Cart } from "../models/cart";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { optionalAuth } from "../middleware/optionalAuth";
const router = Router();

// ─── POST /api/orders/checkout/ ──────────────────
router.post(
  "/checkout",
  optionalAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const cartToken = req.headers["x-cart-token"] as string;
      const {
        shipping_address,
        payment_method = "CASH_ON_DELIVERY",
        notes = "",
        guest_email,
        shipping_cost = "0.00",
        coupon_code = "",
      } = req.body;

      // 1. تأكد إن عنوان الشحن موجود
      if (!shipping_address || !shipping_address.full_name) {
        return res.status(400).json({ detail: "Shipping address is required" });
      }

      // 2. جيب السلة
      const cart = await Cart.findOne({ cart_token: cartToken }).populate(
        "items.product",
      );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ detail: "Cart is empty" });
      }

      // 3. حوّل عناصر السلة لعناصر طلب
      const orderItems = cart.items.map((item) => {
        const product = item.product as unknown as {
          _id: string;
          name: string;
        };
        const lineTotal = (parseFloat(item.unit_price) * item.quantity).toFixed(
          2,
        );
        return {
          product: product._id,
          product_name: product.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: lineTotal,
        };
      });

      // 4. احسب المجاميع
      const subtotal = orderItems.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0,
      );

      // احسب الخصم من الكوبون
      let discount = "0.00";
      if (coupon_code === "SAVE10") {
        discount = (subtotal * 0.1).toFixed(2);
      }

      const total = subtotal + parseFloat(shipping_cost) - parseFloat(discount);

      // 5. أنشئ الطلب
      const order = await Order.create({
        user: req.userId || null,
        guest_email: guest_email || null,
        items: orderItems,
        shipping_address,
        payment_method,
        notes,
        subtotal: subtotal.toFixed(2),
        shipping_cost,
        discount,
        total_amount: total.toFixed(2),
      });

      // 6. فرّغ السلة بعد الطلب
      cart.items = [];
      await cart.save();

      res.status(201).json({
        order_id: order._id,
        total: order.total_amount,
        status: order.status,
        message: "Order placed successfully",
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ detail: "Checkout failed" });
    }
  },
);

// ─── GET /api/orders/ (محمي) ─────────────────────
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const pageSize = parseInt((req.query.page_size as string) || "10");
    const skip = (page - 1) * pageSize;

    const filter = { user: req.userId };
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      count: total,
      next: skip + pageSize < total ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: orders,
    });
  } catch {
    res.status(500).json({ detail: "Failed to fetch orders" });
  }
});

// ─── GET /api/orders/:id/ (محمي) ─────────────────
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) {
      return res.status(404).json({ detail: "Order not found" });
    }
    res.json(order);
  } catch {
    res.status(500).json({ detail: "Failed to fetch order" });
  }
});

// ─── POST /api/orders/:id/cancel/ (محمي) ─────────
router.post(
  "/:id/cancel",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.userId,
      });
      if (!order) {
        return res.status(404).json({ detail: "Order not found" });
      }

      // فقط الطلبات PENDING يمكن إلغاؤها
      if (order.status !== "PENDING") {
        return res
          .status(400)
          .json({ detail: "Only pending orders can be cancelled" });
      }

      order.status = "CANCELLED";
      await order.save();

      res.json({ message: "Order cancelled", status: order.status });
    } catch {
      res.status(500).json({ detail: "Failed to cancel order" });
    }
  },
);

export default router;
