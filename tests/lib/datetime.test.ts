import { describe, expect, test, vi } from "vitest";
import {
  eventInputToIsoString,
  formatEventDate,
  secondsUntil,
  toEventInputValue,
} from "@/lib/datetime";

describe("datetime helpers (Asia/Jakarta)", () => {
  test("formats a timestamp as a full Indonesian date", () => {
    expect(formatEventDate("2026-12-12T03:00:00Z")).toBe("Sabtu, 12 Desember 2026");
  });

  test("uses the WIB calendar day, not UTC", () => {
    // 18:00 UTC = 01:00 WIB on the next day.
    expect(formatEventDate("2026-12-11T18:00:00Z")).toBe("Sabtu, 12 Desember 2026");
  });

  test("returns an empty string for missing or invalid values", () => {
    expect(formatEventDate(null)).toBe("");
    expect(formatEventDate("")).toBe("");
    expect(formatEventDate("not-a-date")).toBe("");
  });

  test("converts a timestamp to a datetime-local value in WIB", () => {
    expect(toEventInputValue("2026-12-12T03:00:00Z")).toBe("2026-12-12T10:00");
  });

  test("renders midnight as 00, never 24", () => {
    expect(toEventInputValue("2026-12-11T17:00:00Z")).toBe("2026-12-12T00:00");
  });

  test("parses a datetime-local value as WIB", () => {
    expect(eventInputToIsoString("2026-12-12T10:00")).toBe("2026-12-12T03:00:00.000Z");
  });

  test("returns null for an empty datetime-local value", () => {
    expect(eventInputToIsoString("")).toBeNull();
    expect(eventInputToIsoString(null)).toBeNull();
  });

  test("computes the first-paint countdown and clamps past events", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-11T03:00:00Z"));

    expect(secondsUntil("2026-12-12T03:00:00Z")).toBe(86_400);
    expect(secondsUntil("2020-01-01T00:00:00Z")).toBe(0);
    expect(secondsUntil(null)).toBe(0);
    expect(secondsUntil("not-a-date")).toBe(0);

    vi.useRealTimers();
  });
});
