import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RecoveryForm } from "@/components/auth/RecoveryForm";

export const metadata: Metadata = {
  title: "Kata sandi baru",
  description: "Buat kata sandi baru untuk akun NUVAKARA Anda.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Buat kata sandi baru"
      subtitle="Pastikan kata sandi baru berbeda dari kata sandi lama Anda."
      footer={
        <p className="text-sm text-muted">
          Tautan pemulihan sudah tidak berlaku?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-navy underline underline-offset-4 hover:text-gold-deep"
          >
            Minta tautan baru
          </Link>
        </p>
      }
    >
      <RecoveryForm />
    </AuthShell>
  );
}
