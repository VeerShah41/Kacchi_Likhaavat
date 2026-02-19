// controllers/search.controller.ts
import { Request, Response } from "express";
import Note from "../models/note.model";
import Story from "../models/story.model";
import Chapter from "../models/chapter.model";
import Expense from "../models/expense.model";
import Memory from "../models/memory.model";

/**
 * @route   GET /api/search
 * @desc    Global search across all content types
 * @access  Private
 */
export const globalSearch = async (req: Request, res: Response) => {
    try {
        const { q, type, tag } = req.query;

        if (!q && !tag) {
            return res.status(400).json({
                success: false,
                message: "Search query or tag is required 🔍",
            });
        }

        const userId = req.user!.id;
        const searchRegex = q ? new RegExp(q as string, "i") : null;

        let results: any = {
            notes: [],
            stories: [],
            chapters: [],
            expenses: [],
            memories: [],
        };

        // Search based on type filter
        const searchTypes = type ? [type as string] : ["notes", "stories", "chapters", "expenses", "memories"];

        // Search Notes
        if (searchTypes.includes("notes")) {
            const noteQuery: any = { userId };
            if (searchRegex) {
                noteQuery.$or = [
                    { title: searchRegex },
                    { content: searchRegex },
                ];
            }
            if (tag) {
                noteQuery.tags = tag;
            }
            results.notes = await Note.find(noteQuery)
                .select("title content tags createdAt updatedAt")
                .limit(20);
        }

        // Search Stories
        if (searchTypes.includes("stories")) {
            const storyQuery: any = { userId };
            if (searchRegex) {
                storyQuery.$or = [
                    { title: searchRegex },
                    { description: searchRegex },
                ];
            }
            results.stories = await Story.find(storyQuery)
                .select("title description createdAt updatedAt")
                .limit(20);
        }

        // Search Chapters
        if (searchTypes.includes("chapters")) {
            const chapterQuery: any = { userId };
            if (searchRegex) {
                chapterQuery.$or = [
                    { title: searchRegex },
                    { content: searchRegex },
                ];
            }
            results.chapters = await Chapter.find(chapterQuery)
                .select("title content storyId order createdAt updatedAt")
                .limit(20);
        }

        // Search Expenses
        if (searchTypes.includes("expenses")) {
            const expenseQuery: any = { userId };
            if (searchRegex) {
                expenseQuery.$or = [
                    { title: searchRegex },
                    { description: searchRegex },
                    { category: searchRegex },
                ];
            }
            results.expenses = await Expense.find(expenseQuery)
                .select("title amount category date")
                .limit(20);
        }

        // Search Memories
        if (searchTypes.includes("memories")) {
            const memoryQuery: any = { userId };
            if (searchRegex) {
                memoryQuery.text = searchRegex;
            }
            results.memories = await Memory.find(memoryQuery)
                .select("text mood date")
                .limit(20);
        }

        // Calculate total results
        const totalResults = Object.values(results).reduce(
            (sum: number, arr: any) => sum + arr.length,
            0
        );

        return res.status(200).json({
            success: true,
            message: `Found ${totalResults} result${totalResults === 1 ? "" : "s"} 🔍`,
            data: results,
            totalResults,
        });
    } catch (error) {
        console.error("❌ Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Search failed. Please try again 🛠️",
        });
    }
};
