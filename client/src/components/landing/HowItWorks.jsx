const STEPS = [
  {
    n: "01",
    title: "Tell us the damage",
    body: "Pick your car's segment, brand and model, then tick what's dented, cracked or scratched.",
  },
  {
    n: "02",
    title: "Set the prices",
    body: "We pre-fill typical garage costs. Got a real quote? Type it in and it replaces our estimate.",
  },
  {
    n: "03",
    title: "Add your policy",
    body: "Current annual premium and your No-Claim Bonus slab — both are on your renewal notice.",
  },
  {
    n: "04",
    title: "Get your verdict",
    body: "Pay it yourself or file the claim, with the exact rupees saved. Logged-in checks are saved for later.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">How it works</p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          A few fields. One clear verdict.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-lg border-2 border-black bg-white p-6">
              <span className="text-3xl font-bold text-black/15">{step.n}</span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
