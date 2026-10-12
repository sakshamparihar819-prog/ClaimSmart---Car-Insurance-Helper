import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import calculateRoutes from "./routes/calculateRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = curl/Postman/server-to-server — allow. Browsers must be on the allow-list.
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      // In development, accept any localhost port (Vite moves to 5174+ when 5173 is busy).
      if (!env.isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => res.json({ name: "ClaimSmart API", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Connect (or reuse the cached connection) before any route that touches the database.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
