// models/user-profile.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IUserProfile extends Document {
    userId: Types.ObjectId;
    displayName: string;
    bio: string;
    avatarUrl: string;
    preferences: {
        theme: "light" | "dark" | "auto";
        defaultTemplate: string;
        editorSettings: {
            fontSize: number;
            fontFamily: string;
            lineHeight: number;
        };
    };
    stats: {
        createdRooms: number;
        notesCount: number;
        storiesCount: number;
        expensesCount: number;
        memoriesCount: number;
    };
}

const userProfileSchema = new Schema<IUserProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        displayName: { type: String, default: "" },
        bio: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        preferences: {
            theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
            defaultTemplate: { type: String, default: "blank" },
            editorSettings: {
                fontSize: { type: Number, default: 16 },
                fontFamily: { type: String, default: "Inter" },
                lineHeight: { type: Number, default: 1.6 },
            },
        },
        stats: {
            createdRooms: { type: Number, default: 0 },
            notesCount: { type: Number, default: 0 },
            storiesCount: { type: Number, default: 0 },
            expensesCount: { type: Number, default: 0 },
            memoriesCount: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default model<IUserProfile>("UserProfile", userProfileSchema);
