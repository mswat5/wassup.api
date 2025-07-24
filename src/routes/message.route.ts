import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { getUsersForSidebar } from "../controllers/message.controller";

const router = Router();

router.get("/users", protectRoute, getUsersForSidebar);

export default router;
