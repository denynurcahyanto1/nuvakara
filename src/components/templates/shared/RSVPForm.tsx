"use client";

import { useActionState } from "react";
import { createRSVPAction } from "@/lib/actions/events-rsvp";

export const RSVPForm = ({ eventId }: { eventId: number }) => {
  const [state, action, pending] = useActionState(createRSVPAction, { ok: false });

  return (
    <form action={action} className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
      <input type="hidden" name="event_id" value={eventId} />
      <div>
        <label className="block text-sm font-medium">Nama</label>
        <input name="name" required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Hadir?</label>
        <select name="attendance" className="w-full border p-2 rounded">
          <option value="true">Hadir</option>
          <option value="false">Tidak Hadir</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Pesan</label>
        <textarea name="message" className="w-full border p-2 rounded" />
      </div>
      <button type="submit" disabled={pending} className="bg-blue-600 text-white px-4 py-2 rounded">
        {pending ? "Mengirim..." : "Kirim RSVP"}
      </button>
      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.ok && <p className="text-green-500">Berhasil!</p>}
    </form>
  );
};
