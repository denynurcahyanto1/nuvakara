import { getEventById } from "@/lib/dal/events";
import { requireUser } from "@/lib/dal/auth";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/invitations/EditEventForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  const user = await requireUser();
  const event = await getEventById(eventId);

  if (!event || event.owner_id !== user.id) {
    notFound();
  }

  return (
    <div className="container-page py-12 sm:py-16 max-w-xl">
      <h1 className="font-display text-3xl text-navy mb-6">Edit Undangan</h1>
      <EditEventForm event={event} />
    </div>
  );
}
