// controllers/user-profile.controller.ts
import { Request, Response } from "express";
import UserProfile from "../models/user-profile.model";

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile
 * @access  Private
 */
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Only allow users to view their own profile
        if (userId !== req.user!.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own profile 🔒",
            });
        }

        let profile = await UserProfile.findOne({ userId });

        // Create profile if it doesn't exist
        if (!profile) {
            profile = await UserProfile.create({ userId });
        }

        return res.status(200).json({
            success: true,
            message: "Profile loaded successfully 👤",
            data: profile,
        });
    } catch (error) {
        console.error("❌ Get user profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load profile. Please try again 🛠️",
        });
    }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private
 */
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Only allow users to update their own profile
        if (userId !== req.user!.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile 🔒",
            });
        }

        const { displayName, bio, avatarUrl, preferences } = req.body;

        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            {
                displayName,
                bio,
                avatarUrl,
                preferences,
            },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully ✅",
            data: profile,
        });
    } catch (error) {
        console.error("❌ Update user profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile. Please try again 🛠️",
        });
    }
};
