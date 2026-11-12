import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("design tokens", () => {
  const required = [
    "--color-ivory",
    "--color-cream",
    "--color-champagne",
    "--color-gold",
    "--color-navy",
    "--color-navy-soft",
    "--color-blush",
    "--color-sage",
    "--font-display",
    "--font-sans",
    "--radius-card",
    "--shadow-soft",
    "--shadow-glow",
  ];

  it.each(required)("mendefinisikan token %s", (token) => {
    expect(css).toContain(token);
  });

  it("tidak memakai config tailwind terpisah (v4 css-first)", () => {
    expect(() => readFileSync(join(process.cwd(), "tailwind.config.js"), "utf8")).toThrow();
  });

  it("menyediakan utilitas mobile-first", () => {
    expect(css).toContain(".tap-target");
    expect(css).toContain(".safe-bottom");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("100dvh");
  });

  it("menghormati prefers-reduced-motion", () => {
    expect(css).toContain("prefers-reduced-motion");
  });
});
