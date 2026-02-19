// controllers/story.controller.ts
import { Request, Response } from "express";
import Story from "../models/story.model";
import Chapter from "../models/chapter.model";
import UserProfile from "../models/user-profile.model";

/**
 * @route   POST /api/stories
 * @desc    Create a new story
 * @access  Private
 */
export const createStory = async (req: Request, res: Response) => {
    try {
        const { roomId, title, description, coverImage } = req.body;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required 📖",
            });
        }

        const story = await Story.create({
            roomId,
            userId: req.user!.id,
            title: title || "Untitled Story",
            description: description || "",
            coverImage: coverImage || "",
        });

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.storiesCount": 1 } },
            { upsert: true }
        );

        return res.status(201).json({
            success: true,
            message: "Story created successfully ✨",
            data: story,
        });
    } catch (error) {
        console.error("❌ Create story error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create story. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/stories
 * @desc    Get all stories for user
 * @access  Private
 */
export const getAllStories = async (req: Request, res: Response) => {
    try {
        const stories = await Story.find({ userId: req.user!.id })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: `Found ${stories.length} stor${stories.length === 1 ? "y" : "ies"} 📚`,
            data: stories,
            count: stories.length,
        });
    } catch (error) {
        console.error("❌ Get stories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch stories. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/stories/:id
 * @desc    Get a single story with all chapters
 * @access  Private
 */
export const getStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found 🔍",
            });
        }

        // Get all chapters for this story
        const chapters = await Chapter.find({ storyId: story._id })
            .sort({ order: 1 });

        return res.status(200).json({
            success: true,
            message: "Story loaded successfully 📖",
            data: {
                ...story.toObject(),
                chapters,
            },
        });
    } catch (error) {
        console.error("❌ Get story error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load story. Please try again 🛠️",
        });
    }
};

/**
 * @route   PUT /api/stories/:id
 * @desc    Update a story
 * @access  Private
 */
export const updateStory = async (req: Request, res: Response) => {
    try {
        const { title, description, coverImage } = req.body;

        const story = await Story.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { title, description, coverImage },
            { new: true, runValidators: true }
        );

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Story updated successfully ✅",
            data: story,
        });
    } catch (error) {
        console.error("❌ Update story error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update story. Please try again 🛠️",
        });
    }
};

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a story and all its chapters
 * @access  Private
 */
export const deleteStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found 🔍",
            });
        }

        // Delete all chapters of this story
        await Chapter.deleteMany({ storyId: story._id });

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.storiesCount": -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Story and all chapters deleted successfully 🗑️",
            data: { deletedStory: { id: story._id, title: story.title } },
        });
    } catch (error) {
        console.error("❌ Delete story error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete story. Please try again 🛠️",
        });
    }
};

/**
 * @route   POST /api/chapters
 * @desc    Create a new chapter
 * @access  Private
 */
export const createChapter = async (req: Request, res: Response) => {
    try {
        const { storyId, title, content, order } = req.body;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "Story ID is required 📖",
            });
        }

        // Verify story belongs to user
        const story = await Story.findOne({ _id: storyId, userId: req.user!.id });
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found 🔍",
            });
        }

        // Get next order number if not provided
        let chapterOrder = order;
        if (!chapterOrder) {
            const lastChapter = await Chapter.findOne({ storyId })
                .sort({ order: -1 });
            chapterOrder = lastChapter ? lastChapter.order + 1 : 1;
        }

        const chapter = await Chapter.create({
            storyId,
            userId: req.user!.id,
            title: title || "Untitled Chapter",
            content: content || "",
            order: chapterOrder,
        });

        return res.status(201).json({
            success: true,
            message: "Chapter created successfully ✨",
            data: chapter,
        });
    } catch (error) {
        console.error("❌ Create chapter error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create chapter. Please try again 🛠️",
        });
    }
};

/**
 * @route   PUT /api/chapters/:id
 * @desc    Update a chapter
 * @access  Private
 */
export const updateChapter = async (req: Request, res: Response) => {
    try {
        const { title, content, order } = req.body;

        const chapter = await Chapter.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { title, content, order },
            { new: true, runValidators: true }
        );

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chapter updated successfully ✅",
            data: chapter,
        });
    } catch (error) {
        console.error("❌ Update chapter error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update chapter. Please try again 🛠️",
        });
    }
};

/**
 * @route   DELETE /api/chapters/:id
 * @desc    Delete a chapter
 * @access  Private
 */
export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const chapter = await Chapter.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found 🔍",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chapter deleted successfully 🗑️",
            data: { deletedChapter: { id: chapter._id, title: chapter.title } },
        });
    } catch (error) {
        console.error("❌ Delete chapter error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete chapter. Please try again 🛠️",
        });
    }
};
