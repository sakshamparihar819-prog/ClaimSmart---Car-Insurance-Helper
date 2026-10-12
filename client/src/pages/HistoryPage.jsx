import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import HistoryCard from "../components/history/HistoryCard.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function HistoryPage() {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getHistory()
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) logout(); // token expired -> ProtectedRoute sends us to /login
        setError(err.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this check from your history?")) return;
    try {
      await api.deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClearAll() {
    if (!window.confirm("Delete ALL saved checks? This can't be undone.")) return;
    try {
      await api.clearHistory();
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Your history</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cars you&apos;ve checked</h1>
          <p className="mt-2 text-sm text-black/55">Every check you run while logged in is saved here.</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-md border-2 border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      {error && <p className="mt-6 rounded-md border-2 border-black bg-orange-50 px-4 py-3 text-sm">{error}</p>}

      <div className="mt-8">
        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-black/50">
            <Loader2 size={16} className="animate-spin" /> Loading your history…
          </div>
        )}

        {status === "ready" && items.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-black/30 px-6 py-16 text-center">
            <p className="text-base font-bold">No checks yet</p>
            <p className="mt-1.5 text-sm text-black/50">Run your first check and it will show up here.</p>
            <Link
              to="/calculator"
              className="mt-5 inline-block rounded-md border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-black"
            >
              Open the calculator
            </Link>
          </div>
        )}

        {status === "ready" && items.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
