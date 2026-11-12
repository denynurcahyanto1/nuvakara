/**
 * Lowercase, strip everything that is not a letter, digit or space, then
 * collapse whitespace into single dashes.
 *
 *   slugify("Rafi & Aisyah")   -> "rafi-aisyah"
 *   slugify("  Wisuda 2026!  ") -> "wisuda-2026"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** 12345 -> "12.345" (Indonesian locale). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/** 150000 -> "Rp 150.000" */
export function formatCurrency(value: number, currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Locale-aware short date, e.g. "12 Nov 2026". */
export function formatDate(value: Date | string, locale = "id-ID"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
