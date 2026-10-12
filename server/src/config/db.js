import mongoose from "mongoose";
import { env } from "./env.js";
import { seedCarsIfEmpty } from "../seed/seedCars.js";

// Cache the connection on `global` so serverless cold starts / hot reloads
// reuse one connection instead of opening a new one per request.
const cache = (globalThis.__claimsmartMongo ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not set. Add it to server/.env");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.mongoUri).then(async (m) => {
      await seedCarsIfEmpty();
      return m;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // let the next request retry
    throw err;
  }
  return cache.conn;
}
