import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { Input } from "@/components/ui/Input";
import { registerAction } from "@/lib/actions/auth";
import { getUser } from "@/lib/dal/auth";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun NUVAKARA dan mulai membuat undangan digital Anda.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const next = params.next ?? "";

  return (
    <AuthShell
      title="Buat akun Anda"
      subtitle="Gratis, dan butuh waktu kurang dari satu menit."
      highlights={[
        {
          title: "Satu undangan gratis",
          description: "Cukup untuk acara pertama Anda, kapan pun.",
        },
        {
          title: "Tanpa biaya tersembunyi",
          description: "Tidak ada biaya setup, tidak ada biaya bulanan untuk paket gratis.",
        },
        {
          title: "Data Anda milik Anda",
          description: "Row Level Security menjaga setiap undangan tetap milik pemiliknya.",
        },
      ]}
      footer={
        <p className="text-sm text-muted">
          Sudah punya akun?{" "}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="font-medium text-navy underline underline-offset-4 hover:text-gold-deep"
          >
            Masuk di sini
          </Link>
        </p>
      }
    >
      <AuthForm action={registerAction} submitLabel="Daftar">
        {(fields) => (
          <>
            <input type="hidden" name="next" value={next} />
            <Input
              name="fullName"
              label="Nama lengkap"
              autoComplete="name"
              placeholder="Nama Anda"
              error={fields.fullName}
            />
            <Input
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="nama@email.com"
              error={fields.email}
            />
            <PasswordField
              name="password"
              label="Kata sandi"
              autoComplete="new-password"
              hint="Minimal 8 karakter, mengandung huruf dan angka."
              error={fields.password}
            />
            <PasswordField
              name="confirmPassword"
              label="Konfirmasi kata sandi"
              autoComplete="new-password"
              error={fields.confirmPassword}
            />
          </>
        )}
      </AuthForm>
    </AuthShell>
  );
}
