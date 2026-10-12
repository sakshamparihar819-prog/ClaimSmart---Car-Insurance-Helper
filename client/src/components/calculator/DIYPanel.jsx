import { ExternalLink, Sparkles } from "lucide-react";

export default function DIYPanel({ suggestions = [] }) {
  const hasEligible = suggestions.length > 0;

  return (
    <div className="rounded-lg border-2 border-black bg-orange-50 p-6">
      <div className="flex items-center gap-2">
        <Sparkles size={16} />
        <p className="text-sm font-bold uppercase tracking-wide">Worth doing yourself?</p>
      </div>

      {!hasEligible ? (
        <p className="mt-2 text-sm leading-relaxed text-black/60">
          These particular repairs are better left to a professional — but skipping the claim still keeps more
          money in your pocket than filing would.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {suggestions.map(({ partName, products }) => (
            <div key={partName}>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/45">{partName}</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <a
                    key={product.name}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between rounded-lg border-2 border-black bg-white p-4 hover:bg-orange-50"
                  >
                    <div>
                      <p className="text-sm font-bold">{product.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-black/55">{product.blurb}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-black/50">{product.priceRange}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold">
                        Search on Amazon.in
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
