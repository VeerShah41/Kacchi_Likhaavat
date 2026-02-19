// controllers/note.controller.ts
import { Request, Response } from "express";
import Note from "../models/note.model";
import UserProfile from "../models/user-profile.model";

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
export const createNote = async (req: Request, res: Response) => {
    try {
        const { roomId, title, content, tags } = req.body;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required 📝",
            });
        }

        const note = await Note.create({
            roomId,
            userId: req.user!.id,
            title: title || "Untitled Note",
            content: content || "",
            tags: tags || [],
        });

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.notesCount": 1 } },
            { upsert: true }
        );

        return res.status(201).json({
            success: true,
            message: "Note created successfully ✍️",
            data: note,
        });
    } catch (error) {
        console.error("❌ Create note error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create note. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/rooms/:roomId/notes
 * @desc    Get all notes in a room
 * @access  Private
 */
export const getNotesByRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        const notes = await Note.find({ roomId, userId: req.user!.id })
            .sort({ isPinned: -1, updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: `Found ${notes.length} note${notes.length === 1 ? "" : "s"} 📚`,
            data: notes,
            count: notes.length,
        });
    } catch (error) {
        console.error("❌ Get notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notes. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/notes
 * @desc    Get all notes for user
 * @access  Private
 */
export const getAllNotes = async (req: Request, res: Response) => {
    try {
        const notes = await Note.find({ userId: req.user!.id })
            .sort({ isPinned: -1, updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: `Found ${notes.length} note${notes.length === 1 ? "" : "s"} 📚`,
            data: notes,
            count: notes.length,
        });
    } catch (error) {
        console.error("❌ Get all notes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notes. Please try again 🛠️",
        });
    }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 * @access  Private
 */
export const updateNote = async (req: Request, res: Response) => {
    try {
        const { title, content, tags, isPinned, isArchived } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { title, content, tags, isPinned, isArchived },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully ✅",
            data: note,
        });
    } catch (error) {
        console.error("❌ Update note error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update note. Please try again 🛠️",
        });
    }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Private
 */
export const deleteNote = async (req: Request, res: Response) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found 🔍",
            });
        }

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.notesCount": -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully 🗑️",
            data: { deletedNote: { id: note._id, title: note.title } },
        });
    } catch (error) {
        console.error("❌ Delete note error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete note. Please try again 🛠️",
        });
    }
};
