import { PARTS_CATALOG } from "./partsCatalog.js";

/**
 * Builds the documents stored in the CarDamageCost collection:
 *   { segment, brand, model, parts: [{ partName, estimatedCost, diyEligible }] }
 *
 * Costs come from one Hatchback baseline (partsCatalog.js) scaled by a
 * segment multiplier and a brand factor. All figures are illustrative
 * local-garage estimates — users can override any of them in the UI.
 */

export const SEGMENT_MULTIPLIER = {
  Hatchback: 1.0,
  Sedan: 1.22,
  "Compact SUV": 1.32,
  SUV: 1.5,
  MUV: 1.4,
};

export const BRAND_VARIANCE = {
  "Maruti Suzuki": 0.92,
  Hyundai: 1.0,
  Tata: 0.95,
  Mahindra: 1.05,
  Honda: 1.08,
  Toyota: 1.15,
  Kia: 1.05,
};

export const MODELS = [
  { brand: "Maruti Suzuki", model: "Swift", segment: "Hatchback" },
  { brand: "Maruti Suzuki", model: "Baleno", segment: "Hatchback" },
  { brand: "Maruti Suzuki", model: "WagonR", segment: "Hatchback" },
  { brand: "Maruti Suzuki", model: "Dzire", segment: "Sedan" },
  { brand: "Maruti Suzuki", model: "Ertiga", segment: "MUV" },
  { brand: "Maruti Suzuki", model: "Brezza", segment: "Compact SUV" },
  { brand: "Hyundai", model: "i20", segment: "Hatchback" },
  { brand: "Hyundai", model: "i10 Nios", segment: "Hatchback" },
  { brand: "Hyundai", model: "Venue", segment: "Compact SUV" },
  { brand: "Hyundai", model: "Creta", segment: "SUV" },
  { brand: "Tata", model: "Punch", segment: "Compact SUV" },
  { brand: "Tata", model: "Nexon", segment: "Compact SUV" },
  { brand: "Tata", model: "Altroz", segment: "Hatchback" },
  { brand: "Tata", model: "Harrier", segment: "SUV" },
  { brand: "Mahindra", model: "Scorpio-N", segment: "SUV" },
  { brand: "Mahindra", model: "XUV700", segment: "SUV" },
  { brand: "Honda", model: "City", segment: "Sedan" },
  { brand: "Honda", model: "Amaze", segment: "Sedan" },
  { brand: "Toyota", model: "Innova Crysta", segment: "MUV" },
  { brand: "Toyota", model: "Glanza", segment: "Hatchback" },
  { brand: "Kia", model: "Seltos", segment: "Compact SUV" },
  { brand: "Kia", model: "Sonet", segment: "Compact SUV" },
];

export function scaleCost(baseCost, segment, brand) {
  const segFactor = SEGMENT_MULTIPLIER[segment] ?? 1;
  const brandFactor = BRAND_VARIANCE[brand] ?? 1;
  // Round to the nearest 50 so figures read like real garage quotes.
  return Math.round((baseCost * segFactor * brandFactor) / 50) * 50;
}

export function generateCarDocs() {
  return MODELS.map(({ brand, model, segment }) => ({
    segment,
    brand,
    model,
    parts: PARTS_CATALOG.map((p) => ({
      partName: p.name,
      estimatedCost: scaleCost(p.baseCost, segment, brand),
      diyEligible: p.diyEligible,
    })),
  }));
}
