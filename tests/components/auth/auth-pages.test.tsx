import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordField } from "@/components/auth/PasswordField";

const read = (file: string) =>
  readFileSync(join(process.cwd(), file), "utf8");

describe("PasswordField", () => {
  it("menyembunyikan kata sandi secara default dan menampilkannya saat tombol ditekan", async () => {
    render(<PasswordField name="password" label="Kata sandi" />);
    const input = screen.getByLabelText("Kata sandi");
    expect(input).toHaveAttribute("type", "password");

    const toggle = screen.getByRole("button", { name: /tampilkan kata sandi/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /sembunyikan kata sandi/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("menampilkan pesan error di dekat field", () => {
    render(<PasswordField name="password" label="Kata sandi" error="Wajib diisi" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Wajib diisi");
  });
});

describe("AuthForm", () => {
  it("menampilkan pesan error dari server dalam kotak alert", async () => {
    async function failingAction() {
      return { ok: false, error: "Email atau kata sandi salah." };
    }

    render(
      <AuthForm action={failingAction} submitLabel="Masuk">
        {() => <div />}
      </AuthForm>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email atau kata sandi salah.",
    );
  });

  it("menampilkan state 'cek email' setelah pendaftaran tanpa session", async () => {
    async function checkEmailAction() {
      return { ok: true, checkEmail: true } as const;
    }

    render(
      <AuthForm action={checkEmailAction} submitLabel="Daftar">
        {() => <div />}
      </AuthForm>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/cek email/i);
  });

  it("menyerahkan error field ke children", async () => {
    async function failingAction() {
      return {
        ok: false,
        error: "Periksa data Anda.",
        fields: { email: "Format email tidak valid." },
      };
    }

    render(
      <AuthForm action={failingAction} submitLabel="Masuk">
        {(fields) => <span data-testid="email-error">{fields.email}</span>}
      </AuthForm>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findByTestId("email-error")).toHaveTextContent(
      "Format email tidak valid.",
    );
  });
});

describe("auth pages", () => {
  const pages = [
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/register/page.tsx",
    "src/app/(auth)/forgot-password/page.tsx",
    "src/app/(auth)/reset-password/page.tsx",
  ];

  it.each(pages)("%s memakai form auth", (page) => {
    expect(read(page)).toMatch(
      /AuthForm|LoginForm|RegisterForm|ForgotPasswordForm|RecoveryForm/,
    );
  });

  it("halaman reset password memakai RecoveryForm (memproses tautan pemulihan)", () => {
    expect(read("src/app/(auth)/reset-password/page.tsx")).toContain("RecoveryForm");
  });

  it("halaman login mengarahkan pengunjung yang sudah masuk", () => {
    expect(read("src/app/(auth)/login/page.tsx")).toContain("getUser");
  });

  it("halaman login menampilkan/link ke lupa kata sandi", () => {
    const source = read("src/app/(auth)/login/page.tsx");
    expect(source).toContain("/forgot-password");
  });
});
