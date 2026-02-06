import mongoose from "mongoose";
import { ENV } from "./env";

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    console.error("Please check your MONGO_URI in .env file");
    throw error; // Re-throw to be handled by server
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
