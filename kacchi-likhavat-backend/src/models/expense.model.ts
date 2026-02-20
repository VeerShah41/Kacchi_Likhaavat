// models/expense.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IExpense extends Document {
    expenseId: string;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    amount: number;
    category: string;
    date: Date;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            default: "Other",
            enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"]
        },
        date: { type: Date, default: Date.now },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ roomId: 1 });
expenseSchema.index({ category: 1 });

// Virtual for expenseId
expenseSchema.virtual("expenseId").get(function () {
    return this._id.toString();
});

export default model<IExpense>("Expense", expenseSchema);
