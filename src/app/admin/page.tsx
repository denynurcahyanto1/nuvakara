import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

interface Stat {
  label: string;
  value: number | string;
  hint: string;
}

async function loadStats() {
  const admin = createAdminClient();
  if (!admin) {
    return {
      available: false as const,
      stats: [] as Stat[],
      recentProfiles: [] as { email: string | null; full_name: string | null; role: string | null }[],
      recentEvents: [] as { name: string; slug: string; is_published: boolean | null }[],
    };
  }

  const [profiles, events, published, plans] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("events").select("id", { count: "exact", head: true }),
    admin
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    admin.from("pricing_plans").select("id", { count: "exact", head: true }),
  ]);

  const recentProfiles = await admin
    .from("profiles")
    .select("email, full_name, role")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentEvents = await admin
    .from("events")
    .select("name, slug, is_published")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    available: true as const,
    stats: [
      { label: "Pengguna", value: profiles.count ?? 0, hint: "total akun terdaftar" },
      { label: "Undangan", value: events.count ?? 0, hint: "seluruh undangan" },
      { label: "Terbit", value: published.count ?? 0, hint: "dapat diakses tamu" },
      { label: "Paket", value: plans.count ?? 0, hint: "paket harga aktif" },
    ] as Stat[],
    recentProfiles: recentProfiles.data ?? [],
    recentEvents: recentEvents.data ?? [],
  };
}

export default async function AdminPage() {
  const profile = await requireAdmin();
  const { available, stats, recentProfiles, recentEvents } = await loadStats();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
          Admin
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Ringkasan Platform
        </h1>
        <p className="mt-2 text-sm text-muted">
          Masuk sebagai {profile.email}.
        </p>
      </header>

      {!available ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi, sehingga statistik admin
          tidak dapat dimuat.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-navy/10 bg-white p-5 shadow-soft"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-3xl text-navy">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-navy/10 bg-white">
              <h2 className="border-b border-navy/10 px-5 py-4 font-display text-lg text-navy">
                Pengguna Terbaru
              </h2>
              <ul className="divide-y divide-navy/5">
                {recentProfiles.length === 0 ? (
                  <li className="px-5 py-4 text-sm text-muted">Belum ada data.</li>
                ) : (
                  recentProfiles.map((item, index) => (
                    <li
                      key={`${item.email}-${index}`}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy">
                          {item.full_name || "(tanpa nama)"}
                        </p>
                        <p className="truncate text-xs text-muted">{item.email}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-navy/5 px-2.5 py-0.5 text-xs capitalize text-navy/70">
                        {item.role ?? "user"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-navy/10 bg-white">
              <h2 className="border-b border-navy/10 px-5 py-4 font-display text-lg text-navy">
                Undangan Terbaru
              </h2>
              <ul className="divide-y divide-navy/5">
                {recentEvents.length === 0 ? (
                  <li className="px-5 py-4 text-sm text-muted">Belum ada data.</li>
                ) : (
                  recentEvents.map((item) => (
                    <li
                      key={item.slug}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-muted">/{item.slug}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
                          item.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.is_published ? "Terbit" : "Draft"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
