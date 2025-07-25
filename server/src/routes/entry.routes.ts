import { Router } from "express";
import {
  getUserEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  getTrashedEntries,
  getPublicEntries,
  restoreEntry,
  permanentlyDeleteEntry,
  pinEntry,
} from "../controllers/entry.controller";
import { authenticateJWT } from "../middlewares/userMiddleware";

const router = Router();

router.get("/public", getPublicEntries);
router.get("/", authenticateJWT, getUserEntries);
router.get("/search", authenticateJWT, searchEntries);
router.get("/trash", authenticateJWT, getTrashedEntries);
router.patch("/trash/:id/restore", authenticateJWT, restoreEntry);
router.delete("/trash/:id", authenticateJWT, permanentlyDeleteEntry);
router.get("/:id", authenticateJWT, getEntryById);
router.post("/", authenticateJWT, createEntry);
router.put("/:id", authenticateJWT, updateEntry);
router.delete("/:id", authenticateJWT, deleteEntry);
router.patch("/:id/pin", authenticateJWT, pinEntry);

export default router;
