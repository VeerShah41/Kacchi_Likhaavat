import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user account
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login with existing credentials
 */
router.post("/login", loginUser);

export default router;
