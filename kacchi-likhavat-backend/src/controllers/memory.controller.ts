// controllers/memory.controller.ts
import { Request, Response } from "express";
import Memory from "../models/memory.model";
import UserProfile from "../models/user-profile.model";

/**
 * @route   POST /api/memories
 * @desc    Create a new memory/journal entry
 * @access  Private
 */
export const createMemory = async (req: Request, res: Response) => {
    try {
        const { roomId, text, title, content, mood, date, tags, mediaUrls } = req.body;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required 🧠",
            });
        }

        // Support both formats: text (old) or title+content (new)
        const memoryText = text || (title && content ? `${title}\n\n${content}` : title || content || "");

        const memory = await Memory.create({
            roomId,
            userId: req.user!.id,
            text: memoryText,
            mood: mood || "neutral",
            date: date || new Date(),
            mediaUrls: mediaUrls || [],
        });

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.memoriesCount": 1 } },
            { upsert: true }
        );

        return res.status(201).json({
            success: true,
            message: "Memory saved successfully 🧠✨",
            data: memory,
        });
    } catch (error) {
        console.error("❌ Create memory error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save memory. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/memories
 * @desc    Get all memories with optional filtering
 * @access  Private
 */
export const getMemories = async (req: Request, res: Response) => {
    try {
        const { from, to, mood } = req.query;

        // Build query
        const query: any = { userId: req.user!.id };

        // Date filtering
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from as string);
            if (to) query.date.$lte = new Date(to as string);
        }

        // Mood filtering
        if (mood) {
            query.mood = mood;
        }

        const memories = await Memory.find(query).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            message: `Found ${memories.length} memor${memories.length === 1 ? "y" : "ies"} 🧠`,
            data: memories,
            count: memories.length,
        });
    } catch (error) {
        console.error("❌ Get memories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch memories. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/memories/:id
 * @desc    Get a single memory
 * @access  Private
 */
export const getMemory = async (req: Request, res: Response) => {
    try {
        const memory = await Memory.findOne({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Memory loaded successfully 🧠",
            data: memory,
        });
    } catch (error) {
        console.error("❌ Get memory error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load memory. Please try again 🛠️",
        });
    }
};

/**
 * @route   PUT /api/memories/:id
 * @desc    Update a memory
 * @access  Private
 */
export const updateMemory = async (req: Request, res: Response) => {
    try {
        const { text, title, content, mood, date, mediaUrls } = req.body;

        // Support both formats
        const memoryText = text || (title && content ? `${title}\n\n${content}` : title || content);

        const memory = await Memory.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { text: memoryText, mood, date, mediaUrls },
            { new: true, runValidators: true }
        );

        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Memory updated successfully ✅",
            data: memory,
        });
    } catch (error) {
        console.error("❌ Update memory error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update memory. Please try again 🛠️",
        });
    }
};

/**
 * @route   DELETE /api/memories/:id
 * @desc    Delete a memory
 * @access  Private
 */
export const deleteMemory = async (req: Request, res: Response) => {
    try {
        const memory = await Memory.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!memory) {
            return res.status(404).json({
                success: false,
                message: "Memory not found 🔍",
            });
        }

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.memoriesCount": -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Memory deleted successfully 🗑️",
            data: { deletedMemory: { id: memory._id } },
        });
    } catch (error) {
        console.error("❌ Delete memory error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete memory. Please try again 🛠️",
        });
    }
};
