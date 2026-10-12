import mongoose from "mongoose";
import CarDamageCost from "../models/CarDamageCost.js";
import VehicleCheck from "../models/VehicleCheck.js";
import { calculateVerdict } from "../utils/calculations.js";
import { checkCalculateBody, resolveDamagedParts } from "../utils/validators.js";
import { buildResultPayload, pickResultFields } from "../utils/resultPayload.js";

// POST /api/calculate  (guests allowed; logged-in users get the check saved to their history)
export async function calculate(req, res, next) {
  try {
    const problem = checkCalculateBody(req.body);
    if (problem) return res.status(400).json({ error: problem });

    const { carId, selectedParts, currentPremium, currentNCB } = req.body;

    if (!mongoose.isValidObjectId(carId)) return res.status(400).json({ error: "Invalid carId." });
    const car = await CarDamageCost.findById(carId).lean();
    if (!car) return res.status(404).json({ error: "That car isn't in our catalogue." });

    const resolved = resolveDamagedParts(car, selectedParts);
    if (resolved.error) return res.status(400).json({ error: resolved.error });

    let verdict;
    try {
      verdict = calculateVerdict({ currentPremium, currentNCB, localRepairCost: resolved.localRepairCost });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    let saved = null;
    if (req.userId) {
      saved = await VehicleCheck.create({
        user: req.userId,
        car: { carId: car._id, segment: car.segment, brand: car.brand, model: car.model },
        parts: resolved.parts,
        currentPremium,
        currentNCB,
        result: pickResultFields(verdict),
      });
    }

    res.json({
      ...buildResultPayload({
        id: saved ? String(saved._id) : null,
        createdAt: saved ? saved.createdAt : null,
        car,
        parts: resolved.parts,
        currentPremium,
        currentNCB,
        result: verdict,
      }),
      savedToHistory: Boolean(saved),
    });
  } catch (err) {
    next(err);
  }
}
