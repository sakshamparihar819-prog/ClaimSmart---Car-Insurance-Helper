import CarDamageCost from "../models/CarDamageCost.js";
import { COMPULSORY_DEDUCTIBLE, NCB_SLABS } from "../utils/calculations.js";

// GET /api/cars — the whole catalogue (22 cars x 13 parts, a few KB) plus the policy constants the form needs.
export async function listCars(req, res, next) {
  try {
    const cars = await CarDamageCost.find({}).sort({ segment: 1, brand: 1, model: 1 }).lean();
    res.json({ cars, ncbSlabs: NCB_SLABS, deductible: COMPULSORY_DEDUCTIBLE });
  } catch (err) {
    next(err);
  }
}
