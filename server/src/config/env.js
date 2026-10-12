import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === "production",
};
