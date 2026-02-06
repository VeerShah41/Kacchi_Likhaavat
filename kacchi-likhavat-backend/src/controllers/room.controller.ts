// controllers/room.controller.ts
import { Request, Response } from "express";
import Room from "../models/room.model";

/**
 * @route   POST /api/rooms
 * @desc    Create a new writing room
 * @access  Private
 */
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { type, title } = req.body;

    // Validate room type
    const validTypes = ["note", "journal", "story", "free"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid room type. Choose from: ${validTypes.join(", ")} 📝`,
      });
    }

    const room = await Room.create({
      userId: req.user!.id,
      type: type || "free",
      title: title || "",
    });

    return res.status(201).json({
      success: true,
      message: "New writing room created! Start writing your thoughts ✍️",
      data: room,
    });
  } catch (error) {
    console.error("❌ Create room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create room. Please try again 🛠️",
    });
  }
};

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms for logged-in user
 * @access  Private
 */
export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ userId: req.user!.id })
      .sort({ updatedAt: -1 })
      .select("_id title type content createdAt updatedAt");

    return res.status(200).json({
      success: true,
      message: rooms.length > 0
        ? `Found ${rooms.length} writing room${rooms.length === 1 ? "" : "s"} 📚`
        : "No rooms yet. Create your first writing space! 🌟",
      data: rooms,
      count: rooms.length,
    });
  } catch (error) {
    console.error("❌ Get rooms error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your rooms. Please try again 🛠️",
    });
  }
};

/**
 * @route   GET /api/rooms/:id
 * @desc    Get a single room by ID
 * @access  Private
 */
export const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found. It may have been deleted or doesn't belong to you 🔍",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room loaded successfully 📖",
      data: room,
    });
  } catch (error) {
    console.error("❌ Get room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load the room. Please try again 🛠️",
    });
  }
};

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update room content and title
 * @access  Private
 */
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found. Unable to save your changes 📝",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your work has been saved successfully ✅",
      data: room,
    });
  } catch (error) {
    console.error("❌ Update room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save your changes. Please try again 🛠️",
    });
  }
};

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete a room permanently
 * @access  Private
 */
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found. It may have already been deleted 🗑️",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully. All content has been removed 🗑️✨",
      data: {
        deletedRoom: {
          id: room._id,
          title: room.title,
          type: room.type,
        },
      },
    });
  } catch (error) {
    console.error("❌ Delete room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete the room. Please try again 🛠️",
    });
  }
};
