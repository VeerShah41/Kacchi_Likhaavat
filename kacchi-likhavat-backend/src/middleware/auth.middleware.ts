// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

/**
 * Protect middleware - Verify JWT token
 * Ensures user is authenticated before accessing protected routes
 */
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Access denied! Please log in to continue 🔒",
      });
      return;
    }

    // 2️⃣ Extract token (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please log in again 🔑",
      });
      return;
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };

    // 4️⃣ Attach user info to request
    req.user = { id: decoded.id as any };

    // 5️⃣ Proceed to next middleware/controller
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please log in again 🚫",
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again ⏰",
      });
      return;
    }

    // Generic error
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please try logging in again 🔐",
    });
  }
};
