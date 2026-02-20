// routes/search.routes.ts
import { Router } from "express";
import { globalSearch } from "../controllers/search.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.get("/", globalSearch);

export default router;
