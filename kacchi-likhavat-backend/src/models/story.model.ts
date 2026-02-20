// models/story.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IStory extends Document {
    storyId: string;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    description: string;
    coverImage: string;
    createdAt: Date;
    updatedAt: Date;
}

const storySchema = new Schema<IStory>(
    {
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, default: "Untitled Story" },
        description: { type: String, default: "" },
        coverImage: { type: String, default: "" },
    },
    { timestamps: true }
);

// Index for faster queries
storySchema.index({ userId: 1, createdAt: -1 });
storySchema.index({ roomId: 1 });

// Virtual for storyId
storySchema.virtual("storyId").get(function () {
    return this._id.toString();
});

export default model<IStory>("Story", storySchema);
