import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation - Check if required fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password to create your account 📧",
      });
    }

    // 2️⃣ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address 📬",
      });
    }

    // 3️⃣ Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters long for better security 🔒",
      });
    }

    // 4️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Try logging in instead! 👋",
      });
    }

    // 5️⃣ Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 6️⃣ Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    // 7️⃣ Generate authentication token
    const token = signToken(user._id.toString());

    // 8️⃣ Send success response
    return res.status(201).json({
      success: true,
      message: "Welcome aboard! Your account has been created successfully 🎉",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong on our end. Please try again later 🛠️",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation - Check if credentials are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password to continue 🔑",
      });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "We couldn't find an account with that email. Double-check or create a new account! 🔍",
      });
    }

    // 3️⃣ Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again or reset your password 🚫",
      });
    }

    // 4️⃣ Generate authentication token
    const token = signToken(user._id.toString());

    // 5️⃣ Send success response
    return res.status(200).json({
      success: true,
      message: "Welcome back! You're now logged in 👋✨",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong during login. Please try again 🛠️",
    });
  }
};
