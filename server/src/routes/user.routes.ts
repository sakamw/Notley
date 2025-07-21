import { Router } from "express";
import {
  getCurrentUser,
  updateUserInfo,
  getUserBlogs,
  uploadUserAvatar,
  updateUserAvatarUrl,
  deactivateUser,
} from "../controllers/user.controller";
import { authenticateJWT, avatarUpload } from "../middlewares/userMiddleware";

const router = Router();

router.get("/current", authenticateJWT, getCurrentUser);
router.get("/blogs", authenticateJWT, getUserBlogs);
router.patch("/", authenticateJWT, updateUserInfo);
router.patch(
  "/avatar",
  authenticateJWT,
  avatarUpload.single("avatar"),
  uploadUserAvatar,
);
router.patch("/avatar-url", authenticateJWT, updateUserAvatarUrl);
router.patch("/deactivate", authenticateJWT, deactivateUser);

export default router;
