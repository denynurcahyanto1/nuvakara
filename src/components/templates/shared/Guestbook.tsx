"use client";

import { useActionState } from "react";
import { createGuestbookMessageAction } from "@/lib/actions/events-rsvp";

const inputClass =
  "w-full rounded-xl border border-[#C6A15B]/35 bg-white/80 px-4 py-3 text-[15px] text-[#141C2B] placeholder:text-[#141C2B]/35 outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25";

export const Guestbook = ({
  eventId,
  messages = [],
}: {
  eventId: number;
  messages?: { name: string; content: string }[];
}) => {
  const [state, action, pending] = useActionState(createGuestbookMessageAction, {
    ok: false,
  });

  return (
    <section className="rounded-2xl border border-[#C6A15B]/25 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(20,28,43,0.45)] backdrop-blur-sm sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C6A15B]">
          Guestbook
        </p>
        <h2 className="mt-2 font-serif text-2xl text-[#141C2B] sm:text-3xl">
          Buku Tamu
        </h2>
        <p className="mt-2 text-sm text-[#141C2B]/55">
          Tinggalkan doa dan ucapan hangat untuk acara ini.
        </p>
      </header>

      <form action={action} className="space-y-3">
        <input type="hidden" name="event_id" value={eventId} />
        <input
          name="name"
          required
          placeholder="Nama Anda"
          className={inputClass}
          aria-label="Nama"
        />
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Tulis ucapan atau doa…"
          className={`${inputClass} resize-none`}
          aria-label="Pesan"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#141C2B]/15 bg-[#C6A15B] px-8 text-sm font-medium tracking-wide text-[#141C2B] transition hover:bg-[#E3C68D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Mengirim…" : "Kirim Ucapan"}
        </button>

        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Ucapan Anda sudah terkirim. Terima kasih!
          </p>
        ) : null}
      </form>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[#141C2B]/45">
            Belum ada ucapan. Jadilah yang pertama.
          </p>
        ) : (
          messages.map((m, i) => (
            <article
              key={`${m.name}-${i}`}
              className="rounded-xl border border-[#C6A15B]/20 bg-[#FBF7F0]/80 px-4 py-3"
            >
              <p className="font-serif text-base text-[#141C2B]">{m.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#141C2B]/70">
                {m.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
