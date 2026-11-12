import { requireUser } from "@/lib/dal/auth";
import { getEventsByOwner } from "@/lib/dal/events";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await requireUser();
  const events = await getEventsByOwner(profile.id);

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.is_published && e.is_active).length;
  const draftEvents = events.filter((e) => !e.is_published && e.is_active).length;
  const archivedEvents = events.filter((e) => !e.is_active).length;

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            Dasbor
          </p>
          <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
            Selamat datang, {profile.full_name || profile.email}
          </h1>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          title="Total Undangan"
          value={totalEvents}
          description="undangan terdaftar"
          icon="invitation"
        />
        <StatCard
          title="Terpublikasi"
          value={publishedEvents}
          description="dapat diakses tamu"
          icon="check"
        />
        <StatCard
          title="Draft"
          value={draftEvents}
          description="belum dipublikasikan"
          icon="templates"
        />
        <StatCard
          title="Arsip"
          value={archivedEvents}
          description="tidak aktif"
          icon="close"
        />
      </div>

      <section className="bg-white rounded-2xl border border-navy/10 shadow-soft">
        <div className="p-6 border-b border-navy/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-display text-xl text-navy">Undangan Terbaru</h2>
          <a
            href="/dashboard/invitations"
            className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
          >
            Lihat semua
          </a>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted mb-4">Belum ada undangan. Mulai buat yang pertama!</p>
            <a
              href="/dashboard/invitations/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-ivory rounded-xl font-medium hover:bg-navy/90 transition-colors"
            >
              Buat Undangan Baru
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-muted border-b border-navy/10">
                  <th className="p-4">Undangan</th>
                  <th className="p-4 hidden md:table-cell">Tanggal</th>
                  <th className="p-4 hidden lg:table-cell">Tamu</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id} className="border-b border-navy/5 hover:bg-navy/5">
                    <td className="p-4">
                      <p className="font-medium text-navy">{event.name}</p>
                      <p className="text-sm text-muted truncate max-w-xs">{event.slug}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted">
                      {event.created_at
                        ? new Date(event.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted">—</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.is_published && event.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : event.is_active
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {event.is_published && event.is_active
                          ? "Dipublikasikan"
                          : event.is_active
                          ? "Draft"
                          : "Diarsipkan"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`/dashboard/invitations/${event.id}/edit`}
                        className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}