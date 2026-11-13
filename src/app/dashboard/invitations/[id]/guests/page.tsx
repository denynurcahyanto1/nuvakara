import { getEventById, getRSVPs, getVisitorCount } from "@/lib/dal/events";
import { GuestTable } from "@/components/dashboard/GuestTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { VisitorStats } from "@/components/dashboard/VisitorStats";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) notFound();

  const event = await getEventById(eventId);
  if (!event) notFound();

  const [rsvps, visitorCount] = await Promise.all([
    getRSVPs(eventId),
    getVisitorCount(eventId),
  ]);

  const total = rsvps.length;
  const hadir = rsvps.filter((r) => r.attendance).length;
  const tidakHadir = total - hadir;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/invitations`}
          className="p-2 rounded-lg border hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Tamu & RSVP</h1>
          <p className="text-sm text-muted-foreground">
            Acara: {event.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard total={total} hadir={hadir} tidakHadir={tidakHadir} />
        <VisitorStats count={visitorCount} />
      </div>

      <GuestTable initialGuests={rsvps} eventId={eventId} />
    </div>
  );
}
