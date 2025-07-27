import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";
import OpenAI from "openai";

const client = new PrismaClient();

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export const getUserEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const { pinned } = req.query;
    const entries = await client.entry.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
        ...(pinned !== undefined ? { pinned: pinned === "true" } : {}),
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch entries." });
  }
};

export const getEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
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
    const userId = String(req.user?.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const { title, synopsis, content, isPublic, tags } = req.body;
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
        tags: tags || [],
        authorId: userId,
        isPublic: isPublic === true,
      },
    });
    res.status(201).json(entry);
  } catch (e) {
    res.status(500).json({ message: "Failed to create entry." });
  }
};

export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const { id } = req.params;
    const { title, synopsis, content, isDeleted, isPublic, tags } = req.body;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (content !== undefined) updateData.content = content;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;
    if (isPublic !== undefined) updateData.isPublic = isPublic === true;
    if (tags !== undefined) updateData.tags = tags;
    const updated = await client.entry.update({
      where: { id },
      data: updateData,
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update entry." });
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    await client.entry.update({ where: { id }, data: { isDeleted: true } });
    res.json({ message: "Entry deleted." });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete entry." });
  }
};

export const searchEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Missing search query." });
      return;
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

export const getTrashedEntries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
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
    const userId = String(req.user?.id);
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
    const userId = String(req.user?.id);
    const { id } = req.params;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: true },
    });
    if (!entry)
      return res.status(404).json({ message: "Entry not found in trash." });
    await client.entry.delete({ where: { id } });
    res.json({ message: "Entry permanently deleted." });
  } catch (e) {
    res.status(500).json({ message: "Failed to permanently delete entry." });
  }
};

export const pinEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const { id } = req.params;
    const { pinned } = req.body;
    const entry = await client.entry.findFirst({
      where: { id, authorId: userId, isDeleted: false },
    });
    if (!entry) return res.status(404).json({ message: "Entry not found." });
    const updated = await client.entry.update({
      where: { id },
      data: { pinned: !!pinned },
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to pin/unpin entry." });
  }
};

export const summarizeEntry = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.user?.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const { id } = req.params;
    const { content } = req.body;

    let textToSummarize = content;

    // Verifying the entry exists and belongs to user
    if (id) {
      const entry = await client.entry.findFirst({
        where: { id, authorId: userId, isDeleted: false },
      });

      if (!entry) return res.status(404).json({ message: "Entry not found." });

      textToSummarize = content || entry.content;
    }

    // If no content provided and no entry found we return an error
    if (!textToSummarize)
      return res
        .status(400)
        .json({ message: "Content is required for summarization." });

    if (!textToSummarize || textToSummarize.trim().length < 50)
      return res.status(400).json({
        message:
          "Content is too short to summarize. Please write at least 50 characters.",
      });

    if (!openai)
      return res.status(500).json({
        message:
          "AI summarization is not configured. Please contact the administrator.",
      });

    // Generating summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise, informative summaries of notes. Focus on the main points and key insights. Keep summaries clear and well-structured.",
        },
        {
          role: "user",
          content: `Please summarize the following note content in 2-3 sentences, capturing the main ideas and key points:\n\n${textToSummarize}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary)
      return res.status(500).json({ message: "Failed to generate summary." });

    res.json({
      summary,
      originalLength: textToSummarize.length,
      summaryLength: summary.length,
    });
  } catch (e) {
    console.error("Summarization error:", e);
    res.status(500).json({
      message: "Failed to generate summary. Please try again later.",
    });
  }
};
