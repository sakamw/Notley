import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/userMiddleware";
import nodemailer from "nodemailer";

const client = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created successfully." });
  } catch (e: any) {
    if (e.code === "P2002") {
      res.status(400).json({ message: "Email or username already in use." });
      return;
    }
    const message = e.message || "Something went wrong.";
    console.error(e);
    res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        message: "Email/username and password are required.",
        error: "MISSING_CREDENTIALS",
      });
      return;
    }

    const user = await client.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const { password: userPassword, ...userDetails } = user;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }

    const token = jwt.sign(userDetails, process.env.JWT_SECRET);
    // Set cookie options based on environment
    const isProduction = process.env.NODE_ENV === "production";
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: isProduction, // true in production, false in dev
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .json({ ...userDetails });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

export const updateUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Current and new password are required." });
      return;
    }
    if (currentPassword == newPassword) {
      res
        .status(400)
        .json({ message: "Current and new password should be different." });
      return;
    }
    const user = await client.user.findUnique({
      where: { id: String(userId) },
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect." });
      return;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await client.user.update({
      where: { id: String(userId) },
      data: { password: hashed },
    });
    res.json({ message: "Password updated successfully." });
  } catch (e) {
    res.status(500).json({ message: "Failed to update password." });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const oldUser = await client.user.findUnique({ where: { email } });
    if (!oldUser) {
      return res.status(200).json({
        message: "A reset link has been sent.",
      });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error." });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:4800/api/auth/reset-password/${oldUser.id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: oldUser.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${link}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
    });

    res.status(200).json({
      message: "A reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating reset link." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  if (req.method === "GET") {
    try {
      const oldUser = await client.user.findUnique({ where: { id } });
      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error." });
      }
      const secret = process.env.JWT_SECRET + oldUser.password;
      try {
        jwt.verify(token, secret);
        return res
          .status(200)
          .json({ message: "Token verified. You can reset your password." });
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error verifying reset link." });
    }
  } else if (req.method === "POST") {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }
    try {
      const oldUser = await client.user.findUnique({ where: { id } });
      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error." });
      }
      const secret = process.env.JWT_SECRET + oldUser.password;
      try {
        jwt.verify(token, secret);
        const hashed = await bcrypt.hash(password, 10);
        await client.user.update({ where: { id }, data: { password: hashed } });
        return res.status(200).json({ message: "Password reset successful." });
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error resetting password." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};
