/**
 * NUVAKARA is an Indonesian product, so every invitation renders its date in
 * WIB (Asia/Jakarta). Formatting with an explicit time zone keeps the server
 * render and the client hydration identical regardless of where the guest is.
 */
export const EVENT_TIME_ZONE = "Asia/Jakarta";

/** Offset of Asia/Jakarta. Indonesia does not observe DST. */
const JAKARTA_OFFSET = "+07:00";

/** "Sabtu, 12 Desember 2026" — empty string for invalid dates. */
export function formatEventDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeZone: EVENT_TIME_ZONE,
  }).format(date);
}

/** `timestamptz` -> value accepted by `<input type="datetime-local">` (WIB). */
export function toEventInputValue(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/** `datetime-local` value submitted from the editor (WIB) -> ISO timestamp. */
export function eventInputToIsoString(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value}:00${JAKARTA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
