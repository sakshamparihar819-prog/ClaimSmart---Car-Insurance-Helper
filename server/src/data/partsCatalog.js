/**
 * The 13 damage types ClaimSmart understands.
 *
 * `baseCost` is the illustrative local-garage repair/replacement cost (INR)
 * for a Hatchback; carData.js scales it by segment + brand.
 * `diyEligible` marks cosmetic damage where a DIY kit is a realistic option.
 */
export const PARTS_CATALOG = [
  { name: "Front Bumper – Dent/Crack", baseCost: 6000, diyEligible: false },
  { name: "Rear Bumper – Dent/Crack", baseCost: 5700, diyEligible: false },
  { name: "Bonnet/Hood – Dent", baseCost: 7200, diyEligible: false },
  { name: "Side Mirror – Crack/Broken", baseCost: 2200, diyEligible: false },
  { name: "Headlamp – Foggy/Cracked Lens", baseCost: 3900, diyEligible: true },
  { name: "Tail Lamp – Cracked", baseCost: 2600, diyEligible: false },
  { name: "Windshield – Chip/Crack", baseCost: 9800, diyEligible: false },
  { name: "Door – Minor Dent (Single Panel)", baseCost: 3200, diyEligible: true },
  { name: "Door – Major Dent (Multiple Panels)", baseCost: 8200, diyEligible: false },
  { name: "Fender – Minor Dent/Scratch", baseCost: 3700, diyEligible: true },
  { name: "Alloy Wheel – Scratch/Rash", baseCost: 2500, diyEligible: true },
  { name: "Bumper – Scratch/Paint Chip", baseCost: 1800, diyEligible: true },
  { name: "Full Body – Paint Fade/Multiple Scratches", baseCost: 27000, diyEligible: false },
];
