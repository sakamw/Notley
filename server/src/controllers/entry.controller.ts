import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";

const client = new PrismaClient();

// Helper to log activity
async function logActivity({
  userId,
  entryId,
  action,
  details,
}: {
  userId: string;
  entryId?: string;
  action: string;
  details?: string;
}) {
  await client.activityLog.create({
    data: {
      userId,
      entryId: entryId || undefined,
      action,
      details: details || undefined,
    },
  });
}

export const getUserEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const entries = await client.entry.findMany({
      where: { authorId: userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch entries." });
  }
};

export const getEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    res.json(entry);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch entry." });
  }
};

export const createEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const { title, synopsis, content, categoryId, isPublic } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }
    const entry = await client.entry.create({
      data: {
        title,
        synopsis: synopsis || "",
        content,
        authorId: userId,
        categoryId: categoryId || null,
        isPublic: isPublic === true,
      },
    });
    await logActivity({
      userId: userId as string,
      entryId: entry.id,
      action: "create",
    });
    res.status(201).json(entry);
  } catch (e) {
    res.status(500).json({ message: "Failed to create entry." });
  }
};

export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, synopsis, content, isDeleted, categoryId, isPublic } =
      req.body;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (content !== undefined) updateData.content = content;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isPublic !== undefined) updateData.isPublic = isPublic === true;
    const updated = await client.entry.update({
      where: { id },
      data: updateData,
    });
    await logActivity({
      userId: userId as string,
      entryId: id,
      action: "update",
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update entry." });
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    await client.entry.update({ where: { id }, data: { isDeleted: true } });
    await logActivity({
      userId: userId as string,
      entryId: id,
      action: "delete",
    });
    res.json({ message: "Entry deleted." });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete entry." });
  }
};

export const searchEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Missing search query." });
    }
    const entries = await client.entry.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { synopsis: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to search entries." });
  }
};

export const getCategories = async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await client.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required." });
    const category = await client.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(400).json({ message: "Category name must be unique." });
    }
    res.status(500).json({ message: "Failed to create category." });
  }
};

export const getPublicEntries = async (_req: any, res: Response) => {
  try {
    const entries = await client.entry.findMany({
      where: { isPublic: true, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch public entries." });
  }
};

export const getPublicEntryById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, isPublic: true, isDeleted: false },
    });
    if (!entry)
      return res
        .status(404)
        .json({ message: "Entry not found or not public." });
    res.json(entry);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch public entry." });
  }
};

export const getTrashedEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const entries = await client.entry.findMany({
      where: { authorId: userId, isDeleted: true },
      orderBy: { updatedAt: "desc" },
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch trashed entries." });
  }
};

export const restoreEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: true },
    });
    if (!entry)
      return res.status(404).json({ message: "Entry not found in trash." });
    const restored = await client.entry.update({
      where: { id },
      data: { isDeleted: false },
    });
    await logActivity({
      userId: userId as string,
      entryId: id,
      action: "restore",
    });
    res.json(restored);
  } catch (e) {
    res.status(500).json({ message: "Failed to restore entry." });
  }
};

export const permanentlyDeleteEntry = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: true },
    });
    if (!entry)
      return res.status(404).json({ message: "Entry not found in trash." });
    await client.entry.delete({ where: { id } });
    await logActivity({
      userId: userId as string,
      entryId: id,
      action: "permanent_delete",
    });
    res.json({ message: "Entry permanently deleted." });
  } catch (e) {
    res.status(500).json({ message: "Failed to permanently delete entry." });
  }
};

export const getUserActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const logs = await client.activityLog.findMany({
      where: { userId: userId as string },
      orderBy: { createdAt: "desc" },
      include: { entry: true },
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch activity logs." });
  }
};

export const getEntryActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { entryId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    if (!entryId) return res.status(400).json({ message: "Missing entryId." });
    const logs = await client.activityLog.findMany({
      where: { userId: userId as string, entryId },
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch entry activity logs." });
  }
};
