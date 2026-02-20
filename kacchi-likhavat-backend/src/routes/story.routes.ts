// routes/story.routes.ts
import { Router } from "express";
import {
    createStory,
    getAllStories,
    getStory,
    updateStory,
    deleteStory,
    createChapter,
    updateChapter,
    deleteChapter,
} from "../controllers/story.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

// Story routes
router.post("/", createStory);
router.get("/", getAllStories);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

// Chapter routes
router.post("/chapters", createChapter);
router.put("/chapters/:id", updateChapter);
router.delete("/chapters/:id", deleteChapter);

export default router;
