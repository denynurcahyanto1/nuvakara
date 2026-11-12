import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");
const harga = readFileSync(join(process.cwd(), "src/app/harga/page.tsx"), "utf8");

describe("landing page", () => {
  it("memuat hero, fitur, template, how-it-works, harga, dan footer", () => {
    for (const component of [
      "Hero",
      "Features",
      "TemplateShowcase",
      "HowItWorks",
      "Pricing",
      "Footer",
    ]) {
      expect(page).toContain(component);
    }
  });

  it("halaman harga tidak meng-hardcode harga (harus dari data)", () => {
    expect(harga).not.toMatch(/Rp\s?\d/);
  });

  it("landing memuat navbar dan CTA banner", () => {
    expect(page).toContain("Navbar");
    expect(page).toContain("CtaBanner");
  });

  it("halaman harga mengambil data dari DAL, bukan konstanta lokal", () => {
    expect(harga).toContain("getActivePlans");
  });

  it("landing memaksa render dinamis agar harga tidak basi", () => {
    expect(page).toContain("force-dynamic");
  });
});
