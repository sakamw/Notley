import { Router } from "express";
import {
  verifyUserInfo,
  checkEmailAndUsernameReuse,
  verifyPassStrength,
} from "../middlewares/authMiddlewares";
import {
  register,
  login,
  logout,
  updateUserPassword,
} from "../controllers/auth.controller";
import { verifyNewPassStrength } from "../middlewares/newPassStrength";
import { authenticateJWT } from "../middlewares/userMiddleware";

const router: Router = Router();

router.post(
  "/register",
  verifyUserInfo,
  checkEmailAndUsernameReuse,
  verifyPassStrength,
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.post(
  "/password",
  authenticateJWT,
  verifyNewPassStrength,
  updateUserPassword
);

export default router;
