import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createClient }));

import {
  forgotPasswordAction,
  loginAction,
  registerAction,
} from "@/lib/actions/auth";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import { safeNextPath } from "@/lib/utils";

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.append(key, value);
  return data;
}

function fakeClient(auth: {
  signUp?: ReturnType<typeof vi.fn>;
  signInWithPassword?: ReturnType<typeof vi.fn>;
  resetPasswordForEmail?: ReturnType<typeof vi.fn>;
}) {
  return {
    auth: {
      signUp: auth.signUp ?? vi.fn(async () => ({ data: {}, error: null })),
      signInWithPassword:
        auth.signInWithPassword ?? vi.fn(async () => ({ data: {}, error: null })),
      resetPasswordForEmail:
        auth.resetPasswordForEmail ??
        vi.fn(async () => ({ data: {}, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
    })),
  } as never;
}

describe("validation schemas", () => {
  it("email menolak input yang bukan email dan menormalkan casing", () => {
    expect(emailSchema.safeParse("bukan-email").success).toBe(false);
    expect(emailSchema.safeParse("  Guest@Example.COM ")).toMatchObject({
      success: true,
      data: "guest@example.com",
    });
  });

  it("password register menolak yang pendek dan tanpa angka", () => {
    const base = { fullName: "Tamu", email: "a@b.com", confirmPassword: "Rahasia123" };
    expect(registerSchema.safeParse({ ...base, password: "pendek" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, password: "abcdefghij" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, password: "Rahasia123" }).success).toBe(true);
  });

  it("konfirmasi kata sandi harus sama", () => {
    const result = registerSchema.safeParse({
      fullName: "Tamu",
      email: "a@b.com",
      password: "Rahasia123",
      confirmPassword: "Rahasia124",
    });
    expect(result.success).toBe(false);
  });

  it("login hanya mewajibkan password terisi", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("reset password memakai aturan yang sama dengan register", () => {
    expect(
      resetPasswordSchema.safeParse({ password: "Rahasia123", confirmPassword: "Rahasia123" })
        .success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({ password: "abc", confirmPassword: "abc" }).success,
    ).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("hanya mengizinkan path internal", () => {
    expect(safeNextPath("/dashboard/invitations")).toBe("/dashboard/invitations");
    expect(safeNextPath("https://evil.example.com")).toBeNull();
    expect(safeNextPath("//evil.example.com")).toBeNull();
    expect(safeNextPath("/\\evil.example.com")).toBeNull();
  });
});

describe("loginAction", () => {
  beforeEach(() => {
    createClient.mockReset();
  });

  it("memberi pesan yang sama untuk email tak terdaftar dan password salah", async () => {
    const unknown = { data: {}, error: { message: "Invalid login credentials" } };
    createClient.mockResolvedValue(fakeClient({ signInWithPassword: vi.fn(async () => unknown) }));

    const first = await loginAction(null, formData({ email: "a@b.com", password: "Salah123" }));

    const wrongPassword = { data: {}, error: { message: "Invalid login credentials" } };
    createClient.mockResolvedValue(
      fakeClient({ signInWithPassword: vi.fn(async () => wrongPassword) }),
    );

    const second = await loginAction(null, formData({ email: "a@b.com", password: "Salah456" }));

    expect(first).toEqual(second);
    expect((first as { error: string }).error).toMatch(/email atau kata sandi/i);
  });

  it("menolak input yang tidak valid sebelum menyentuh Supabase", async () => {
    createClient.mockResolvedValue(fakeClient({}));
    const result = await loginAction(null, formData({ email: "bukan-email", password: "" }));
    expect(result.ok).toBe(false);
    expect((result as { fields?: Record<string, string> }).fields).toBeDefined();
  });
});

describe("registerAction", () => {
  beforeEach(() => {
    createClient.mockReset();
  });

  it("mengembalikan state 'cek email' bila Supabase tidak mengembalikan session", async () => {
    createClient.mockResolvedValue(
      fakeClient({
        signUp: vi.fn(async () => ({ data: { session: null, user: { id: "1" } }, error: null })),
      }),
    );

    const result = await registerAction(
      null,
      formData({
        fullName: "Tamu Baru",
        email: "tamu@example.com",
        password: "Rahasia123",
        confirmPassword: "Rahasia123",
      }),
    );

    expect(result).toMatchObject({ ok: true, checkEmail: true });
  });

  it("menyampaikan pesan error nyata dari Supabase", async () => {
    createClient.mockResolvedValue(
      fakeClient({
        signUp: vi.fn(async () => ({
          data: {},
          error: { message: "User already registered" },
        })),
      }),
    );

    const result = await registerAction(
      null,
      formData({
        fullName: "Tamu Baru",
        email: "tamu@example.com",
        password: "Rahasia123",
        confirmPassword: "Rahasia123",
      }),
    );

    expect(result.ok).toBe(false);
    expect((result as { error: string }).error).toMatch(/already registered/i);
  });
});

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    createClient.mockReset();
  });

  it("selalu melaporkan sukses meski email tidak terdaftar", async () => {
    createClient.mockResolvedValue(
      fakeClient({
        resetPasswordForEmail: vi.fn(async () => ({
          data: {},
          error: { message: "User not found" },
        })),
      }),
    );

    const result = await forgotPasswordAction(null, formData({ email: "a@b.com" }));

    expect(result.ok).toBe(true);
  });

  it("menolak email yang tidak valid", async () => {
    createClient.mockResolvedValue(fakeClient({}));
    const result = await forgotPasswordAction(null, formData({ email: "bukan-email" }));
    expect(result.ok).toBe(false);
  });
});
