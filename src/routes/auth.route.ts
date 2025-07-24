import { Router } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logut", logout);

router.get("/check", protectRoute, checkAuth);
export default router;
