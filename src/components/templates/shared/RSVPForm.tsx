"use client";

import { useActionState } from "react";
import { createRSVPAction } from "@/lib/actions/events-rsvp";

const inputClass =
  "w-full rounded-xl border border-[#C6A15B]/35 bg-white/80 px-4 py-3 text-[15px] text-[#141C2B] placeholder:text-[#141C2B]/35 outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/25";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7D5F28]";

export const RSVPForm = ({ eventId }: { eventId: number }) => {
  const [state, action, pending] = useActionState(createRSVPAction, { ok: false });

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-[#C6A15B]/30 bg-white/70 px-6 py-10 text-center">
        <p className="font-serif text-2xl text-[#141C2B]">Terima kasih!</p>
        <p className="mt-2 text-sm text-[#141C2B]/60">
          Konfirmasi kehadiran Anda sudah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-[#C6A15B]/25 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(20,28,43,0.45)] backdrop-blur-sm sm:p-8"
    >
      <input type="hidden" name="event_id" value={eventId} />

      <header className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C6A15B]">
          RSVP
        </p>
        <h2 className="mt-2 font-serif text-2xl text-[#141C2B] sm:text-3xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="mt-2 text-sm text-[#141C2B]/55">
          Beritahu kami apakah Anda dapat hadir.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label htmlFor="rsvp-name" className={labelClass}>
            Nama
          </label>
          <input
            id="rsvp-name"
            name="name"
            required
            placeholder="Nama lengkap Anda"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="rsvp-attendance" className={labelClass}>
            Kehadiran
          </label>
          <select id="rsvp-attendance" name="attendance" className={inputClass}>
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
            placeholder="Doa atau pesan untuk tuan rumah"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#141C2B] px-8 text-sm font-medium tracking-wide text-[#FBF7F0] transition hover:bg-[#1F2A3D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Kirim Konfirmasi"}
      </button>

      {state.error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
    </form>
  );
};
