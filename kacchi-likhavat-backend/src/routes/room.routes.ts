// routes/room.routes.ts
import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    deleteRoom
} from "../controllers/room.controller";

const router = Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/rooms
 * @desc    Create a new writing room
 */
router.post("/", createRoom);

/**
 * @route   GET /api/rooms
 * @desc    Get all user's rooms
 */
router.get("/", getRooms);

/**
 * @route   GET /api/rooms/:id
 * @desc    Get specific room by ID
 */
router.get("/:id", getRoom);

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update room content/title
 */
router.put("/:id", updateRoom);

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete a room permanently
 */
router.delete("/:id", deleteRoom);

export default router;
