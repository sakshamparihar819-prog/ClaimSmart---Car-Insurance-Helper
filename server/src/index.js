import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
  console.error("Copy server/.env.example to server/.env and fill them in.");
  process.exit(1);
}

try {
  await connectDB();
  app.listen(env.port, () => console.log(`ClaimSmart API running on http://localhost:${env.port}`));
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}
