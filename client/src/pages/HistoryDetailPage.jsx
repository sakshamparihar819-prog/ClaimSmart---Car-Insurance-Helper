import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ResultsPanel from "../components/calculator/ResultsPanel.jsx";
import { api } from "../api/client.js";
import { formatDate } from "../utils/format.js";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setError("");
    api
      .getHistoryItem(id)
      .then((data) => !cancelled && setResult(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-bold text-black/60 hover:text-black">
        <ArrowLeft size={14} /> Back to history
      </Link>

      {error && <p className="mt-6 rounded-md border-2 border-black bg-orange-50 px-4 py-3 text-sm">{error}</p>}

      {!result && !error && (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-black/50">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {result && (
        <>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            {result.car.brand} {result.car.model}
          </h1>
          <p className="mt-1 text-sm text-black/50">
            {result.car.segment} · checked on {formatDate(result.createdAt)}
          </p>
          <div className="mt-8">
            <ResultsPanel result={result} />
          </div>
        </>
      )}
    </div>
  );
}
