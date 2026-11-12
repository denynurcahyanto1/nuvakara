import { getEventById } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  // Ensure owner is authenticated
  const user = await requireUser();
  const event = await getEventById(eventId);

  if (!event || event.owner_id !== user.id) {
    notFound();
  }

  return (
    <TemplateDispatcher
      slug={event.template_slug || "default"}
      data={(event.template_data as Record<string, unknown>) || {}}
    />
  );
}
