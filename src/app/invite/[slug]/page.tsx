import { getEventBySlug } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
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
    <TemplateDispatcher
      slug={event.template_slug || "default"}
      data={(event.template_data as Record<string, unknown>) || {}}
    />
  );
}
