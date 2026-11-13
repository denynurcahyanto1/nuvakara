import { describe, expect, test } from "vitest";
import {
  TEMPLATE_ALIASES,
  canonicalTemplateSlug,
  resolveTheme,
  themeStyle,
  themes,
} from "@/components/templates/shared/theme";

const CANONICAL_SLUGS = [
  "lilac-flower",
  "cypress-linen",
  "cypress-elegan",
  "arabix",
  "arabian-gold-pattern",
  "film-roll",
  "film-roll-cinematic",
  "whimsical-colorful",
  "joglo-3d-kertas",
  "playful-playdate",
  "joglo-adat",
  "cypress-minimal",
  "warm-story",
  "editorial-dark",
];

describe("template themes", () => {
  test("ships one theme per design category", () => {
    expect(Object.keys(themes)).toHaveLength(14);
    for (const slug of CANONICAL_SLUGS) {
      expect(themes[slug], slug).toBeDefined();
    }
    // Categories are: "Floral", "Elegan", "Islami", "Vintage", "Animasi & 3D", "Game", "Adat", "Minimalis", "Desain fleksibel", "Dark & moody" (10 total)
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
    expect(resolveTheme("does-not-exist").slug).toBe("lilac-flower");
  });
});
