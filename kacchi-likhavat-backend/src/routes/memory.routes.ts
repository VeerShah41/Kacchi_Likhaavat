// routes/memory.routes.ts
import { Router } from "express";
import {
    createMemory,
    getMemories,
    getMemory,
    updateMemory,
    deleteMemory,
} from "../controllers/memory.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", createMemory);
router.get("/", getMemories);
router.get("/:id", getMemory);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);

export default router;
