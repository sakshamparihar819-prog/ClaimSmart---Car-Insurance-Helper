import { NCB_SLABS } from "./calculations.js";

// Pure validation helpers — no Express/Mongoose imports, so they're easy to test.
// "check*" functions return an error string, or null when the input is fine.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  premiumMin: 500,
  premiumMax: 500000,
  partCostMax: 1000000,
};

export function checkRegister(body) {
  const { name, email, password } = body || {};
  if (typeof name !== "string" || !name.trim()) return "Name is required.";
  if (name.trim().length > 60) return "Name must be 60 characters or fewer.";
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  if (typeof password !== "string" || password.length < 6) return "Password must be at least 6 characters.";
  if (password.length > 72) return "Password must be 72 characters or fewer.";
  return null;
}

export function checkLogin(body) {
  const { email, password } = body || {};
  if (typeof email !== "string" || !email.trim()) return "Email is required.";
  if (typeof password !== "string" || !password) return "Password is required.";
  return null;
}

/** Shape-check the POST /api/calculate body (before touching the database). */
export function checkCalculateBody(body) {
  const { carId, selectedParts, currentPremium, currentNCB } = body || {};
  if (typeof carId !== "string" || !carId) return "carId is required.";
  if (!Array.isArray(selectedParts) || selectedParts.length === 0) {
    return "Select at least one damaged part.";
  }
  if (typeof currentPremium !== "number" || !Number.isFinite(currentPremium)) {
    return "currentPremium must be a number.";
  }
  if (currentPremium < LIMITS.premiumMin || currentPremium > LIMITS.premiumMax) {
    return `currentPremium must be between ${LIMITS.premiumMin} and ${LIMITS.premiumMax}.`;
  }
  if (!NCB_SLABS.includes(currentNCB)) return `currentNCB must be one of: ${NCB_SLABS.join(", ")}.`;
  return null;
}

/**
 * Check the user's damaged-part list against the car's catalogue.
 * Prices are user-editable, so we trust the cost they send — but every part
 * name must exist for that car, with no duplicates and a sane cost.
 *
 * @returns {{ error: string } | { parts: {partName:string, estimatedCost:number}[], localRepairCost: number }}
 */
export function resolveDamagedParts(car, selectedParts) {
  const validNames = new Set(car.parts.map((p) => p.partName));
  const seen = new Set();
  const parts = [];

  for (const entry of selectedParts) {
    const partName = entry?.partName;
    const estimatedCost = entry?.estimatedCost;

    if (typeof partName !== "string" || !validNames.has(partName)) {
      return { error: `Unknown damaged part: ${String(partName)}` };
    }
    if (seen.has(partName)) return { error: `"${partName}" was selected twice.` };
    if (typeof estimatedCost !== "number" || !Number.isFinite(estimatedCost) || estimatedCost < 0) {
      return { error: `Enter a valid cost for "${partName}".` };
    }
    if (estimatedCost > LIMITS.partCostMax) {
      return { error: `Cost for "${partName}" looks too high (max ${LIMITS.partCostMax}).` };
    }
    seen.add(partName);
    parts.push({ partName, estimatedCost: Math.round(estimatedCost) });
  }

  const localRepairCost = parts.reduce((sum, p) => sum + p.estimatedCost, 0);
  return { parts, localRepairCost };
}
