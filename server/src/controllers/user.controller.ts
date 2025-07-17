import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";
import cloudinary from "cloudinary";

const client = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
});

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
        dateJoined: true,
        updatedAt: true,
      },
    });
    if (!user) return void res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const updateUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const { firstName, lastName, username, email } = req.body;
    let whereClause: any = { NOT: { id: userId } };
    if (username && email) {
      whereClause.OR = [{ username }, { email }];
    } else if (username) {
      whereClause.username = username;
    } else if (email) {
      whereClause.email = email;
    }
    if (username || email) {
      const existing = await client.user.findFirst({
        where: whereClause,
      });
      if (existing) {
        return void res
          .status(400)
          .json({ message: "Email or username already in use." });
      }
    }
    const updated = await client.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username,
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
        dateJoined: true,
        updatedAt: true,
      },
    });
    return void res.json(updated);
  } catch (e) {
    return void res
      .status(500)
      .json({ message: "Failed to update user info." });
  }
};

export const getUserBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const entries = await client.entry.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user entries." });
  }
};

export const uploadUserAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const currentUser = await client.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (currentUser?.avatar) {
      try {
        const urlParts = currentUser.avatar.split("/");
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `notely/avatars/${publicIdWithExt.split(".")[0]}`;
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting old avatar:", deleteError);
      }
    }

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "notely/avatars",
            public_id: `user_${userId}_${Date.now()}`,
            overwrite: true,
            resource_type: "image",
            transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(req.file!.buffer);
    });

    const avatarUrl = result.secure_url;

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
        dateJoined: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile picture updated successfully.",
      user: updatedUser,
    });
  } catch (e) {
    console.error("Avatar upload error:", e);
    res.status(500).json({ message: "Failed to upload profile picture." });
  }
};

export const updateUserAvatarUrl = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const { avatar } = req.body;
    if (!avatar) {
      res.status(400).json({ message: "No avatar URL provided." });
      return;
    }
    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
        dateJoined: true,
        updatedAt: true,
      },
    });
    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: "Failed to update avatar." });
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    await client.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
    res.json({ message: "Account deactivated successfully." });
  } catch (e) {
    res.status(500).json({ message: "Failed to deactivate account." });
  }
};
