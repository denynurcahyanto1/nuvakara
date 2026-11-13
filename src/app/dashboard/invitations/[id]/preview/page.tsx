import { getEventById, getGuestbook } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
import { eventToTemplateData } from "@/lib/templates-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/dal/auth";

export const metadata: Metadata = {
  title: "Pratinjau Undangan",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (Number.isNaN(eventId)) {
    notFound();
  }

  // Ensure owner is authenticated
  const user = await requireUser();
  const event = await getEventById(eventId);

  if (!event || event.owner_id !== user.id) {
    notFound();
  }

  const templateData = eventToTemplateData(event);
  const messages = await getGuestbook(event.id);

  return (
    <div>
      <div className="sticky top-0 z-[90] flex items-center justify-between gap-3 border-b border-[#C6A15B]/30 bg-[#141C2B] px-4 py-2.5 text-[#FBF7F0]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#E3C68D]">
          Pratinjau {event.is_published ? "Publik" : "Draft"}
        </p>
        <a
          href={`/dashboard/invitations/${event.id}/edit`}
          className="rounded-full border border-[#E3C68D]/40 px-3 py-1 text-xs hover:bg-white/10"
        >
          Kembali ke editor
        </a>
      </div>
      <TemplateDispatcher
        slug={event.template_slug || "floral-ivory"}
        data={templateData}
        eventId={event.id}
        messages={messages}
        mode="preview"
      />
    </div>
  );
}
