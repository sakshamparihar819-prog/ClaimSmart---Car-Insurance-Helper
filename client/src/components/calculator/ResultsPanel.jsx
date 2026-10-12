import { Receipt } from "lucide-react";
import VerdictBanner from "./VerdictBanner.jsx";
import ComparisonChart from "./ComparisonChart.jsx";
import BreakdownLedger from "./BreakdownLedger.jsx";
import DIYPanel from "./DIYPanel.jsx";

// Used for a fresh calculation AND for a saved history entry — both have the same shape.
export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/30 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white">
          <Receipt size={20} />
        </div>
        <p className="mt-4 text-base font-bold">Your verdict will show up here</p>
        <p className="mt-1.5 max-w-xs text-sm text-black/50">
          Fill in the form and hit &ldquo;Calculate verdict&rdquo; to see the numbers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VerdictBanner result={result} />
      <ComparisonChart result={result} />
      {result.recommendation === "PAY_OUT_OF_POCKET" && <DIYPanel suggestions={result.diySuggestions} />}
      <BreakdownLedger result={result} />
    </div>
  );
}
