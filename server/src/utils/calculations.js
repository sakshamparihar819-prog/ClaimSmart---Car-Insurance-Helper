/**
 * ClaimSmart — core decision engine.
 *
 * Framework-agnostic on purpose (no Express / Mongoose imports) so it can be
 * tested in isolation: `npm run verify`.
 *
 * Rules follow standard Indian private-car motor insurance (IRDAI) conventions:
 *  - No-Claim Bonus (NCB) is a discount on the Own Damage (OD) premium that
 *    grows each claim-free year, across fixed slabs.
 *  - Filing a claim resets NCB to 0% from the next renewal.
 *  - Not filing lets NCB step up to the next slab (capped at 50%).
 */

export const NCB_SLABS = [0, 20, 25, 35, 45, 50];

// Standard compulsory deductible for private cars, payable on every OD claim.
export const COMPULSORY_DEDUCTIBLE = 1000;

export const RECOMMENDATION = {
  PAY_OUT_OF_POCKET: "PAY_OUT_OF_POCKET",
  CLAIM_INSURANCE: "CLAIM_INSURANCE",
};

/** Next year's NCB slab if the owner does NOT claim (one step up, capped at the top). */
export function getNextNCBSlab(currentNCB) {
  const idx = NCB_SLABS.indexOf(currentNCB);
  const safeIdx = idx === -1 ? 0 : idx;
  return NCB_SLABS[Math.min(safeIdx + 1, NCB_SLABS.length - 1)];
}

/** Base Premium = Current Premium / (1 - CurrentNCB / 100) */
export function getBasePremium(currentPremium, currentNCB) {
  return currentPremium / (1 - currentNCB / 100);
}

const toRupee = (value) => Math.round(value);

/**
 * @param {Object} input
 * @param {number} input.currentPremium  Current annual premium in INR
 * @param {number} input.currentNCB      Current NCB slab (one of NCB_SLABS)
 * @param {number} input.localRepairCost Sum of the repair cost for all damaged parts, in INR
 * @param {number} [input.deductible]    Override for the compulsory deductible
 */
export function calculateVerdict({
  currentPremium,
  currentNCB,
  localRepairCost,
  deductible = COMPULSORY_DEDUCTIBLE,
}) {
  if (!(currentPremium > 0)) throw new Error("currentPremium must be a positive number");
  if (!NCB_SLABS.includes(currentNCB)) throw new Error(`currentNCB must be one of: ${NCB_SLABS.join(", ")}`);
  if (!(localRepairCost >= 0)) throw new Error("localRepairCost must be zero or a positive number");

  const basePremium = getBasePremium(currentPremium, currentNCB);
  const nextNCB = getNextNCBSlab(currentNCB);

  // Next year's premium if you claim (NCB resets to 0%) vs. if you don't (NCB steps up).
  const premiumIfClaim = basePremium * (1 - 0 / 100);
  const premiumIfNoClaim = basePremium * (1 - nextNCB / 100);

  // Premium Loss = Premium With Claim (0% NCB) - Premium Without Claim (Next NCB Slab)
  const premiumLoss = premiumIfClaim - premiumIfNoClaim;

  // Real-world cost of each path:
  //  - Don't claim: you pay the whole repair bill.
  //  - Claim: you pay the deductible now AND the higher premium next year.
  const totalCostIfNotClaim = localRepairCost;
  const totalCostIfClaim = deductible + premiumLoss;

  const netSavings = Math.abs(totalCostIfNotClaim - totalCostIfClaim);

  // Ties favour NOT claiming — no compounding risk to future NCB.
  const recommendation =
    totalCostIfNotClaim <= totalCostIfClaim
      ? RECOMMENDATION.PAY_OUT_OF_POCKET
      : RECOMMENDATION.CLAIM_INSURANCE;

  return {
    basePremium: toRupee(basePremium),
    nextNCB,
    premiumIfClaim: toRupee(premiumIfClaim),
    premiumIfNoClaim: toRupee(premiumIfNoClaim),
    premiumLoss: toRupee(premiumLoss),
    deductible: toRupee(deductible),
    localRepairCost: toRupee(localRepairCost),
    totalCostIfClaim: toRupee(totalCostIfClaim),
    totalCostIfNotClaim: toRupee(totalCostIfNotClaim),
    netSavings: toRupee(netSavings),
    recommendation,
  };
}
