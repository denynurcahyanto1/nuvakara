import { getEventBySlug, getRSVPs, getGuestbook } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
import { RSVPForm } from "@/components/templates/shared/RSVPForm";
import { Guestbook } from "@/components/templates/shared/Guestbook";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.is_published || !event.is_active) {
    return { title: "Event Not Found" };
  }

  const title = event.name;
  const description = event.description || "You are invited!";
  const coverImage = event.cover_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.is_published || !event.is_active) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-12">
      <TemplateDispatcher
        slug={event.template_slug || "default"}
        data={(event.template_data as Record<string, unknown>) || {}}
      />
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <RSVPForm eventId={event.id} />
        <Guestbook eventId={event.id} messages={await getGuestbook(event.id)} />
      </div>
    </div>
  );
}
