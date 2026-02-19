// controllers/expense.controller.ts
import { Request, Response } from "express";
import Expense from "../models/expense.model";
import UserProfile from "../models/user-profile.model";

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Private
 */
export const createExpense = async (req: Request, res: Response) => {
    try {
        const { roomId, title, amount, category, date, description } = req.body;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required 💰",
            });
        }

        if (!title || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title and amount are required 💰",
            });
        }

        const expense = await Expense.create({
            roomId,
            userId: req.user!.id,
            title,
            amount,
            category: category || "Other",
            date: date || new Date(),
            description: description || "",
        });

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.expensesCount": 1 } },
            { upsert: true }
        );

        return res.status(201).json({
            success: true,
            message: "Expense added successfully 💰",
            data: expense,
        });
    } catch (error) {
        console.error("❌ Create expense error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add expense. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional date filtering
 * @access  Private
 */
export const getExpenses = async (req: Request, res: Response) => {
    try {
        const { from, to, category } = req.query;

        // Build query
        const query: any = { userId: req.user!.id };

        // Date filtering
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from as string);
            if (to) query.date.$lte = new Date(to as string);
        }

        // Category filtering
        if (category) {
            query.category = category;
        }

        const expenses = await Expense.find(query).sort({ date: -1 });

        // Calculate total
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return res.status(200).json({
            success: true,
            message: `Found ${expenses.length} expense${expenses.length === 1 ? "" : "s"} 💰`,
            data: expenses,
            count: expenses.length,
            total,
        });
    } catch (error) {
        console.error("❌ Get expenses error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch expenses. Please try again 🛠️",
        });
    }
};

/**
 * @route   GET /api/expenses/summary
 * @desc    Get monthly expense summary
 * @access  Private
 */
export const getExpenseSummary = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month as string) : currentDate.getMonth();
        const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0);

        const expenses = await Expense.find({
            userId: req.user!.id,
            date: { $gte: startDate, $lte: endDate },
        });

        // Group by category
        const categoryTotals: { [key: string]: number } = {};
        let total = 0;

        expenses.forEach((exp) => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
            total += exp.amount;
        });

        return res.status(200).json({
            success: true,
            message: "Monthly summary generated 📊",
            data: {
                month: targetMonth,
                year: targetYear,
                total,
                categoryTotals,
                expenseCount: expenses.length,
            },
        });
    } catch (error) {
        console.error("❌ Get expense summary error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate summary. Please try again 🛠️",
        });
    }
};

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Private
 */
export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.id,
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found 🔍",
            });
        }

        // Update user stats
        await UserProfile.findOneAndUpdate(
            { userId: req.user!.id },
            { $inc: { "stats.expensesCount": -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully 🗑️",
            data: { deletedExpense: { id: expense._id, title: expense.title } },
        });
    } catch (error) {
        console.error("❌ Delete expense error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete expense. Please try again 🛠️",
        });
    }
};
