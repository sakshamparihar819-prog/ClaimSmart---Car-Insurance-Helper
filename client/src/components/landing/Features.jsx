import { Calculator, History, LineChart, MapPin, PencilLine, Wrench } from "lucide-react";

const FEATURES = [
  {
    icon: Calculator,
    title: "Real IRDAI math",
    body: "NCB slabs, reverse-calculated base premium, next-slab projection — not a rule of thumb.",
  },
  {
    icon: PencilLine,
    title: "Your prices, not ours",
    body: "Every part's cost is editable. Plug in the quote from your garage and the verdict updates.",
  },
  {
    icon: LineChart,
    title: "A verdict, not a spreadsheet",
    body: "A clear badge and a comparison chart stand in for the maths, so the answer takes one glance.",
  },
  {
    icon: History,
    title: "History of every car you've checked",
    body: "Log in and each check is saved — car, damage, prices, verdict — so you can look back anytime.",
  },
  {
    icon: Wrench,
    title: "DIY fixes for small stuff",
    body: "Scratch, chip or a shallow dent? We point you to a kit that skips the garage entirely.",
  },
  {
    icon: MapPin,
    title: "Built for Indian roads",
    body: "22 popular Maruti Suzuki, Hyundai, Tata, Honda, Toyota, Mahindra and Kia models, priced in ₹.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Why ClaimSmart</p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Built around one decision, done properly.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-lg border-2 border-black bg-white p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-black bg-orange-50">
                <f.icon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-black/60">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
