import { requireUser } from "@/lib/dal/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await requireUser();

  return (
    <div className="container-page py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
        Dasbor
      </p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
        Selamat datang, {profile.full_name || profile.email}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Undangan, tamu, dan statistik Anda akan tampil di sini. Manajemen
        undangan lengkap hadir pada tahap berikutnya.
      </p>
    </div>
  );
}
