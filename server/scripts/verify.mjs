// Sanity checks for the pure (database-free) logic: `npm run verify`
import { calculateVerdict, getNextNCBSlab } from "../src/utils/calculations.js";
import { checkCalculateBody, checkLogin, checkRegister, resolveDamagedParts } from "../src/utils/validators.js";
import { buildResultPayload, pickResultFields } from "../src/utils/resultPayload.js";
import { generateCarDocs } from "../src/data/carData.js";
import { PARTS_CATALOG } from "../src/data/partsCatalog.js";

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`  \u2713 ${label}`);
  } else {
    failed += 1;
    console.error(`  \u2717 ${label}`);
  }
}

console.log("NCB slabs:");
assert("0% -> 20%", getNextNCBSlab(0) === 20);
assert("35% -> 45%", getNextNCBSlab(35) === 45);
assert("50% stays capped at 50%", getNextNCBSlab(50) === 50);

console.log("\nDecision engine:");
const minor = calculateVerdict({ currentPremium: 18000, currentNCB: 35, localRepairCost: 1200 });
assert("minor damage -> PAY_OUT_OF_POCKET", minor.recommendation === "PAY_OUT_OF_POCKET");
const major = calculateVerdict({ currentPremium: 6000, currentNCB: 0, localRepairCost: 45000 });
assert("major damage -> CLAIM_INSURANCE", major.recommendation === "CLAIM_INSURANCE");
const base = calculateVerdict({ currentPremium: 8000, currentNCB: 20, localRepairCost: 0 });
assert("basePremium = premium / (1 - NCB/100)", base.basePremium === 10000);
assert("premiumLoss = base * nextNCB%", base.premiumLoss === 2500);

console.log("\nCatalogue / prices:");
const cars = generateCarDocs();
assert("22 cars", cars.length === 22);
assert("13 parts per car", cars.every((c) => c.parts.length === PARTS_CATALOG.length));
const creta = cars.find((c) => c.model === "Creta");
const cretaBumper = creta.parts.find((p) => p.partName.startsWith("Front Bumper")).estimatedCost;
assert(`Creta front bumper is ~9-10k (got ${cretaBumper})`, cretaBumper >= 9000 && cretaBumper <= 10000);
assert("every price is a multiple of 50", cars.every((c) => c.parts.every((p) => p.estimatedCost % 50 === 0)));

console.log("\nValidators:");
assert("register: good input passes", checkRegister({ name: "Asha", email: "a@b.co", password: "secret1" }) === null);
assert("register: short password rejected", checkRegister({ name: "Asha", email: "a@b.co", password: "123" }) !== null);
assert("register: bad email rejected", checkRegister({ name: "Asha", email: "nope", password: "secret1" }) !== null);
assert("login: missing password rejected", checkLogin({ email: "a@b.co" }) !== null);

const body = {
  carId: "abc",
  selectedParts: [{ partName: "x", estimatedCost: 1 }],
  currentPremium: 12000,
  currentNCB: 20,
};
assert("calculate body: valid passes", checkCalculateBody(body) === null);
assert("calculate body: bad NCB rejected", checkCalculateBody({ ...body, currentNCB: 30 }) !== null);
assert("calculate body: empty parts rejected", checkCalculateBody({ ...body, selectedParts: [] }) !== null);
assert("calculate body: premium out of range rejected", checkCalculateBody({ ...body, currentPremium: 5 }) !== null);

const frontBumper = creta.parts[0].partName;
const okParts = resolveDamagedParts(creta, [{ partName: frontBumper, estimatedCost: 10500 }]);
assert("edited price is trusted & summed", okParts.localRepairCost === 10500);
assert("unknown part rejected", resolveDamagedParts(creta, [{ partName: "Wings", estimatedCost: 1 }]).error !== undefined);
assert(
  "duplicate part rejected",
  resolveDamagedParts(creta, [
    { partName: frontBumper, estimatedCost: 1 },
    { partName: frontBumper, estimatedCost: 2 },
  ]).error !== undefined
);
assert("negative price rejected", resolveDamagedParts(creta, [{ partName: frontBumper, estimatedCost: -5 }]).error !== undefined);
assert(
  "string price rejected",
  resolveDamagedParts(creta, [{ partName: frontBumper, estimatedCost: "100" }]).error !== undefined
);

console.log("\nResponse payload:");
const scratchPart = "Bumper – Scratch/Paint Chip";
const verdict = calculateVerdict({ currentPremium: 18000, currentNCB: 35, localRepairCost: 1800 });
const payload = buildResultPayload({
  car: creta,
  parts: [{ partName: scratchPart, estimatedCost: 1800 }],
  currentPremium: 18000,
  currentNCB: 35,
  result: verdict,
});
assert("payload carries car + breakdown", payload.car.model === "Creta" && payload.damageBreakdown.length === 1);
assert("DIY suggestions included when paying out-of-pocket", payload.diySuggestions.length === 1);
assert("DIY links are amazon.in search URLs", payload.diySuggestions[0].products[0].url.startsWith("https://www.amazon.in/s?k="));
assert("pickResultFields keeps the recommendation", pickResultFields(verdict).recommendation === verdict.recommendation);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
