// models/room.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type RoomType = "note" | "journal" | "story" | "free";

export interface IRoom extends Document {
  userId: Types.ObjectId;
  title: string;
  type: RoomType;
  content: string;
}

const roomSchema = new Schema<IRoom>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "" },
    type: {
      type: String,
      enum: ["note", "journal", "story", "free"],
      default: "free",
    },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model<IRoom>("Room", roomSchema);
