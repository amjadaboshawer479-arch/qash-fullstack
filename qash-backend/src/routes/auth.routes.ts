import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { sendVerificationEmail } from "../utils/email";

const router = Router();

// دالة مساعدة — تتحقق من صيغة الإيميل
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ─── POST /api/users/register/ ───────────────────
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // 1. تأكد إن كل الحقول موجودة
    const errors: Record<string, string[]> = {};
    if (!email) errors.email = ["Email is required"];
    if (!password) errors.password = ["Password is required"];
    if (!first_name) errors.first_name = ["First name is required"];
    if (!last_name) errors.last_name = ["Last name is required"];
    if (!phone) errors.phone = ["Phone number is required"];
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 2. تأكد إن صيغة الإيميل صحيحة
    if (!isValidEmail(email)) {
      return res.status(400).json({ email: ["Invalid email format"] });
    }

    // 3. تأكد إن الباسورد طوله كافي
    if (password.length < 8) {
      return res.status(400).json({
        password: ["Password must be at least 8 characters"],
      });
    }

    // 4. تأكد إن الإيميل مش مستخدم
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        email: ["This email is already registered"],
      });
    }

    // 5. شفّر الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. ولّد كود التحقق (6 أرقام)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // 7. أنشئ المستخدم — username يتولّد تلقائياً من الإيميل
    const username = email.split("@")[0] + "_" + Date.now();
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      verification_code: verificationCode,
      is_verified: false,
    });

    // 8. ابعت كود التحقق على الإيميل
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    // 7. ولّد token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { access: token, refresh: token },
    });
  } catch (error) {
    console.error("❌❌❌ REGISTER ERROR:", error);
    res
      .status(500)
      .json({ detail: "Registration failed", error: String(error) });
  }
});

// ─── POST /api/users/login/ ──────────────────────
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. تأكد إن الحقول موجودة
    const errors: Record<string, string[]> = {};
    if (!email) errors.email = ["Email is required"];
    if (!password) errors.password = ["Password is required"];
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 2. ابحث عن المستخدم بالإيميل
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        email: ["No account found with this email"],
      });
    }

    // 3. قارن الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        password: ["Incorrect password"],
      });
    }
// 3.5 تأكد إن الحساب متحقق
    if (!user.is_verified) {
      return res.status(403).json({
        detail: "Please verify your email first",
        needs_verification: true,
        email: user.email,
      });
    }
    // 4. ولّد token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { access: token, refresh: token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ detail: "Login failed" });
  }
});
// ─── POST /api/users/verify-email/ ───────────────
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ detail: "Email and code are required" });
    }

    // ابحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    // تحقق إنه مش متفعّل أصلاً
    if (user.is_verified) {
      return res.status(400).json({ detail: "Email already verified" });
    }

    // قارن الكود
    if (user.verification_code !== code) {
      return res.status(400).json({ code: ["Invalid verification code"] });
    }

    // فعّل الحساب
    user.is_verified = true;
    user.verification_code = null;
    await user.save();

    // ولّد token عشان يدخل مباشرة بعد التحقق
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Email verified successfully",
      verified: true,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { access: token, refresh: token },
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ detail: "Verification failed" });
  }
});

// ─── POST /api/users/resend-code/ ────────────────
router.post("/resend-code", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ detail: "Email already verified" });
    }

    // ولّد كود جديد
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verification_code = newCode;
    await user.save();

    // ابعته
    await sendVerificationEmail(email, newCode);

    res.json({ message: "Code resent successfully" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ detail: "Failed to resend code" });
  }
});
export default router;
