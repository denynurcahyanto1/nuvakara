import { getEventBySlug, getGuestbook } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
import { eventToTemplateData } from "@/lib/templates-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.is_published || !event.is_active) {
    return { title: "Undangan tidak ditemukan" };
  }

  const title = event.name;
  const description = event.description || "Anda diundang!";
  const coverImage = event.cover_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: coverImage ? [{ url: coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
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

  const templateData = eventToTemplateData(event);
  const messages = await getGuestbook(event.id);

  return (
    <TemplateDispatcher
      slug={event.template_slug || "floral-ivory"}
      data={templateData}
      eventId={event.id}
      messages={messages}
      mode="live"
    />
  );
}
