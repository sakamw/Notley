import { Router } from "express";
import {
  getUserEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  getCategories,
  createCategory,
  getPublicEntries,
  getPublicEntryById,
  getTrashedEntries,
  restoreEntry,
  permanentlyDeleteEntry,
  getUserActivityLogs,
  getEntryActivityLogs,
} from "../controllers/entry.controller";
import { authenticateJWT } from "../middlewares/userMiddleware";

const router = Router();

router.get("/", authenticateJWT, getUserEntries);
router.get("/search", authenticateJWT, searchEntries);
router.get("/categories", authenticateJWT, getCategories);
router.post("/categories", authenticateJWT, createCategory);
router.get("/public", getPublicEntries);
router.get("/public/:id", getPublicEntryById);
router.get("/trash", authenticateJWT, getTrashedEntries);
router.patch("/trash/:id/restore", authenticateJWT, restoreEntry);
router.delete("/trash/:id", authenticateJWT, permanentlyDeleteEntry);
router.get("/activity", authenticateJWT, getUserActivityLogs);
router.get("/activity/entry/:entryId", authenticateJWT, getEntryActivityLogs);
router.get("/:id", authenticateJWT, getEntryById);
router.post("/", authenticateJWT, createEntry);
router.put("/:id", authenticateJWT, updateEntry);
router.delete("/:id", authenticateJWT, deleteEntry);

export default router;
