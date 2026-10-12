import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatINR } from "../../utils/format.js";

const COLORS = { repairCost: "#F97316", deductible: "#9CA3AF", premiumLoss: "#111827" };
const LABELS = { repairCost: "Repair cost", deductible: "Deductible", premiumLoss: "Premium loss (next year)" };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="rounded-lg border-2 border-black bg-white p-3 text-xs">
      <p className="font-bold">{label}</p>
      {payload
        .filter((p) => p.value > 0)
        .map((p) => (
          <p key={p.dataKey} className="mt-1 flex justify-between gap-4 text-black/60">
            <span>{LABELS[p.dataKey]}</span>
            <span className="text-black">{formatINR(p.value)}</span>
          </p>
        ))}
      <p className="mt-1.5 flex justify-between gap-4 border-t border-black/15 pt-1.5 font-bold">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </p>
    </div>
  );
}

export default function ComparisonChart({ result }) {
  const data = [
    { name: "Pay out-of-pocket", repairCost: result.totalCostIfNotClaim, deductible: 0, premiumLoss: 0 },
    { name: "File the claim", repairCost: 0, deductible: result.deductible, premiumLoss: result.premiumLoss },
  ];

  return (
    <div className="rounded-lg border-2 border-black bg-white p-6">
      <p className="text-sm font-bold uppercase tracking-wide">Cost comparison</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" strokeOpacity={0.1} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#374151" }}
              axisLine={{ stroke: "#11182730" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickFormatter={(v) => `₹${v / 1000}k`}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#11182708" }} />
            <Legend formatter={(value) => LABELS[value] || value} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="repairCost" stackId="a" fill={COLORS.repairCost} maxBarSize={72} />
            <Bar dataKey="deductible" stackId="a" fill={COLORS.deductible} maxBarSize={72} />
            <Bar dataKey="premiumLoss" stackId="a" fill={COLORS.premiumLoss} maxBarSize={72} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
