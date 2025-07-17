import { Router } from "express";
import {
  verifyUserInfo,
  checkEmailAndUsernameReuse,
  verifyPassStrength,
} from "../middlewares/authMiddlewares";
import { register, login, logout } from "../controllers/auth.controller";

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

export default router;
