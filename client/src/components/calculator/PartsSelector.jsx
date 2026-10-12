import { Check, RotateCcw } from "lucide-react";
import { cn, formatINR } from "../../utils/format.js";

/**
 * Damage checklist. Ticking a part adds it with our estimated price; the price
 * box then becomes editable so the user can type their garage's real quote.
 *
 * `selected` is an object: { [partName]: price } — a part is "ticked" if it has a key.
 */
export default function PartsSelector({ parts, selected, onToggle, onCostChange }) {
  if (!parts?.length) {
    return (
      <p className="rounded-md border-2 border-dashed border-black/25 px-4 py-6 text-center text-sm text-black/40">
        Pick a car above to see damage options and repair costs.
      </p>
    );
  }

  return (
    <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
      {parts.map((part) => {
        const isChecked = Object.prototype.hasOwnProperty.call(selected, part.partName);
        const currentCost = selected[part.partName];
        const isEdited = isChecked && Number(currentCost) !== part.estimatedCost;

        return (
          <div
            key={part.partName}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border-2 px-3 py-2.5",
              isChecked ? "border-black bg-orange-50" : "border-black/15 bg-white"
            )}
          >
            <button
              type="button"
              onClick={() => onToggle(part.partName, part.estimatedCost)}
              className="flex flex-1 items-center gap-3 text-left"
              aria-pressed={isChecked}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                  isChecked ? "border-black bg-black" : "border-black/30 bg-white"
                )}
              >
                {isChecked && <Check size={13} strokeWidth={3} className="text-white" />}
              </span>
              <span className="text-sm font-medium">
                {part.partName}
                {part.diyEligible && (
                  <span className="ml-2 rounded-full border border-green-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                    DIY-friendly
                  </span>
                )}
              </span>
            </button>

            {isChecked ? (
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-sm text-black/50">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="50"
                  value={currentCost}
                  onChange={(e) => onCostChange(part.partName, e.target.value)}
                  className="w-20 rounded-md border-2 border-black bg-white px-2 py-1 text-right text-sm font-bold"
                  aria-label={`Repair cost for ${part.partName}`}
                />
                {isEdited && (
                  <button
                    type="button"
                    onClick={() => onCostChange(part.partName, part.estimatedCost)}
                    title={`Reset to estimate (${formatINR(part.estimatedCost)})`}
                    aria-label="Reset to estimated price"
                    className="text-black/40 hover:text-black"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            ) : (
              <span className="shrink-0 text-sm text-black/45">{formatINR(part.estimatedCost)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
