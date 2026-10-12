import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ReceiptMockup from "./ReceiptMockup.jsx";

export default function Hero() {
  return (
    <section className="px-5 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">For Indian car owners</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Filing a claim isn&apos;t free.
            <br />
            Your No-Claim Bonus pays for it.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60 sm:text-lg">
            Pick your car, mark the damage, drop in your policy details. ClaimSmart compares today&apos;s
            repair bill against next year&apos;s premium hike and hands you a straight answer — in rupees.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-black px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-black"
            >
              Run the numbers
              <ArrowRight size={16} />
            </Link>
            <Link to="/#how-it-works" className="text-sm font-bold text-black/60 hover:text-black">
              See how it works
            </Link>
          </div>

          <p className="mt-10 border-t-2 border-black pt-4 text-xs text-black/50">
            Built on IRDAI NCB slabs · 22 models across 7 brands · Every check saved to your history
          </p>
        </div>

        <ReceiptMockup />
      </div>
    </section>
  );
}
