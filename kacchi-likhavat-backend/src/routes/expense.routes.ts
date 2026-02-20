// routes/expense.routes.ts
import { Router } from "express";
import {
    createExpense,
    getExpenses,
    getExpenseSummary,
    deleteExpense,
} from "../controllers/expense.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/summary", getExpenseSummary);
router.delete("/:id", deleteExpense);

export default router;
