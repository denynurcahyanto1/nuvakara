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

const theme = themes["film-roll"];

export function FilmRoll({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Cinema The Wedding Of",
        title: names,
        subtitle: data.description || "The Grand Premiere",
        date: data.date,
        image: portrait,
        variant: "cinematic",
        note: "Admit One",
      }}
      nav={[
        { id: "momen", label: "Momen" },
        { id: "acara", label: "Acara" },
        { id: "galeri", label: "Galeri" },
        { id: "lokasi", label: "Lokasi" },
        { id: "rsvp", label: "RSVP" },
        { id: "ucapan", label: "Ucapan" },
      ]}
    >
      <main className="px-6 py-12">
        <div className="mx-auto max-w-2xl border-x-4 border-dashed border-[var(--inv-line)] px-8 py-16">
          <section id="momen" className="text-center">
            <Reveal>
              <p className="text-xs uppercase tracking-widest text-[var(--inv-muted)]">Scene 01/12</p>
              <h2 className="mt-6 font-inv-display text-5xl text-[var(--inv-ink)]">{names}</h2>
              <div className="mt-12">
                <Countdown
                  targetDate={data.date}
                  initialSeconds={secondsUntil(data.date)}
                />
              </div>
            </Reveal>
          </section>

          <section id="acara" className="mt-20">
            <Reveal>
              <h3 className="font-inv-display text-2xl text-[var(--inv-ink)]">Script Details</h3>
              <dl className="mt-6 space-y-4">
                <div className="flex border-b border-[var(--inv-line)] pb-2">
                  <dt className="w-20 text-xs uppercase text-[var(--inv-muted)]">Date</dt>
                  <dd className="text-lg text-[var(--inv-ink)]">{formatEventDate(data.date)}</dd>
                </div>
                <div className="flex border-b border-[var(--inv-line)] pb-2">
                  <dt className="w-20 text-xs uppercase text-[var(--inv-muted)]">Time</dt>
                  <dd className="text-lg text-[var(--inv-ink)]">{formatEventTime(data.date)}</dd>
                </div>
                <div className="flex border-b border-[var(--inv-line)] pb-2">
                  <dt className="w-20 text-xs uppercase text-[var(--inv-muted)]">Venue</dt>
                  <dd className="text-lg text-[var(--inv-ink)]">{data.venue}</dd>
                </div>
              </dl>
            </Reveal>
          </section>

          {data.images.length > 0 ? (
            <section id="galeri" className="mt-20">
              <Reveal>
                <Gallery images={data.images} />
              </Reveal>
            </section>
          ) : null}

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
          
          <div className="mt-20">
            <GiftInfo gift={data.gift} />
            <RSVPForm eventId={eventId} readOnly={mode === "preview"} />
            <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />
          </div>

          <InvitationFooter signature={names} />
        </div>
      </main>
    </InvitationShell>
  );
}