import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { requiresAuth } from "@/lib/supabase/session";

const read = (file: string) =>
  readFileSync(join(process.cwd(), file), "utf8");

describe("supabase clients", () => {
  it("server client memakai cookie getAll/setAll dan cookies() async", () => {
    const source = read("src/lib/supabase/server.ts");
    expect(source).toContain("createServerClient");
    expect(source).toContain("getAll");
    expect(source).toContain("setAll");
    expect(source).toContain("await cookies()");
  });

  it("admin client dibatasi server-only dan memakai service role key", () => {
    const source = read("src/lib/supabase/admin.ts");
    expect(source).toContain('import "server-only"');
    expect(source).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("session helper memverifikasi user lewat getUser", () => {
    const source = read("src/lib/supabase/session.ts");
    expect(source).toContain("getUser");
  });

  it("proxy hanya|match| route terlindungi, bukan semua route", () => {
    const source = read("src/proxy.ts");
    expect(source).toContain("matcher");
    expect(source).not.toContain('matcher: ["/"]');
  });
});

describe("requiresAuth", () => {
  it("mendeteksi prefix terlindungi dan turunannya", () => {
    expect(requiresAuth("/dashboard")).toBe(true);
    expect(requiresAuth("/dashboard/invitations/new")).toBe(true);
    expect(requiresAuth("/admin/users")).toBe(true);
    expect(requiresAuth("/profile")).toBe(true);
  });

  it("tidak mendeteksi halaman publik atau path yang mirip", () => {
    expect(requiresAuth("/")).toBe(false);
    expect(requiresAuth("/login")).toBe(false);
    expect(requiresAuth("/template")).toBe(false);
    expect(requiresAuth("/dashboardsyarat")).toBe(false);
    expect(requiresAuth("/administrator")).toBe(false);
  });
});
