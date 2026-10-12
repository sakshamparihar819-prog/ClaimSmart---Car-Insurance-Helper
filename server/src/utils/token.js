import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(userId) {
  if (!env.jwtSecret) throw new Error("JWT_SECRET is not set. Add it to server/.env");
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
