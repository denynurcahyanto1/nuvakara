"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";
import { createRSVPAction } from "@/lib/actions/events-rsvp";
import { SectionLabel } from "./SectionLabel";

const inputClass =
  "w-full rounded-[calc(var(--inv-radius)/2)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-4 py-3 text-[15px] text-[var(--inv-ink)] placeholder:text-[var(--inv-muted)] placeholder:opacity-70 outline-none transition focus:border-[var(--inv-accent)] focus:ring-2 focus:ring-[var(--inv-accent-soft)]";

const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--inv-muted)]";

export interface RSVPFormProps {
  /** Absent on `/template/[slug]`, where the form is a visual preview. */
  eventId?: number;
  readOnly?: boolean;
  className?: string;
}

export function RSVPForm({ eventId, readOnly = false, className }: RSVPFormProps) {
  const [state, action, pending] = useActionState(createRSVPAction, { ok: false });
  const preview = readOnly || typeof eventId !== "number";

  if (state.ok && !preview) {
    return (
      <div
        className={cn(
          "rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-6 py-10 text-center",
          className,
        )}
      >
        <p className="font-inv-display text-2xl text-[var(--inv-ink)]">
          Terima kasih!
        </p>
        <p className="mt-2 text-sm text-[var(--inv-muted)]">
          Konfirmasi kehadiran Anda sudah kami terima.
        </p>
      </div>
    );
  }

  return (
    <section id="rsvp" className={cn("px-6 py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-md">
        <SectionLabel>RSVP</SectionLabel>
        <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-[var(--inv-muted)]">
          Beritahu kami apakah Anda dapat hadir.
        </p>

        <form
          action={preview ? undefined : action}
          className="mt-6 rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-5 sm:p-7"
        >
          {!preview ? <input type="hidden" name="event_id" value={eventId} /> : null}

          <div className="space-y-4">
            <div>
              <label htmlFor="rsvp-name" className={labelClass}>
                Nama
              </label>
              <input
                id="rsvp-name"
                name="name"
                required={!preview}
                disabled={preview}
                placeholder="Nama lengkap Anda"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="rsvp-attendance" className={labelClass}>
                Kehadiran
              </label>
              <select
                id="rsvp-attendance"
                name="attendance"
                disabled={preview}
                className={inputClass}
              >
                <option value="true">Hadir</option>
                <option value="false">Tidak Hadir</option>
              </select>
            </div>

            <div>
              <label htmlFor="rsvp-message" className={labelClass}>
                Pesan (opsional)
              </label>
              <textarea
                id="rsvp-message"
                name="message"
                rows={3}
                disabled={preview}
                placeholder="Doa atau pesan untuk tuan rumah"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending || preview}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--inv-accent)] px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-on-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {preview ? "Formulir pratinjau" : pending ? "Mengirim…" : "Kirim Konfirmasi"}
          </button>

          {preview ? (
            <p className="mt-3 text-center text-[10px] leading-relaxed tracking-[0.08em] text-[var(--inv-muted)]">
              Pratinjau — formulir aktif pada undangan asli.
            </p>
          ) : null}

          {state.error && !preview ? (
            <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {state.error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
