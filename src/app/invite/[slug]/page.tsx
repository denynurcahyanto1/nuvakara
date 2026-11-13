import { getEventBySlug, getGuestbook } from "@/lib/dal/events";
import { TemplateDispatcher } from "@/components/templates/registry";
import { RSVPForm } from "@/components/templates/shared/RSVPForm";
import { Guestbook } from "@/components/templates/shared/Guestbook";
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
    <div className="min-h-dvh bg-[#FBF7F0]">
      <TemplateDispatcher
        slug={event.template_slug || "wedding-classic"}
        data={templateData as unknown as Record<string, unknown>}
      />

      <section className="border-t border-[#C6A15B]/20 bg-gradient-to-b from-[#F6EFE4] to-[#FBF7F0] px-4 py-14 sm:py-20">
        <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-2">
          <RSVPForm eventId={event.id} />
          <Guestbook eventId={event.id} messages={messages} />
        </div>
      </section>

      <footer className="pb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#141C2B]/35">
        Dibuat dengan NUVAKARA
      </footer>
    </div>
  );
}
