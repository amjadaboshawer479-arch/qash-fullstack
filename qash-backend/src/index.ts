import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import extraRoutes from "./routes/extra.routes";
import wishlistRoutes from "./routes/wishlist.routes";

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// يشيل الـ trailing slash من نهاية الـ URL
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    res.redirect(307, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

// الاتصال بقاعدة البيانات
connectDB();

// Routes
app.use("/api", extraRoutes);
app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

// route اختبار
app.get("/", (req, res) => {
  res.json({ message: "Qash Backend API is running 🚀" });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
