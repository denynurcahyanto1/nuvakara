"use client";

import { useState } from "react";
import { Database } from "@/types/database";
import { toggleAttendance, deleteRSVPAction } from "@/app/actions/guests";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

type RSVPItem = Database["public"]["Tables"]["rsvps"]["Row"];

interface GuestTableProps {
  initialGuests: RSVPItem[];
  eventId: number;
}

export function GuestTable({ initialGuests, eventId }: GuestTableProps) {
  const [guests, setGuests] = useState<RSVPItem[]>(initialGuests);
  const [filter, setFilter] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filteredGuests = guests.filter((g) => {
    if (filter === "all") return true;
    if (filter === "hadir") return g.attendance === true;
    if (filter === "tidak") return g.attendance === false;
    return true;
  });

  const handleToggle = async (id: number, current: boolean) => {
    setLoadingId(id);
    const res = await toggleAttendance(id, current);
    if (res.ok) {
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, attendance: !current } : g))
      );
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus tamu ini?")) return;
    setLoadingId(id);
    const res = await deleteRSVPAction(id, eventId);
    if (res.ok) {
      setGuests((prev) => prev.filter((g) => g.id !== id));
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-xs rounded border transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          Semua ({guests.length})
        </button>
        <button
          onClick={() => setFilter("hadir")}
          className={`px-3 py-1 text-xs rounded border transition-colors ${
            filter === "hadir" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          Hadir
        </button>
        <button
          onClick={() => setFilter("tidak")}
          className={`px-3 py-1 text-xs rounded border transition-colors ${
            filter === "tidak" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          Tidak Hadir
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Nama Tamu</th>
              <th className="text-left p-3 font-medium">Status Kehadiran</th>
              <th className="text-left p-3 font-medium">Pesan</th>
              <th className="text-right p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  Tidak ada data tamu.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium">{guest.name}</td>
                  <td className="p-3">
                    <button
                      disabled={loadingId === guest.id}
                      onClick={() => handleToggle(guest.id, guest.attendance)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full font-medium transition-colors ${
                        guest.attendance
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {guest.attendance ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Hadir
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Tidak Hadir
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-muted-foreground">{guest.message || "-"}</td>
                  <td className="p-3 text-right">
                    <button
                      disabled={loadingId === guest.id}
                      onClick={() => handleDelete(guest.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"
                      title="Hapus tamu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
