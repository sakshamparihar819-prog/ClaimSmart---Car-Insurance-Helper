import CarDamageCost from "../models/CarDamageCost.js";
import { generateCarDocs } from "../data/carData.js";

/** Seeds the catalogue on first run so a fresh database "just works". */
export async function seedCarsIfEmpty() {
  const count = await CarDamageCost.estimatedDocumentCount();
  if (count > 0) return false;
  await CarDamageCost.insertMany(generateCarDocs());
  console.log("[seed] CarDamageCost catalogue created");
  return true;
}

/** Wipes and re-creates the catalogue (used by `npm run seed` after price changes). */
export async function reseedCars() {
  await CarDamageCost.deleteMany({});
  const docs = await CarDamageCost.insertMany(generateCarDocs());
  return docs.length;
}
