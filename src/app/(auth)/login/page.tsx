import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getUser } from "@/lib/dal/auth";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun NUVAKARA untuk mengelola undangan Anda.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; suspended?: string; reset?: string }>;
}) {
  const user = await getUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const next = params.next ?? "";

  return (
    <AuthShell
      title="Masuk ke akun Anda"
      subtitle="Kelola undangan, tamu, dan statistik Anda di satu tempat."
      highlights={[
        {
          title: "Empat template premium",
          description: "Karakter visual berbeda untuk setiap jenis acara.",
        },
        {
          title: "RSVP & guestbook otomatis",
          description: "Tamu mengonfirmasi tanpa Anda perlu mengejar satu per satu.",
        },
        {
          title: "Siap dibagikan",
          description: "Satu tautan, dikirim lewat WhatsApp dalam hitungan detik.",
        },
      ]}
      footer={
        <div className="flex flex-col gap-3 text-sm text-muted">
          <p>
            Belum punya akun?{" "}
            <Link
              href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
              className="font-medium text-navy underline underline-offset-4 hover:text-gold-deep"
            >
              Daftar gratis
            </Link>
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex min-h-11 items-center font-medium text-navy/80 underline underline-offset-4 hover:text-navy"
          >
            Lupa kata sandi?
          </Link>
        </div>
      }
    >
      {params.suspended ? (
        <p
          role="status"
          className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          Akun Anda sedang ditangguhkan. Hubungi admin NUVAKARA untuk membuka
          akses kembali.
        </p>
      ) : null}

      {params.reset ? (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.
        </p>
      ) : null}

      <LoginForm next={next} />
    </AuthShell>
  );
}
