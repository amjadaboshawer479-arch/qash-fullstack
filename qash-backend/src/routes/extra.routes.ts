import { Router, Request, Response } from "express";
import { Contact } from "../models/Contact";
const router = Router();

// ─── GET /api/categories/ ────────────────────────
router.get("/categories", (req: Request, res: Response) => {
  res.json({
    count: 5,
    results: [
      {
        id: 1,
        name: "Lighting",
        name_ar: "الإضاءة",
        slug: "lighting",
        image: "/images/p-table-lamp.png",
        featured: true,
      },
      {
        id: 2,
        name: "Rugs",
        name_ar: "السجاد",
        slug: "rugs",
        image: "/images/p-rugs.png",
        featured: true,
      },
      {
        id: 3,
        name: "Ceramics",
        name_ar: "السيراميك",
        slug: "ceramics",
        image: "/images/p-ceramic-lamp.png",
        featured: true,
      },
      {
        id: 4,
        name: "Bags",
        name_ar: "الحقائب",
        slug: "bags",
        image: "/images/p-bags.png",
        featured: true,
      },
      {
        id: 5,
        name: "Wall Decor",
        name_ar: "ديكور الجدران",
        slug: "wall-decor",
        image: "/images/p-wall-decor.png",
        featured: true,
      },
    ],
  });
});

// ─── GET /api/filters/ ───────────────────────────
router.get("/filters", (req: Request, res: Response) => {
  res.json({
    count: 2,
    results: [
      {
        id: 1,
        name: "Color",
        name_ar: "اللون",
        values: [
          { id: 1, value: "Beige", value_ar: "بيج" },
          { id: 2, value: "Gold", value_ar: "ذهبي" },
          { id: 3, value: "Black", value_ar: "أسود" },
        ],
      },
      {
        id: 2,
        name: "Size",
        name_ar: "الحجم",
        values: [
          { id: 4, value: "Small", value_ar: "صغير" },
          { id: 5, value: "Medium", value_ar: "وسط" },
          { id: 6, value: "Large", value_ar: "كبير" },
        ],
      },
    ],
  });
});

// ─── GET /api/logistics/currencies/ ──────────────
router.get("/logistics/currencies", (req: Request, res: Response) => {
  res.json({
    results: [
      { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
      { code: "USD", symbol: "$", name: "US Dollar" },
      { code: "EUR", symbol: "€", name: "Euro" },
      { code: "SAR", symbol: "SR", name: "Saudi Riyal" },
      { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    ],
  });
});

// ─── GET /api/logistics/countries/ ───────────────
router.get("/logistics/countries", (req: Request, res: Response) => {
  res.json({
    results: [
      { id: 1, name: "Jordan", name_ar: "الأردن", code: "JO" },
      { id: 2, name: "Saudi Arabia", name_ar: "السعودية", code: "SA" },
      { id: 3, name: "UAE", name_ar: "الإمارات", code: "AE" },
      { id: 4, name: "Egypt", name_ar: "مصر", code: "EG" },
    ],
  });
});

// ─── GET /api/logistics/shipping-options/ ────────
router.get("/logistics/shipping-options", (req: Request, res: Response) => {
  res.json({
    results: [
      {
        id: 1,
        name: "Standard Shipping",
        name_ar: "شحن عادي",
        price: "5.00",
        estimated_days: "3-5",
      },
      {
        id: 2,
        name: "Express Shipping",
        name_ar: "شحن سريع",
        price: "10.00",
        estimated_days: "1-2",
      },
    ],
  });
});

// ─── GET /api/cms/swipers/ ───────────────────────
router.get("/cms/swipers", (req: Request, res: Response) => {
  res.json({
    results: [
      {
        id: 1,
        image: "/images/p-master-bed.png",
        title: "Artisan Living",
        title_ar: "الحياة الحرفية",
        subtitle: "Handcrafted pieces",
        subtitle_ar: "قطع مصنوعة يدوياً",
        link: "/categories",
      },
      {
        id: 2,
        image: "/images/p-living-room.png",
        title: "Bohemian Elegance",
        title_ar: "الأناقة البوهيمية",
        subtitle: "Natural textures",
        subtitle_ar: "ملمس طبيعي",
        link: "/categories",
      },
    ],
  });
});

// ─── GET /api/cms/sections/ ──────────────────────
router.get("/cms/sections", (req: Request, res: Response) => {
  res.json({ results: [] });
});

// ─── GET /api/cms/offer-sections/ ────────────────
router.get("/cms/offer-sections", (req: Request, res: Response) => {
  res.json({
    results: [
      {
        id: 1,
        image: "/images/p-wall-decor.png",
        title: "Special Offers",
        title_ar: "عروض خاصة",
        link: "/categories",
      },
    ],
  });
});

// ─── POST /api/cms/newsletter/ ───────────────────
router.post("/cms/newsletter", (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ email: ["Email is required"] });
  res.status(201).json({ message: "Subscribed successfully" });
});

// ─── GET /api/testimonials/ ──────────────────────
router.get("/testimonials", (req: Request, res: Response) => {
  res.json({
    count: 2,
    results: [
      {
        id: 1,
        name: "Sara Ahmad",
        title: "Amazing quality",
        content: "Beautiful products and fast delivery!",
        rating: 5,
        avatar: null,
        is_approved: true,
      },
      {
        id: 2,
        name: "Omar Khalid",
        title: "Highly recommend",
        content: "Great customer service and unique items.",
        rating: 5,
        avatar: null,
        is_approved: true,
      },
    ],
  });
});

// ─── POST /api/testimonials/ ─────────────────────
router.post("/testimonials", (req: Request, res: Response) => {
  const { title, content, rating } = req.body;
  if (!title || !content || !rating) {
    return res.status(400).json({ detail: "All fields are required" });
  }
  res.status(201).json({ message: "Review submitted", is_approved: false });
});

// ─── POST /api/contact/ ──────────────────────────
router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, subject, message } = req.body;
    const errors: Record<string, string[]> = {};
    if (!name) errors.name = ["Name is required"];
    if (!email) errors.email = ["Email is required"];
    if (!message) errors.message = ["Message is required"];
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const saved = await Contact.create({
      name,
      email,
      phone,
      location,
      subject,
      message,
    });
    console.log("✅ Contact saved:", saved._id);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Contact save failed:", error);
    res.status(500).json({ detail: "Failed to save message" });
  }
});
// ─── POST /api/promotions/coupons/validate/ ──────
router.post("/promotions/coupons/validate", (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  // الكوبون SAVE10 = خصم 10%
  if (code === "SAVE10") {
    const discount = (parseFloat(subtotal) * 0.1).toFixed(2);
    return res.json({
      valid: true,
      code: "SAVE10",
      discount_amount: discount,
      message: "Coupon applied successfully",
    });
  }

  res.status(400).json({ valid: false, detail: "Invalid coupon code" });
});

// ─── POST /api/accounts/auth/logout/ ─────────────
router.post("/accounts/auth/logout", (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
});
export default router;
