// models/chapter.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IChapter extends Document {
    chapterId: string;
    storyId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    content: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
    {
        storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, default: "Untitled Chapter" },
        content: { type: String, default: "" },
        order: { type: Number, required: true },
    },
    { timestamps: true }
);

// Index for faster queries
chapterSchema.index({ storyId: 1, order: 1 });
chapterSchema.index({ userId: 1 });

// Virtual for chapterId
chapterSchema.virtual("chapterId").get(function () {
    return this._id.toString();
});

export default model<IChapter>("Chapter", chapterSchema);
