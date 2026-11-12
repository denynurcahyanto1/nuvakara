import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

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
      <ForgotPasswordForm />
    </AuthShell>
  );
}
