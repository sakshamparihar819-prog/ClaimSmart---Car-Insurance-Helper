import mongoose from "mongoose";

// Standard localized repair costs in India, grouped by segment, brand, model and part.
const carDamageSchema = new mongoose.Schema({
  segment: { type: String, required: true }, // Hatchback, Sedan, SUV...
  brand: { type: String, required: true }, // Maruti Suzuki, Hyundai, Tata...
  model: { type: String, required: true }, // Swift, Creta, Nexon...
  parts: [
    {
      _id: false,
      partName: { type: String, required: true }, // Front Bumper, Side Mirror...
      estimatedCost: { type: Number, required: true }, // Standard local repair cost in INR
      diyEligible: { type: Boolean, default: false },
    },
  ],
});

carDamageSchema.index({ segment: 1, brand: 1, model: 1 }, { unique: true });

export default mongoose.models.CarDamageCost || mongoose.model("CarDamageCost", carDamageSchema);
