import { Router, Response } from "express";
import { User } from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// ─── GET /api/users/me/ ──────────────────────────
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      date_of_birth: user.date_of_birth,
      avatar: user.avatar,
      role: user.role,
    });
  } catch {
    res.status(500).json({ detail: "Failed to fetch user" });
  }
});

// ─── PUT /api/users/me/ ──────────────────────────
router.put("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { first_name, last_name, phone, address, date_of_birth } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { first_name, last_name, phone, address, date_of_birth },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      date_of_birth: user.date_of_birth,
      avatar: user.avatar,
      role: user.role,
    });
  } catch {
    res.status(500).json({ detail: "Failed to update profile" });
  }
});

export default router;
