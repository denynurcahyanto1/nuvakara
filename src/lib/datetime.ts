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

/** "18.00 WIB" — empty string for invalid dates. */
export function formatEventTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: EVENT_TIME_ZONE,
  }).format(date);
  return `${time.replace(":", ".")} WIB`;
}

/** "12 Desember 2026" — the compact form used on covers and hero headers. */
export function formatEventDateCompact(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
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

/**
 * Seconds between now and the target. Called while rendering a server
 * component so the first paint of the countdown is already correct.
 */
export function secondsUntil(target: string | null | undefined): number {
  if (!target) return 0;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
}
