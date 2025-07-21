import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Express } from "express";

export const avatarUpload = multer({ storage: multer.memoryStorage() });

export interface AuthRequest extends Request {
  user?: { id: number };
  file?: Express.Multer.File;
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.authToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }
    (req as any).user = { id: (decoded as any).id };
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token." });
    return;
  }
}
