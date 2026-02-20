// models/note.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
    noteId: string;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, default: "Untitled Note" },
        content: { type: String, default: "" },
        tags: { type: [String], default: [] },
        isPinned: { type: Boolean, default: false },
        isArchived: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for faster queries
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ roomId: 1 });
noteSchema.index({ tags: 1 });

// Virtual for noteId
noteSchema.virtual("noteId").get(function () {
    return this._id.toString();
});

export default model<INote>("Note", noteSchema);
