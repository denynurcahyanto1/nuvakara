import { Eye } from "lucide-react";

interface VisitorStatsProps {
  count: number;
}

export function VisitorStats({ count }: VisitorStatsProps) {
  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
        <Eye className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">Total Kunjungan Undangan</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
}
