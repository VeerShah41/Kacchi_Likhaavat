// models/memory.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type MoodType = "happy" | "sad" | "excited" | "anxious" | "calm" | "angry" | "neutral";

export interface IMemory extends Document {
    memoryId: string;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    text: string;
    mood: MoodType;
    date: Date;
    mediaUrls: string[];
    createdAt: Date;
    updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
    {
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, default: "" },
        mood: {
            type: String,
            enum: ["happy", "sad", "excited", "anxious", "calm", "angry", "neutral"],
            default: "neutral"
        },
        date: { type: Date, default: Date.now },
        mediaUrls: { type: [String], default: [] },
    },
    { timestamps: true }
);

// Index for faster queries
memorySchema.index({ userId: 1, date: -1 });
memorySchema.index({ roomId: 1 });
memorySchema.index({ mood: 1 });

// Virtual for memoryId
memorySchema.virtual("memoryId").get(function () {
    return this._id.toString();
});

export default model<IMemory>("Memory", memorySchema);
