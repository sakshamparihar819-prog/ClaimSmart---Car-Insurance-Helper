import CalculatorApp from "../components/calculator/CalculatorApp.jsx";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Run your numbers</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
        Pick your car, mark the damage, get your verdict.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/55 sm:text-base">
        Prices are illustrative local-garage estimates — edit any of them with your garage&apos;s actual quote
        for a sharper answer.
      </p>

      <div className="mt-8">
        <CalculatorApp />
      </div>
    </div>
  );
}
