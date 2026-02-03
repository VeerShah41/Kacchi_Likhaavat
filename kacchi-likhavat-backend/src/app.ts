import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

/* ---------- Global Middlewares ---------- */

// Parse incoming JSON
app.use(express.json());

// Enable CORS
app.use(cors());

/* ---------- Health Check ---------- */

app.get("/", (_req, res) => {
  res.send("Likhavaat API is running 🚀");
});
app.use("/api/auth", authRoutes);


export default app;
