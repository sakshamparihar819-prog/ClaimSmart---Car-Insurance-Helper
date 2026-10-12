import VerdictStamp from "../calculator/VerdictStamp.jsx";

export default function ReceiptMockup() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border-2 border-black bg-white p-6">
        <div className="flex items-center justify-between text-xs text-black/40">
          <span>Claim ticket</span>
          <span>#CS-00482</span>
        </div>

        <div className="mt-4">
          <p className="text-lg font-bold">Tata Nexon</p>
          <p className="mt-0.5 text-sm text-black/55">Damage: Bumper — Scratch/Paint Chip</p>
        </div>

        <div className="my-4 border-t-2 border-dashed border-black/20" aria-hidden="true" />

        <div className="grid grid-cols-2 gap-3 text-xs text-black/50">
          <div>
            <p className="uppercase tracking-wide">Repair cost</p>
            <p className="mt-0.5 text-sm font-bold text-black">₹1,800</p>
          </div>
          <div className="text-right">
            <p className="uppercase tracking-wide">Premium loss</p>
            <p className="mt-0.5 text-sm font-bold text-black">₹3,200</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <VerdictStamp label="Pay out-of-pocket" />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-black/40">You save</p>
            <p className="text-xl font-bold">₹2,400</p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-black/40">Example verdict — try it with your own car ↓</p>
    </div>
  );
}
