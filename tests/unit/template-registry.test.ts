import { describe, expect, test } from "vitest";
import {
  TEMPLATE_ALIASES,
  getRenderer,
  getTemplate,
  registry,
  resolveTemplateSlug,
} from "@/components/templates/registry";

describe("Template Registry", () => {
  test("registers one design per category", () => {
    const entries = Object.values(registry);
    expect(entries).toHaveLength(14);
    // 10 unique categories
    expect(new Set(entries.map((entry) => entry.category)).size).toBe(10);
    for (const entry of entries) {
      expect(entry.name, entry.slug).toBeTruthy();
      expect(entry.palette, entry.slug).toBeTruthy();
      expect(entry.description, entry.slug).toBeTruthy();
      expect(entry.eventFit.length, entry.slug).toBeGreaterThan(0);
      expect(entry.renderer, entry.slug).toBeTypeOf("function");
    }
  });

  test("exposes tiers and event fit for the catalogue filters", () => {
    const tiers = new Set(Object.values(registry).map((entry) => entry.tier));
    expect(tiers).toEqual(new Set(["Basic", "Premium", "Eksklusif", "Luxury"]));
    for (const entry of Object.values(registry)) {
      expect(["wedding", "other"]).toContain(entry.eventFit[0]);
      expect(entry.isPremium).toBe(entry.tier !== "Basic");
    }
  });

  test("legacy event slugs resolve to the new designs", () => {
    expect(TEMPLATE_ALIASES).toEqual({
      "wedding-classic": "lilac-flower",
      "birthday-celebration": "warm-story",
      "baby-shower": "cypress-minimal",
      "graduation-modern": "editorial-dark",
    });

    for (const [legacy, canonical] of Object.entries(TEMPLATE_ALIASES)) {
      expect(resolveTemplateSlug(legacy)).toBe(canonical);
      expect(getTemplate(legacy)?.slug).toBe(canonical);
      expect(getRenderer(legacy)).toBe(registry[canonical].renderer);
    }
  });

  test("unknown slugs fall back without throwing", () => {
    expect(resolveTemplateSlug("unknown")).toBeNull();
    expect(getTemplate("unknown")).toBeNull();
    expect(getRenderer("unknown")).toBeTypeOf("function");
  });
});
