import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);

router.post("/login", (req, res) => {
  res.json({ message: "Login route working ✅" });
});

export default router;
