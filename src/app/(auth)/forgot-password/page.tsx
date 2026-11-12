import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { forgotPasswordAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Lupa kata sandi",
  description: "Kirim tautan pemulihan akun NUVAKARA Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Lupa kata sandi?"
      subtitle="Masukkan email akun Anda dan kami akan mengirim tautan untuk membuat kata sandi baru."
      footer={
        <p className="text-sm text-muted">
          Ingat kata sandinya?{" "}
          <Link
            href="/login"
            className="font-medium text-navy underline underline-offset-4 hover:text-gold-deep"
          >
            Kembali ke halaman masuk
          </Link>
        </p>
      }
    >
      <AuthForm
        action={forgotPasswordAction}
        submitLabel="Kirim tautan pemulihan"
        successMessage="Jika email tersebut terdaftar, tautan pemulihan sudah dikirim. Silakan cek kotak masuk Anda."
      >
        {(fields) => (
          <Input
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="nama@email.com"
            error={fields.email}
          />
        )}
      </AuthForm>
    </AuthShell>
  );
}
