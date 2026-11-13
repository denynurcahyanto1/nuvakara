"use client";

import { useActionState } from "react";
import { createGuestbookMessageAction } from "@/lib/actions/events-rsvp";

export const Guestbook = ({ eventId, messages = [] }: { eventId: number; messages?: { name: string; content: string }[] }) => {
  const [state, action, pending] = useActionState(createGuestbookMessageAction, { ok: false });

  return (
    <div className="space-y-8 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold">Buku Tamu</h2>
      
      <form action={action} className="space-y-4">
        <input type="hidden" name="event_id" value={eventId} />
        <input name="name" placeholder="Nama Anda" required className="w-full border p-2 rounded" />
        <textarea name="content" placeholder="Pesan Anda" required className="w-full border p-2 rounded" />
        <button type="submit" disabled={pending} className="bg-green-600 text-white px-4 py-2 rounded">
          {pending ? "Mengirim..." : "Kirim Pesan"}
        </button>
        {state.error && <p className="text-red-500">{state.error}</p>}
      </form>

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="border-b pb-2">
            <p className="font-bold text-sm">{m.name}</p>
            <p className="text-gray-700">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
