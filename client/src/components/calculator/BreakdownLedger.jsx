import { cn, formatINR } from "../../utils/format.js";

function Row({ label, value, strong = false }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-2 text-sm", strong ? "font-bold" : "text-black/70")}>
      <span>{label}</span>
      <span className="shrink-0">{value}</span>
    </div>
  );
}

export default function BreakdownLedger({ result }) {
  return (
    <details className="rounded-lg border-2 border-black bg-white p-6">
      <summary className="cursor-pointer select-none text-sm font-bold uppercase tracking-wide">
        Show full calculation
      </summary>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-black/40">Damage you entered</p>
      <div className="divide-y divide-dashed divide-black/15 border-b border-black/10">
        {result.damageBreakdown.map((p) => (
          <Row key={p.partName} label={p.partName} value={formatINR(p.estimatedCost)} />
        ))}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-black/40">Policy maths</p>
      <div className="divide-y divide-dashed divide-black/15 border-y border-black/10">
        <Row label="Current annual premium" value={formatINR(result.currentPremium)} />
        <Row label="Base OD premium (0% NCB)" value={formatINR(result.basePremium)} />
        <Row label="Current NCB slab" value={`${result.currentNCB}%`} />
        <Row label="Next year's NCB if you don't claim" value={`${result.nextNCB}%`} />
        <Row label="Premium next year — if you claim" value={formatINR(result.premiumIfClaim)} />
        <Row label="Premium next year — if you don't" value={formatINR(result.premiumIfNoClaim)} />
        <Row label="Premium loss from claiming" value={formatINR(result.premiumLoss)} />
        <Row label="Compulsory deductible" value={formatINR(result.deductible)} />
      </div>

      <div className="mt-2 space-y-1">
        <Row label="Total cost — pay out-of-pocket" value={formatINR(result.totalCostIfNotClaim)} strong />
        <Row label="Total cost — file the claim" value={formatINR(result.totalCostIfClaim)} strong />
        <Row label="Net savings by choosing right" value={formatINR(result.netSavings)} strong />
      </div>
    </details>
  );
}
