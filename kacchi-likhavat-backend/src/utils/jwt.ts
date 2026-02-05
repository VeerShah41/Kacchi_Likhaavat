// utils/jwt.ts
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const signToken = (id: string) =>
  jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "7d" });
