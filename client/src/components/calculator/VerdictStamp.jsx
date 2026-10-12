import { cn } from "../../utils/format.js";

/** Plain bordered pill badge for the verdict. */
export default function VerdictStamp({ label, size = "md" }) {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-2 border-black font-bold uppercase text-black",
        size === "lg" ? "px-5 py-2 text-base sm:text-lg" : "px-3.5 py-1 text-xs sm:text-sm"
      )}
    >
      {label}
    </div>
  );
}
