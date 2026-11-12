import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
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
      <RegisterForm next={next} />
    </AuthShell>
  );
}
