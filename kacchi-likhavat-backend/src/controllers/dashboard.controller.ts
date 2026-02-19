// controllers/dashboard.controller.ts
import { Request, Response } from "express";
import Room from "../models/room.model";
import Note from "../models/note.model";
import Story from "../models/story.model";
import Expense from "../models/expense.model";
import Memory from "../models/memory.model";
import UserProfile from "../models/user-profile.model";

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard data with stats and recent activity
 * @access  Private
 */
export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        // Fetch all data in parallel for better performance
        const [rooms, notes, stories, expenses, memories, profile] = await Promise.all([
            Room.find({ userId }).sort({ updatedAt: -1 }).limit(10),
            Note.find({ userId }).sort({ updatedAt: -1 }).limit(5),
            Story.find({ userId }).sort({ updatedAt: -1 }).limit(5),
            Expense.find({ userId }).sort({ date: -1 }).limit(5),
            Memory.find({ userId }).sort({ date: -1 }).limit(5),
            UserProfile.findOne({ userId }),
        ]);

        // Calculate stats
        const [notesCount, storiesCount, expensesCount, memoriesCount, roomsCount] = await Promise.all([
            Note.countDocuments({ userId }),
            Story.countDocuments({ userId }),
            Expense.countDocuments({ userId }),
            Memory.countDocuments({ userId }),
            Room.countDocuments({ userId }),
        ]);

        // Update profile stats
        if (profile) {
            profile.stats = {
                createdRooms: roomsCount,
                notesCount,
                storiesCount,
                expensesCount,
                memoriesCount,
            };
            await profile.save();
        }

        // Combine recent activity
        const recentActivity = [
            ...notes.map((n) => ({
                _id: n._id,
                type: "note" as const,
                title: n.title,
                date: n.updatedAt
            })),
            ...stories.map((s) => ({
                _id: s._id,
                type: "story" as const,
                title: s.title,
                date: s.updatedAt
            })),
            ...expenses.map((e) => ({
                _id: e._id,
                type: "expense" as const,
                title: e.title,
                date: e.updatedAt
            })),
            ...memories.map((m) => ({
                _id: m._id,
                type: "memory" as const,
                title: m.text.substring(0, 50) + (m.text.length > 50 ? '...' : ''),
                date: m.updatedAt
            })),
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            message: "Dashboard loaded successfully 📊",
            data: {
                rooms,
                recentActivity,
                stats: {
                    notesCount,
                    storiesCount,
                    expensesCount,
                    memoriesCount,
                    roomsCount,
                },
            },
        });
    } catch (error) {
        console.error("❌ Get dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard. Please try again 🛠️",
        });
    }
};
