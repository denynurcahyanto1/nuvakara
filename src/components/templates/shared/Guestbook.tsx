"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";
import { createGuestbookMessageAction } from "@/lib/actions/events-rsvp";
import type { GuestbookMessage } from "@/lib/templates-data";
import { SectionLabel } from "./SectionLabel";

const inputClass =
  "w-full rounded-[calc(var(--inv-radius)/2)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-4 py-3 text-[15px] text-[var(--inv-ink)] placeholder:text-[var(--inv-muted)] placeholder:opacity-70 outline-none transition focus:border-[var(--inv-accent)] focus:ring-2 focus:ring-[var(--inv-accent-soft)]";

export interface GuestbookProps {
  eventId?: number;
  messages?: GuestbookMessage[];
  readOnly?: boolean;
  className?: string;
}

export function Guestbook({ eventId, messages = [], readOnly = false, className }: GuestbookProps) {
  const [state, action, pending] = useActionState(createGuestbookMessageAction, { ok: false });
  const preview = readOnly || typeof eventId !== "number";

  return (
    <section id="ucapan" className={cn("px-6 py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-2xl">
        <SectionLabel>Buku Tamu</SectionLabel>
        <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
          Doa &amp; Ucapan
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-[var(--inv-muted)]">
          Tinggalkan doa dan ucapan hangat untuk acara ini.
        </p>

        <form
          action={preview ? undefined : action}
          className="mt-6 rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-5 sm:p-7"
        >
          {!preview ? <input type="hidden" name="event_id" value={eventId} /> : null}
          <div className="space-y-3">
            <input
              name="name"
              required={!preview}
              disabled={preview}
              placeholder="Nama Anda"
              className={inputClass}
              aria-label="Nama"
            />
            <textarea
              name="content"
              required={!preview}
              disabled={preview}
              rows={3}
              placeholder="Tulis ucapan atau doa…"
              className={`${inputClass} resize-none`}
              aria-label="Pesan"
            />
            <button
              type="submit"
              disabled={pending || preview}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--inv-accent)] px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-on-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {preview ? "Formulir pratinjau" : pending ? "Mengirim…" : "Kirim Ucapan"}
            </button>
          </div>

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
          {state.ok && !preview ? (
            <p className="mt-4 rounded-xl border border-[var(--inv-line)] bg-[var(--inv-accent-soft)] px-4 py-3 text-sm text-[var(--inv-ink)]">
              Ucapan Anda sudah terkirim. Terima kasih!
            </p>
          ) : null}
        </form>

        <div className="mt-8 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-[var(--inv-muted)]">
              Belum ada ucapan. Jadilah yang pertama.
            </p>
          ) : (
            messages.map((message, index) => (
              <article
                key={`${message.name}-${index}`}
                className="rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-4"
              >
                <p className="font-inv-display text-lg text-[var(--inv-ink)]">
                  {message.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                  {message.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
