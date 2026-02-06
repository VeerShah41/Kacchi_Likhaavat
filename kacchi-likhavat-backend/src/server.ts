import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

/**
 * Start the server
 * 1. Connect to MongoDB
 * 2. Start Express server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected successfully!");

    // Start listening on specified port
    app.listen(ENV.PORT, () => {
      console.log("\n🚀 =======================================");
      console.log(`   Kacchi Likhaavat Server is LIVE!`);
      console.log(`   Port: ${ENV.PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   API: http://localhost:${ENV.PORT}/api`);
      console.log("   =======================================\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error("Please check your configuration and try again.");
    process.exit(1); // Exit with failure code
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  console.log("Server is shutting down due to unhandled rejection...");
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  console.log("Server is shutting down due to uncaught exception...");
  process.exit(1);
});

// Start the server
startServer();
