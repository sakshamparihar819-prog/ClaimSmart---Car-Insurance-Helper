import { ChevronDown, Loader2 } from "lucide-react";
import PartsSelector from "./PartsSelector.jsx";
import { formatINR } from "../../utils/format.js";

const PREMIUM_MIN = 2000;
const PREMIUM_MAX = 40000;
const PREMIUM_STEP = 500;

function FieldLabel({ children }) {
  return <label className="block text-xs font-bold uppercase tracking-wide text-black/50">{children}</label>;
}

function SelectField({ label, value, onChange, options, formatLabel = (opt) => opt }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border-2 border-black bg-white py-2.5 pl-3 pr-9 text-sm font-medium"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {formatLabel(opt)}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

export default function InputPanel({
  segment,
  brand,
  model,
  segments,
  brands,
  models,
  onSegmentChange,
  onBrandChange,
  onModelChange,
  parts,
  selectedParts,
  onTogglePart,
  onCostChange,
  currentPremium,
  onPremiumChange,
  currentNCB,
  onNCBChange,
  ncbSlabs,
  onCalculate,
  loading,
  error,
}) {
  const selectedCount = Object.keys(selectedParts).length;
  const totalRepair = Object.values(selectedParts).reduce((sum, v) => sum + (Number(v) || 0), 0);

  return (
    <div className="rounded-lg border-2 border-black bg-white p-6">
      <section>
        <p className="text-sm font-bold uppercase tracking-wide">1. Your car</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <SelectField label="Segment" value={segment} onChange={onSegmentChange} options={segments} />
          <SelectField label="Brand" value={brand} onChange={onBrandChange} options={brands} />
          <SelectField label="Model" value={model} onChange={onModelChange} options={models} />
        </div>
      </section>

      <section className="mt-6 border-t-2 border-black pt-6">
        <p className="text-sm font-bold uppercase tracking-wide">2. The damage</p>
        <p className="mt-1 text-xs text-black/45">
          Tick every damaged part. Got a quote from your garage? Edit the price right in the box.
        </p>
        <div className="mt-3">
          <PartsSelector
            parts={parts}
            selected={selectedParts}
            onToggle={onTogglePart}
            onCostChange={onCostChange}
          />
        </div>
        {selectedCount > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-md border-2 border-black bg-orange-50 px-3 py-2 text-sm">
            <span className="font-bold">
              Total repair ({selectedCount} {selectedCount === 1 ? "part" : "parts"})
            </span>
            <span className="font-bold">{formatINR(totalRepair)}</span>
          </div>
        )}
      </section>

      <section className="mt-6 border-t-2 border-black pt-6">
        <p className="text-sm font-bold uppercase tracking-wide">3. Your policy</p>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Current annual premium</FieldLabel>
            <span className="text-sm font-bold">{formatINR(currentPremium)}</span>
          </div>
          <input
            type="range"
            min={PREMIUM_MIN}
            max={PREMIUM_MAX}
            step={PREMIUM_STEP}
            value={currentPremium}
            onChange={(e) => onPremiumChange(Number(e.target.value))}
            className="mt-3 w-full accent-orange-500"
            aria-label="Current annual premium"
          />
          <div className="mt-1 flex justify-between text-[11px] text-black/40">
            <span>{formatINR(PREMIUM_MIN)}</span>
            <span>{formatINR(PREMIUM_MAX)}</span>
          </div>
        </div>

        <div className="mt-5">
          <SelectField
            label="Current NCB slab"
            value={String(currentNCB)}
            onChange={(v) => onNCBChange(Number(v))}
            options={ncbSlabs.map(String)}
            formatLabel={(opt) => `${opt}%`}
          />
        </div>
      </section>

      {error && <p className="mt-5 rounded-md border-2 border-black bg-orange-50 px-3 py-2 text-sm">{error}</p>}

      <button
        type="button"
        onClick={onCalculate}
        disabled={loading || selectedCount === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-black px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Crunching the numbers…
          </>
        ) : (
          "Calculate verdict"
        )}
      </button>
      {selectedCount === 0 && (
        <p className="mt-2 text-center text-xs text-black/40">Select at least one damaged part to continue.</p>
      )}
    </div>
  );
}
