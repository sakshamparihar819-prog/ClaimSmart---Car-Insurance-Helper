/** Indian Rupees with lakh/crore grouping, e.g. 1234567 -> "₹12,34,567". */
export function formatINR(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Tiny classnames joiner — skips falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
