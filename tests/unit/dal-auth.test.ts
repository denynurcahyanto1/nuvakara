import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted, so the mocks must be created with
// vi.hoisted() to be available when the factory runs.
const { createClient, createAdminClient } = vi.hoisted(() => ({
  createClient: vi.fn(),
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient }));

import {
  ensureAdminRole,
  isAdminEmail,
  requireAdmin,
  requireUser,
} from "@/lib/dal/auth";

const profile = (overrides: Record<string, unknown> = {}) => ({
  id: "11111111-1111-1111-1111-111111111111",
  email: "guest@example.com",
  full_name: "Guest",
  phone: null,
  avatar_url: null,
  role: "user",
  status: "active",
  timezone: "Asia/Jakarta",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

/** Redirects in Next throw an error carrying a digest like NEXT_REDIRECT;replace;/login */
function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string })?.digest ?? "";
  const match = digest.match(/NEXT_REDIRECT;[^;]*;([^;]+)/);
  return match ? match[1] : "";
}

function fakeServerClient(options: {
  user?: { id: string; email?: string } | null;
  row?: Record<string, unknown> | null;
}) {
  const select = vi.fn(() => ({
    eq: vi.fn(() => ({ maybeSingle: vi.fn(async () => ({ data: options.row ?? null, error: null })) })),
  }));

  return {
    auth: { getUser: vi.fn(async () => ({ data: { user: options.user ?? null }, error: null })) },
    from: vi.fn(() => ({ select })),
  } as never;
}

describe("isAdminEmail", () => {
  it("mencocokkan email dari daftar ADMIN_EMAILS, mengabaikan whitespace dan case", () => {
    expect(isAdminEmail("admin@example.com", "admin@example.com")).toBe(true);
    expect(isAdminEmail(" Admin@Example.com ", "admin@example.com, other@x.com")).toBe(true);
  });

  it("tidak cocok untuk email yang tidak terdaftar atau daftar kosong", () => {
    expect(isAdminEmail("guest@example.com", "admin@example.com")).toBe(false);
    expect(isAdminEmail("admin@example.com", "")).toBe(false);
    expect(isAdminEmail("admin@example.com", undefined)).toBe(false);
    expect(isAdminEmail(null, "admin@example.com")).toBe(false);
  });
});

describe("requireUser", () => {
  beforeEach(() => {
    createClient.mockReset();
    createAdminClient.mockReset();
  });

  it("mengarahkan ke /login ketika belum masuk", async () => {
    createClient.mockResolvedValue(fakeServerClient({ user: null, row: null }));

    await expect(requireUser()).rejects.toThrow();
    try {
      await requireUser();
    } catch (error) {
      expect(redirectTarget(error)).toContain("/login");
    }
  });

  it("mengarahkan ke /login?suspended=1 untuk akun yang ditangguhkan", async () => {
    createClient.mockResolvedValue(
      fakeServerClient({
        user: { id: "11111111-1111-1111-1111-111111111111" },
        row: profile({ status: "suspended" }),
      }),
    );

    try {
      await requireUser();
      throw new Error("expected a redirect");
    } catch (error) {
      expect(redirectTarget(error)).toContain("suspended=1");
    }
  });

  it("mengembalikan profil untuk pengguna aktif", async () => {
    createClient.mockResolvedValue(
      fakeServerClient({
        user: { id: "11111111-1111-1111-1111-111111111111" },
        row: profile(),
      }),
    );

    await expect(requireUser()).resolves.toMatchObject({ role: "user" });
  });
});

describe("requireAdmin", () => {
  beforeEach(() => {
    createClient.mockReset();
  });

  it("mengarahkan pengguna biasa ke /dashboard", async () => {
    createClient.mockResolvedValue(
      fakeServerClient({
        user: { id: "11111111-1111-1111-1111-111111111111" },
        row: profile({ role: "user" }),
      }),
    );

    try {
      await requireAdmin();
      throw new Error("expected a redirect");
    } catch (error) {
      expect(redirectTarget(error)).toContain("/dashboard");
    }
  });

  it("mengembalikan profil untuk admin", async () => {
    createClient.mockResolvedValue(
      fakeServerClient({
        user: { id: "11111111-1111-1111-1111-111111111111" },
        row: profile({ role: "admin" }),
      }),
    );

    await expect(requireAdmin()).resolves.toMatchObject({ role: "admin" });
  });
});

describe("ensureAdminRole", () => {
  const originalAdminEmails = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    createAdminClient.mockReset();
    process.env.ADMIN_EMAILS = "admin@example.com, other@example.com";
  });

  afterEach(() => {
    if (originalAdminEmails === undefined) {
      delete process.env.ADMIN_EMAILS;
    } else {
      process.env.ADMIN_EMAILS = originalAdminEmails;
    }
  });

  function fakeAdminClient(updateRows: Record<string, unknown>[]) {
    const insert = vi.fn(async () => ({ error: null }));

    const update = vi.fn(() => ({
      eq: vi.fn(() => ({
        neq: vi.fn(() => ({
          select: vi.fn(async () => ({ data: updateRows, error: null })),
        })),
      })),
    }));

    return {
      from: vi.fn((table: string) =>
        table === "admin_activity_logs" ? { insert } : { update },
      ),
      __insert: insert,
      __update: update,
    } as never;
  }

  it("mempromosikan email yang terdaftar dan menulis satu audit log", async () => {
    const admin = fakeAdminClient([
      { id: "11111111-1111-1111-1111-111111111111" },
    ]);
    createAdminClient.mockReturnValue(admin);

    const result = await ensureAdminRole(profile({ email: "admin@example.com" }));

    expect(result.role).toBe("admin");
    expect((admin as unknown as { __insert: ReturnType<typeof vi.fn> }).__insert)
      .toHaveBeenCalledTimes(1);
  });

  it("tidak menaikkan peran email yang tidak terdaftar", async () => {
    const admin = fakeAdminClient([]);
    createAdminClient.mockReturnValue(admin);

    const result = await ensureAdminRole(profile({ email: "guest@example.com" }));

    expect(result.role).toBe("user");
    expect((admin as unknown as { __insert: ReturnType<typeof vi.fn> }).__insert)
      .not.toHaveBeenCalled();
  });

  it("idempoten: admin yang sudah admin tidak memicu audit log baru", async () => {
    const admin = fakeAdminClient([]);
    createAdminClient.mockReturnValue(admin);

    const result = await ensureAdminRole(
      profile({ email: "admin@example.com", role: "admin" }),
    );

    expect(result.role).toBe("admin");
    expect((admin as unknown as { __insert: ReturnType<typeof vi.fn> }).__insert)
      .not.toHaveBeenCalled();
  });
});
