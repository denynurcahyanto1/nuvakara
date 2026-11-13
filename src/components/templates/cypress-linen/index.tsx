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

const theme = themes["cypress-linen"];

export function CypressLinen({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names =
    data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "The Wedding Of",
        title: names,
        subtitle: data.description || "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.",
        date: data.date,
        image: portrait,
        variant: "editorial",
        note: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara berkenan hadir.",
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
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-20">
        {/* Hero */}
        <section id="momen" className="text-center">
          <Reveal>
            <h2 className="font-inv-display text-[clamp(2.5rem,8vw,4rem)] font-light leading-[1] text-[var(--inv-ink)]">
              {data.host ?? names}
              {data.partner ? (
                <>
                  <span className="mx-3 inline-block align-middle text-[0.4em] text-[var(--inv-muted)]">
                    &amp;
                  </span>
                  {data.partner}
                </>
              ) : null}
            </h2>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-[var(--inv-muted)]">
              {data.description || "Kami mengundang Anda untuk merayakan hari bahagia kami."}
            </p>
            <div className="mt-10 inline-block border-t border-[var(--inv-line)] pt-8">
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
              />
            </div>
          </Reveal>
        </section>

        {/* Details */}
        <section id="acara" className="mt-20">
          <Reveal>
            <div className="grid gap-12 sm:grid-cols-2">
              <article>
                <h3 className="font-inv-display text-2xl text-[var(--inv-ink)]">Waktu</h3>
                <p className="mt-4 text-lg text-[var(--inv-muted)]">{formatEventDate(data.date)}</p>
                <p className="mt-1 text-lg text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
              </article>
              <article>
                <h3 className="font-inv-display text-2xl text-[var(--inv-ink)]">Tempat</h3>
                <p className="mt-4 text-lg text-[var(--inv-muted)]">{data.venue}</p>
                <p className="mt-1 text-lg leading-relaxed text-[var(--inv-muted)]">
                  {[data.address, data.city].filter(Boolean).join(", ")}
                </p>
              </article>
            </div>
          </Reveal>
        </section>

        {/* Gallery */}
        {data.images.length > 0 ? (
          <section id="galeri" className="mt-20">
            <Reveal>
              <Gallery images={data.images} />
            </Reveal>
          </section>
        ) : null}

        {/* Map */}
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
        </div>
        <div className="mt-10">
          <RSVPForm eventId={eventId} readOnly={mode === "preview"} />
        </div>
        <div className="mt-10">
          <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />
        </div>
        
        <footer className="mt-20 border-t border-[var(--inv-line)] pt-10 text-center">
          <p className="font-inv-display text-2xl text-[var(--inv-ink)]">{names}</p>
        </footer>
      </main>
    </InvitationShell>
  );
}