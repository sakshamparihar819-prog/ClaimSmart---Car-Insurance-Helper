import { Calculator } from "lucide-react";
import VerdictStamp from "./VerdictStamp.jsx";
import { formatINR } from "../../utils/format.js";

const LABEL = {
  PAY_OUT_OF_POCKET: "Pay out-of-pocket",
  CLAIM_INSURANCE: "File the claim",
};

export default function VerdictBanner({ result }) {
  const isPayOwn = result.recommendation === "PAY_OUT_OF_POCKET";
  const carLabel = `${result.car.brand} ${result.car.model}`;
  const ticketId = result.id ? result.id.slice(-6).toUpperCase() : String(result.localRepairCost).padStart(5, "0");

  const quote = isPayOwn
    ? `Repairs on your ${carLabel} cost ${formatINR(result.localRepairCost)}, but filing would cost you ${formatINR(
        result.totalCostIfClaim
      )} between the deductible and next year's premium hike. Pay it yourself and keep the difference.`
    : `Filing costs you ${formatINR(
        result.totalCostIfClaim
      )} in deductible and next year's premium hike — cheaper than the ${formatINR(
        result.localRepairCost
      )} repair bill out of pocket. This one's worth claiming.`;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border-2 border-black bg-white p-6 text-center sm:p-8">
        <p className="text-xs text-black/40">ID: #CS-{ticketId}</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Should you file this claim?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-black/55">
          I&apos;ve run the numbers for your {carLabel} — here&apos;s the straight answer.
        </p>
        <div className="mt-5 flex justify-center">
          <VerdictStamp label={LABEL[result.recommendation]} size="lg" />
        </div>
      </div>

      <div className="rounded-lg border-2 border-black bg-white p-6">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <Calculator size={16} /> The math breakdown
        </p>
        <div className="mt-3 divide-y divide-black/10">
          <div className="flex items-center justify-between py-2.5 text-sm">
            <span>Local repair cost</span>
            <span className="font-bold">{formatINR(result.localRepairCost)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5 text-sm text-orange-700">
            <span>Cost of filing a claim (deductible + premium hike)</span>
            <span className="font-bold">{formatINR(result.totalCostIfClaim)}</span>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between border-t-2 border-black pt-3">
          <span className="text-sm font-bold uppercase">{isPayOwn ? "You save" : "Net benefit"}</span>
          <span className="text-2xl font-bold text-green-700">{formatINR(result.netSavings)}</span>
        </div>
      </div>

      <div className="rounded-lg border-2 border-green-700 bg-green-50 p-4">
        <p className="text-sm italic leading-relaxed text-green-900">&ldquo;{quote}&rdquo;</p>
      </div>
    </div>
  );
}
