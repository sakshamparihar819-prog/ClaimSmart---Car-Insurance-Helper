import mongoose from "mongoose";
import { env } from "../config/env.js";
import { reseedCars } from "./seedCars.js";

if (!env.mongoUri) {
  console.error("MONGO_URI is not set. Copy server/.env.example to server/.env first.");
  process.exit(1);
}

try {
  await mongoose.connect(env.mongoUri);
  const count = await reseedCars();
  console.log(`Seeded ${count} cars into CarDamageCost.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
