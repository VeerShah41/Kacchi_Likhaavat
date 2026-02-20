// routes/note.routes.ts
import { Router } from "express";
import {
    createNote,
    getNotesByRoom,
    getAllNotes,
    updateNote,
    deleteNote,
} from "../controllers/note.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", createNote);
router.get("/", getAllNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
