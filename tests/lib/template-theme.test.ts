import { describe, expect, test } from "vitest";
import {
  TEMPLATE_ALIASES,
  canonicalTemplateSlug,
  resolveTheme,
  themeStyle,
  themes,
} from "@/components/templates/shared/theme";

const CANONICAL_SLUGS = [
  "floral-ivory",
  "elegan-maison",
  "dark-noir",
  "fleksibel-cerita",
  "adat-sekar",
  "minimalis-lumen",
  "islami-nurani",
  "vintage-sepia",
  "animasi-kinetic",
  "game-levelup",
];

describe("template themes", () => {
  test("ships one theme per design category", () => {
    expect(Object.keys(themes)).toHaveLength(10);
    for (const slug of CANONICAL_SLUGS) {
      expect(themes[slug], slug).toBeDefined();
    }
    expect(new Set(Object.values(themes).map((theme) => theme.category)).size).toBe(10);
  });

  test("every theme defines the tokens shared blocks read", () => {
    for (const [slug, theme] of Object.entries(themes)) {
      const style = themeStyle(theme) as Record<string, string>;
      for (const token of [
        "--inv-bg",
        "--inv-surface",
        "--inv-ink",
        "--inv-muted",
        "--inv-accent",
        "--inv-accent-soft",
        "--inv-on-accent",
        "--inv-line",
        "--inv-font-display",
        "--inv-font-body",
        "--inv-radius",
      ]) {
        expect(style[token], `${slug} ${token}`).toBeTruthy();
      }
    }
  });

  test("legacy slugs resolve to the new templates", () => {
    expect(Object.keys(TEMPLATE_ALIASES)).toHaveLength(4);
    for (const [oldSlug, newSlug] of Object.entries(TEMPLATE_ALIASES)) {
      expect(canonicalTemplateSlug(oldSlug)).toBe(newSlug);
      expect(themes[newSlug]).toBeDefined();
    }
  });

  test("unknown slugs fall back to the brand theme instead of throwing", () => {
    expect(canonicalTemplateSlug("does-not-exist")).toBeNull();
    expect(resolveTheme("does-not-exist").slug).toBe("floral-ivory");
  });
});
