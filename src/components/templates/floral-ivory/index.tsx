import { Reveal } from "@/components/motion";
import { Countdown } from "../shared/Countdown";
import { Gallery } from "../shared/Gallery";
import { GiftInfo } from "../shared/GiftInfo";
import { Guestbook } from "../shared/Guestbook";
import { InvitationFooter } from "../shared/InvitationFooter";
import { InvitationShell } from "../shared/InvitationShell";
import { MapEmbed } from "../shared/MapEmbed";
import { Ornament } from "../shared/Ornament";
import { RSVPForm } from "../shared/RSVPForm";
import { SectionLabel } from "../shared/SectionLabel";
import { themes } from "../shared/theme";
import type { TemplateRenderProps } from "../types";
import { formatEventDate, formatEventTime, secondsUntil } from "@/lib/datetime";

const theme = themes["floral-ivory"];

/** Hand-drawn botanical corner, used to frame the hero and quote sections. */
function BotanicalCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      className={`pointer-events-none absolute h-32 w-32 text-[var(--inv-accent)] opacity-40 sm:h-44 sm:w-44 ${className}`}
    >
      <path d="M4 156C4 84 36 20 120 6" strokeLinecap="round" />
      <path d="M28 122c-14-4-18-16-10-24 10 2 16 12 10 24ZM56 92c-16 0-22-12-16-22 12 0 20 10 16 22ZM86 62c-16-2-20-16-10-24 12 2 18 12 10 24ZM112 36c-12-6-12-18-2-24 10 4 12 16 2 24Z" />
      <path d="M40 108c14 6 30 8 46 6M70 78c14 4 26 4 38 0M96 52c10 2 18 0 24-6" strokeLinecap="round" />
      <circle cx="52" cy="118" r="2" fill="currentColor" stroke="none" />
      <circle cx="86" cy="86" r="2" fill="currentColor" stroke="none" />
      <circle cx="112" cy="56" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FloralIvory({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
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
        variant: "arch",
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
      <main>
        {/* Hero */}
        <section id="momen" className="relative overflow-hidden px-6 pb-16 pt-20 text-center sm:pt-24">
          <BotanicalCorner className="-left-6 top-0" />
          <BotanicalCorner className="-right-6 top-0 rotate-90" />

          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--inv-accent)]">
              Undangan Pernikahan
            </p>
            <h2 className="mt-5 font-inv-display text-[clamp(2.6rem,10vw,4.5rem)] font-light leading-[1] text-[var(--inv-ink)]">
              {data.host ?? names}
              {data.partner ? (
                <>
                  <span className="mx-3 inline-block align-middle text-[0.45em] text-[var(--inv-accent)]">
                    &amp;
                  </span>
                  {data.partner}
                </>
              ) : null}
            </h2>
            <Ornament variant="floral" className="mx-auto mt-6" />
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--inv-muted)]">
              {data.description || "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami."}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-sm rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-muted)]">
                Menuju hari bahagia
              </p>
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
                className="mt-4"
              />
            </div>
          </Reveal>
        </section>

        {/* Quote */}
        <section className="relative overflow-hidden border-y border-[var(--inv-line)] bg-[var(--inv-accent-soft)]/40 px-6 py-16 text-center">
          <BotanicalCorner className="-bottom-8 -left-8 rotate-[270deg] opacity-30" />
          <Reveal>
            <Ornament variant="floral" className="mx-auto" />
            <blockquote className="mx-auto mt-6 max-w-lg font-inv-display text-xl italic leading-relaxed text-[var(--inv-ink)] sm:text-2xl">
              &ldquo;{data.quote ?? "Dua hati yang dipertemukan, tumbuh menjadi satu cerita yang utuh."}&rdquo;
            </blockquote>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
              {names}
            </p>
          </Reveal>
        </section>

        {/* Event details */}
        <section id="acara" className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionLabel>Rangkaian Acara</SectionLabel>
            <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
              Waktu &amp; Tempat
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Reveal className="h-full">
                <article className="flex h-full flex-col items-center rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-6 py-8 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--inv-accent)] text-[var(--inv-accent)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M8 3v4M16 3v4M3 11h18" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                    Tanggal
                  </p>
                  <p className="mt-2 font-inv-display text-xl text-[var(--inv-ink)]">
                    {formatEventDate(data.date)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                </article>
              </Reveal>

              <Reveal delay={0.08} className="h-full">
                <article className="flex h-full flex-col items-center rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-6 py-8 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--inv-accent)] text-[var(--inv-accent)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                    Lokasi
                  </p>
                  <p className="mt-2 font-inv-display text-xl text-[var(--inv-ink)]">{data.venue}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                    {[data.address, data.city].filter(Boolean).join(", ")}
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-3xl">
              <SectionLabel>Galeri</SectionLabel>
              <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                Momen Kami
              </h2>
              <Reveal className="mt-8">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* Map */}
        {data.mapUrl ? (
          <section id="lokasi" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-3xl">
              <SectionLabel>Lokasi</SectionLabel>
              <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                Menuju Lokasi
              </h2>
              <Reveal className="mt-8">
                <MapEmbed
                  url={data.mapUrl}
                  href={data.mapsLink}
                  venue={data.venue}
                  address={data.address}
                  city={data.city}
                />
              </Reveal>
            </div>
          </section>
        ) : null}

        <GiftInfo gift={data.gift} />

        <RSVPForm eventId={eventId} readOnly={mode === "preview"} />

        <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />

        <InvitationFooter signature={names} />
      </main>
    </InvitationShell>
  );
}
