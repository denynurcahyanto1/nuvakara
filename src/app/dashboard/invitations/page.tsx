import { requireUser } from "@/lib/dal/auth";
import { getEventsByOwner } from "@/lib/dal/events";
import Link from "next/link";
import { publishEventAction, unpublishEventAction, deleteEventAction, duplicateEventAction } from "@/lib/actions/events";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Undangan Saya" };

export default async function InvitationsPage() {
  const profile = await requireUser();
  const events = await getEventsByOwner(profile.id);

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            Undangan Saya
          </p>
          <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
            Kelola Undangan
          </h1>
          <p className="mt-1 text-sm text-muted">
            {events.length} undangan total
          </p>
        </div>
        <Link
          href="/dashboard/invitations/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-ivory rounded-xl font-medium hover:bg-navy/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Baru
        </Link>
      </header>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/10 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-navy/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 15h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v12c0 .552.448 1 1 1z"
            />
          </svg>
          <h3 className="mt-4 font-display text-xl text-navy">Belum ada undangan</h3>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            Mulai buat undangan digital pertama Anda. Pilih template, isi detail, dan bagikan ke tamu.
          </p>
          <Link
            href="/dashboard/invitations/new"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-navy text-ivory rounded-xl font-medium hover:bg-navy/90 transition-colors"
          >
            Buat Undangan Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-muted border-b border-navy/10 bg-navy/5">
                  <th className="p-4">Undangan</th>
                  <th className="p-4 hidden md:table-cell">Tanggal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-navy/5 hover:bg-navy/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-navy">{event.name}</p>
                      <p className="text-sm text-muted truncate max-w-xs">{event.slug}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted">
                      {event.created_at
                        ? new Date(event.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/invitations/${event.id}/guests`}
                          className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
                        >
                          Tamu
                        </Link>
                        <Link
                          href={`/dashboard/invitations/${event.id}/edit`}
                          className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/invitations/${event.id}/preview`}
                          className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
                        >
                          Pratinjau
                        </Link>
                        {event.is_published && event.is_active ? (
                          <form action={unpublishEventAction}>
                            <input type="hidden" name="id" value={event.id.toString()} />
                            <button
                              type="submit"
                              className="text-sm font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2"
                            >
                              Batal Publikasi
                            </button>
                          </form>
                        ) : (
                          <form action={publishEventAction}>
                            <input type="hidden" name="id" value={event.id.toString()} />
                            <button
                              type="submit"
                              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                            >
                              Publikasikan
                            </button>
                          </form>
                        )}
                        <form action={duplicateEventAction}>
                          <input type="hidden" name="id" value={event.id.toString()} />
                          <button
                            type="submit"
                            className="text-sm font-medium text-navy hover:text-gold-deep underline underline-offset-2"
                          >
                            Duplikat
                          </button>
                        </form>
                        <form action={deleteEventAction}>
                          <input type="hidden" name="id" value={event.id.toString()} />
                          <button
                            type="submit"
                            className="text-sm font-medium text-red-600 hover:text-red-700 underline underline-offset-2"
                          >
                            Arsipkan
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}