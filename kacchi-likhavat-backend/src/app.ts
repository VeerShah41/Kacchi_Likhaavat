import express from "express";
import roomRoutes from "./routes/room.routes";

const app = express();
app.use(express.json());

app.use("/api/rooms", roomRoutes);

export default app;
