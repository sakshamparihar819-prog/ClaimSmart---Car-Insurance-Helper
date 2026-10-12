import { Link } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import VerdictStamp from "../calculator/VerdictStamp.jsx";
import { formatDate, formatINR } from "../../utils/format.js";

const LABEL = {
  PAY_OUT_OF_POCKET: "Pay out-of-pocket",
  CLAIM_INSURANCE: "File the claim",
};

export default function HistoryCard({ item, onDelete }) {
  const shownParts = item.partNames.slice(0, 2).map((name) => name.split(" – ")[0]);
  const extra = item.partNames.length - shownParts.length;

  return (
    <div className="flex flex-col justify-between rounded-lg border-2 border-black bg-white p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold leading-tight">
              {item.car.brand} {item.car.model}
            </p>
            <p className="mt-0.5 text-xs text-black/45">
              {item.car.segment} · {formatDate(item.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded-md border-2 border-black/20 p-1.5 text-black/50 hover:border-black hover:text-black"
            aria-label="Delete this check"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="mt-3 text-sm text-black/60">
          Damage: {shownParts.join(", ")}
          {extra > 0 ? ` +${extra} more` : ""}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-black/50">
          <div>
            <p className="uppercase tracking-wide">Repair cost</p>
            <p className="mt-0.5 text-sm font-bold text-black">{formatINR(item.localRepairCost)}</p>
          </div>
          <div className="text-right">
            <p className="uppercase tracking-wide">You save</p>
            <p className="mt-0.5 text-sm font-bold text-green-700">{formatINR(item.netSavings)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-dashed border-black/20 pt-4">
        <VerdictStamp label={LABEL[item.recommendation]} />
        <Link to={`/history/${item.id}`} className="inline-flex items-center gap-1 text-xs font-bold hover:underline">
          View <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
