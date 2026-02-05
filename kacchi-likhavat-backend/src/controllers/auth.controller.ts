import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      email,
      passwordHash,
    });

    // 5️⃣ Response
    return res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
