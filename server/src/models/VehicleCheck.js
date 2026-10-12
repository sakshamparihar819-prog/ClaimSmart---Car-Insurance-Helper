import mongoose from "mongoose";

/**
 * One saved "should I claim?" check. Stores the exact inputs the user gave
 * (including any prices they edited) plus a snapshot of the verdict, so the
 * history stays accurate even if the catalogue prices change later.
 */
const vehicleCheckSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: {
      carId: { type: mongoose.Schema.Types.ObjectId, ref: "CarDamageCost" },
      segment: { type: String, required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
    },
    parts: [
      {
        _id: false,
        partName: { type: String, required: true },
        estimatedCost: { type: Number, required: true },
      },
    ],
    currentPremium: { type: Number, required: true },
    currentNCB: { type: Number, required: true },
    result: {
      basePremium: Number,
      nextNCB: Number,
      premiumIfClaim: Number,
      premiumIfNoClaim: Number,
      premiumLoss: Number,
      deductible: Number,
      localRepairCost: Number,
      totalCostIfClaim: Number,
      totalCostIfNotClaim: Number,
      netSavings: Number,
      recommendation: { type: String, enum: ["PAY_OUT_OF_POCKET", "CLAIM_INSURANCE"] },
    },
  },
  { timestamps: true }
);

// "My checks, newest first" is the only list query we run.
vehicleCheckSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.VehicleCheck || mongoose.model("VehicleCheck", vehicleCheckSchema);
