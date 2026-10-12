import mongoose from "mongoose";
import VehicleCheck from "../models/VehicleCheck.js";
import { buildHistorySummary, buildResultPayload } from "../utils/resultPayload.js";

const MAX_ITEMS = 100;

function badId(res) {
  return res.status(400).json({ error: "Invalid history id." });
}

// GET /api/history — the logged-in user's past checks, newest first
export async function listHistory(req, res, next) {
  try {
    const checks = await VehicleCheck.find({ user: req.userId }).sort({ createdAt: -1 }).limit(MAX_ITEMS).lean();
    res.json({ items: checks.map(buildHistorySummary) });
  } catch (err) {
    next(err);
  }
}

// GET /api/history/:id — one saved check, in the same shape as POST /api/calculate
export async function getHistoryItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);

    // Filtering by user too means you can never read someone else's check by guessing an id.
    const check = await VehicleCheck.findOne({ _id: req.params.id, user: req.userId }).lean();
    if (!check) return res.status(404).json({ error: "That check wasn't found." });

    res.json(
      buildResultPayload({
        id: String(check._id),
        createdAt: check.createdAt,
        car: check.car,
        parts: check.parts,
        currentPremium: check.currentPremium,
        currentNCB: check.currentNCB,
        result: check.result,
      })
    );
  } catch (err) {
    next(err);
  }
}

// DELETE /api/history/:id
export async function deleteHistoryItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const deleted = await VehicleCheck.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: "That check wasn't found." });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/history — clear everything for this user
export async function clearHistory(req, res, next) {
  try {
    const { deletedCount } = await VehicleCheck.deleteMany({ user: req.userId });
    res.json({ deleted: deletedCount });
  } catch (err) {
    next(err);
  }
}
