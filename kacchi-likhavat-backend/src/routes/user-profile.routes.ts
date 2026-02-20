// routes/user-profile.routes.ts
import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user-profile.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

export default router;
