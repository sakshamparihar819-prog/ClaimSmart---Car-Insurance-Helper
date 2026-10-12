import { RECOMMENDATION } from "./calculations.js";
import { getDiySuggestions } from "../data/diyProducts.js";

// The verdict fields we persist with every history entry.
export const RESULT_FIELDS = [
  "basePremium",
  "nextNCB",
  "premiumIfClaim",
  "premiumIfNoClaim",
  "premiumLoss",
  "deductible",
  "localRepairCost",
  "totalCostIfClaim",
  "totalCostIfNotClaim",
  "netSavings",
  "recommendation",
];

export function pickResultFields(verdict) {
  const out = {};
  for (const key of RESULT_FIELDS) out[key] = verdict[key];
  return out;
}

/**
 * One response shape used by both POST /api/calculate and GET /api/history/:id,
 * so the React results components render either without caring where it came from.
 */
export function buildResultPayload({ id = null, createdAt = null, car, parts, currentPremium, currentNCB, result }) {
  return {
    id,
    createdAt,
    car: { segment: car.segment, brand: car.brand, model: car.model },
    damageBreakdown: parts.map((p) => ({ partName: p.partName, estimatedCost: p.estimatedCost })),
    currentPremium,
    currentNCB,
    ...pickResultFields(result),
    diySuggestions:
      result.recommendation === RECOMMENDATION.PAY_OUT_OF_POCKET
        ? getDiySuggestions(parts.map((p) => p.partName))
        : [],
  };
}

/** Lightweight shape for the history list (no DIY data, no per-part breakdown). */
export function buildHistorySummary(check) {
  return {
    id: String(check._id),
    createdAt: check.createdAt,
    car: { segment: check.car.segment, brand: check.car.brand, model: check.car.model },
    partNames: check.parts.map((p) => p.partName),
    currentPremium: check.currentPremium,
    currentNCB: check.currentNCB,
    localRepairCost: check.result.localRepairCost,
    netSavings: check.result.netSavings,
    recommendation: check.result.recommendation,
  };
}
