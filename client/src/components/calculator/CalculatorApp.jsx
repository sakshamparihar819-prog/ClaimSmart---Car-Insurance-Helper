import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import InputPanel from "./InputPanel.jsx";
import ResultsPanel from "./ResultsPanel.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

const unique = (list) => [...new Set(list)];

export default function CalculatorApp() {
  const { user } = useAuth();

  // Catalogue loaded from the API
  const [catalog, setCatalog] = useState({ cars: [], ncbSlabs: [0, 20, 25, 35, 45, 50] });
  const [catalogStatus, setCatalogStatus] = useState("loading"); // loading | ready | error
  const [catalogError, setCatalogError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Form state
  const [segment, setSegment] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [selectedParts, setSelectedParts] = useState({}); // { [partName]: price }
  const [currentPremium, setCurrentPremium] = useState(12000);
  const [currentNCB, setCurrentNCB] = useState(20);

  // Result state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setCatalogStatus("loading");
    api
      .getCars()
      .then((data) => {
        if (cancelled) return;
        setCatalog({ cars: data.cars, ncbSlabs: data.ncbSlabs });
        setCatalogStatus("ready");
        const first = data.cars[0];
        if (first) {
          setSegment(first.segment);
          setBrand(first.brand);
          setModel(first.model);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setCatalogError(err.message);
        setCatalogStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const { cars, ncbSlabs } = catalog;
  const segments = useMemo(() => unique(cars.map((c) => c.segment)), [cars]);
  const brands = useMemo(() => unique(cars.filter((c) => c.segment === segment).map((c) => c.brand)), [cars, segment]);
  const models = useMemo(
    () => cars.filter((c) => c.segment === segment && c.brand === brand).map((c) => c.model),
    [cars, segment, brand]
  );
  const car = useMemo(
    () => cars.find((c) => c.segment === segment && c.brand === brand && c.model === model) || null,
    [cars, segment, brand, model]
  );

  // Switch car: keep the same ticked parts, but re-price them for the new car.
  function applyCar(nextSegment, nextBrand, nextModel) {
    const nextCar = cars.find((c) => c.segment === nextSegment && c.brand === nextBrand && c.model === nextModel);
    setSegment(nextSegment);
    setBrand(nextBrand);
    setModel(nextModel);
    setResult(null);
    setSelectedParts((prev) => {
      if (!nextCar) return {};
      const next = {};
      for (const partName of Object.keys(prev)) {
        const part = nextCar.parts.find((p) => p.partName === partName);
        if (part) next[partName] = part.estimatedCost;
      }
      return next;
    });
  }

  function handleSegmentChange(nextSegment) {
    const nextBrand = unique(cars.filter((c) => c.segment === nextSegment).map((c) => c.brand))[0];
    const nextModel = cars.find((c) => c.segment === nextSegment && c.brand === nextBrand)?.model;
    applyCar(nextSegment, nextBrand, nextModel);
  }

  function handleBrandChange(nextBrand) {
    const nextModel = cars.find((c) => c.segment === segment && c.brand === nextBrand)?.model;
    applyCar(segment, nextBrand, nextModel);
  }

  function handleModelChange(nextModel) {
    applyCar(segment, brand, nextModel);
  }

  function handleTogglePart(partName, defaultCost) {
    setSelectedParts((prev) => {
      const next = { ...prev };
      if (partName in next) delete next[partName];
      else next[partName] = defaultCost;
      return next;
    });
  }

  function handleCostChange(partName, value) {
    setSelectedParts((prev) => ({ ...prev, [partName]: value }));
  }

  async function handleCalculate() {
    if (!car) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.calculate({
        carId: car._id,
        selectedParts: Object.entries(selectedParts).map(([partName, cost]) => ({
          partName,
          estimatedCost: Math.max(0, Number(cost) || 0),
        })),
        currentPremium,
        currentNCB,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  if (catalogStatus === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/30 px-6 py-20 text-sm text-black/50">
        <Loader2 size={16} className="animate-spin" /> Loading car catalogue…
      </div>
    );
  }

  if (catalogStatus === "error") {
    return (
      <div className="rounded-lg border-2 border-black bg-orange-50 px-6 py-10 text-center">
        <p className="font-bold">Couldn&apos;t load the car catalogue.</p>
        <p className="mt-1 text-sm text-black/60">{catalogError}</p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="mt-4 rounded-md border-2 border-black bg-black px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-black"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <InputPanel
          segment={segment}
          brand={brand}
          model={model}
          segments={segments}
          brands={brands}
          models={models}
          onSegmentChange={handleSegmentChange}
          onBrandChange={handleBrandChange}
          onModelChange={handleModelChange}
          parts={car?.parts ?? []}
          selectedParts={selectedParts}
          onTogglePart={handleTogglePart}
          onCostChange={handleCostChange}
          currentPremium={currentPremium}
          onPremiumChange={setCurrentPremium}
          currentNCB={currentNCB}
          onNCBChange={setCurrentNCB}
          ncbSlabs={ncbSlabs}
          onCalculate={handleCalculate}
          loading={loading}
          error={error}
        />
      </div>

      <div className="space-y-4">
        {result && (
          <div className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2.5 text-sm">
            {result.savedToHistory ? (
              <>
                <CheckCircle2 size={16} className="shrink-0 text-green-700" />
                <span>
                  Saved to your history.{" "}
                  <Link to="/history" className="font-bold underline">
                    View history
                  </Link>
                </span>
              </>
            ) : user ? (
              <span className="text-black/60">This check wasn&apos;t saved — try logging in again.</span>
            ) : (
              <span className="text-black/60">
                <Link to="/login" className="font-bold text-black underline">
                  Log in
                </Link>{" "}
                or{" "}
                <Link to="/register" className="font-bold text-black underline">
                  sign up
                </Link>{" "}
                to save checks like this one to your history.
              </span>
            )}
          </div>
        )}
        <ResultsPanel result={result} />
      </div>
    </div>
  );
}
