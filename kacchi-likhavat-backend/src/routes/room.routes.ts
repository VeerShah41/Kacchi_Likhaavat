// routes/room.routes.ts
import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { createRoom, getRooms, updateRoom } from "../controllers/room.controller";

const router = Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);
router.put("/:id", protect, updateRoom);

export default router;
