// routes/dashboard.routes.ts
import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.get("/", getDashboard);

export default router;
