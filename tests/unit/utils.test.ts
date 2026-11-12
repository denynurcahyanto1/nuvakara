import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber, slugify } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class dan menghapus konflikt", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("slugify", () => {
  it("menghasilkan slug aman untuk URL", () => {
    expect(slugify("Rafi & Aisyah")).toBe("rafi-aisyah");
    expect(slugify("  Wisuda 2026!  ")).toBe("wisuda-2026");
  });
});

describe("format", () => {
  it("memformat angka dan rupiah", () => {
    expect(formatNumber(12345)).toBe("12.345");
    expect(formatCurrency(150000)).toContain("150.000");
  });
});
