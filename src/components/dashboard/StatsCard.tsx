import { Users, UserCheck, UserX } from "lucide-react";

interface StatsCardProps {
  total: number;
  hadir: number;
  tidakHadir: number;
}

export function StatsCard({ total, hadir, tidakHadir }: StatsCardProps) {
  const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Total Respon</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-lg bg-green-50 text-green-600">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Konfirmasi Hadir</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{hadir}</p>
            <span className="text-xs text-muted-foreground font-medium">({rate}%)</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-lg bg-red-50 text-red-600">
          <UserX className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Tidak Bisa Hadir</p>
          <p className="text-2xl font-bold">{tidakHadir}</p>
        </div>
      </div>
    </div>
  );
}
