import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";

const app = express();

// =====================
// Middleware
// =====================

// Enable CORS for cross-origin requests
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        credentials: true,
    })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// =====================
// Routes
// =====================

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "🎉 Welcome to Kacchi Likhaavat API! The server is running smoothly.",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            rooms: "/api/rooms",
        },
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// =====================
// Error Handling
// =====================

// 404 handler - Route not found
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Oops! The route ${req.method} ${req.originalUrl} doesn't exist 🔍`,
        tip: "Check the API documentation for available endpoints.",
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ Server Error:", err);

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed. Please check your input data 📋",
            error: err.message,
        });
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format. Please provide a valid identifier 🔑",
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: "Something went wrong on our end. We're working on it! 🛠️",
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
});

export default app;
