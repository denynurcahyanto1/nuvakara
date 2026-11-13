import { Reveal } from "@/components/motion";
import { Countdown } from "../shared/Countdown";
import { Gallery } from "../shared/Gallery";
import { GiftInfo } from "../shared/GiftInfo";
import { Guestbook } from "../shared/Guestbook";
import { InvitationFooter } from "../shared/InvitationFooter";
import { InvitationShell } from "../shared/InvitationShell";
import { MapEmbed } from "../shared/MapEmbed";
import { RSVPForm } from "../shared/RSVPForm";
import { themes } from "../shared/theme";
import type { TemplateRenderProps } from "../types";
import { formatEventDate, formatEventTime, secondsUntil } from "@/lib/datetime";

const theme = themes["warm-story"];

export function WarmStory({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Our Story",
        title: names,
        subtitle: "A Warm Journey",
        date: data.date,
        image: portrait,
        variant: "arch",
      }}
      nav={[
        { id: "momen", label: "Story" },
        { id: "acara", label: "Events" },
        { id: "galeri", label: "Gallery" },
        { id: "lokasi", label: "Location" },
        { id: "rsvp", label: "RSVP" },
        { id: "ucapan", label: "Wishes" },
      ]}
    >
      <main className="mx-auto max-w-2xl px-6 py-12">
        <section id="momen" className="text-center">
          <Reveal>
            <h2 className="font-inv-display text-5xl text-[var(--inv-ink)]">{names}</h2>
            <p className="mt-4 text-sm text-[var(--inv-muted)]">{data.description || "A warm narrative of our special day."}</p>
            <div className="mt-12">
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
              />
            </div>
          </Reveal>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="mt-20">
            <Reveal>
              <Gallery images={data.images} />
            </Reveal>
          </section>
        ) : null}

        <div className="mt-20">
            
        {data.mapUrl ? (
          <section id="lokasi" className="mt-20">
            <Reveal>
              <MapEmbed
                url={data.mapUrl}
                href={data.mapsLink}
                venue={data.venue}
                address={data.address}
                city={data.city}
              />
            </Reveal>
          </section>
        ) : null}

        <GiftInfo gift={data.gift} />
            <RSVPForm eventId={eventId} readOnly={mode === "preview"} />
            <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />
        </div>

        <InvitationFooter signature={names} />
      </main>
    </InvitationShell>
  );
}