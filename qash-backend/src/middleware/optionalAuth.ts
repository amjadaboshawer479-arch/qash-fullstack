import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./auth";

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as { userId: string };
      req.userId = decoded.userId;
    }
    next();
  } catch {
    next();
  }
}
