import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(join(process.cwd(), file), "utf8");

describe("protected routes", () => {
  it("dashboard layout memanggil requireUser", () => {
    expect(read("src/app/dashboard/layout.tsx")).toContain("requireUser");
  });

  it("halaman profil memanggil requireUser", () => {
    expect(read("src/app/profile/page.tsx")).toContain("requireUser");
  });

  it("admin layout memanggil requireAdmin", () => {
    expect(read("src/app/admin/layout.tsx")).toContain("requireAdmin");
  });

  it("route logout menandatangani pengguna keluar", () => {
    expect(read("src/app/logout/route.ts")).toContain("logoutAction");
  });

  it("halaman profil menyediakan tombol keluar", () => {
    expect(read("src/app/profile/page.tsx")).toContain("logoutAction");
  });
});
