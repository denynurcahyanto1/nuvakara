import Image from "next/image";
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

const theme = themes["elegan-maison"];

function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-12 w-12 items-center justify-center border border-[var(--inv-accent)] font-inv-display text-lg tracking-[0.1em] text-[var(--inv-accent)] ${className}`}
    >
      N
    </span>
  );
}

export function EleganMaison({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;
  const initials = [data.host, data.partner]
    .filter(Boolean)
    .map((value) => (value as string).charAt(0).toUpperCase())
    .join("·");

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Undangan Pernikahan",
        title: names,
        subtitle: data.description || "Sebuah perayaan cinta, keluarga, dan awal yang baru.",
        date: data.date,
        image: portrait,
        variant: "deco",
        note: "Kami menantikan kehadiran Anda di hari yang istimewa ini.",
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
        {/* Masthead */}
        <div className="border-b border-[var(--inv-line)] px-6 py-5">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <Monogram />
            <p className="text-[9px] uppercase tracking-[0.36em] text-[var(--inv-muted)]">
              Est. {new Date(data.date).getUTCFullYear() || 2026}
            </p>
          </div>
        </div>

        {/* Hero */}
        <section id="momen" className="px-6 py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-[var(--inv-accent)]">
                The Marriage Of
              </p>
              <h2 className="mt-5 font-inv-display text-[clamp(2.8rem,9vw,5rem)] font-light leading-[0.94] text-[var(--inv-ink)]">
                {data.host ?? "Rafi"}
                <span className="mx-4 inline-block align-middle text-[0.4em] text-[var(--inv-accent)]">
                  &amp;
                </span>
                <br className="hidden sm:block" />
                {data.partner ?? "Aisyah"}
              </h2>
              <div className="mt-7 flex items-center gap-4">
                <span className="h-px w-14 bg-[var(--inv-accent)]" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
                  {formatEventDate(data.date)}
                </p>
              </div>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--inv-muted)]">
                {data.description || "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami."}
              </p>
              <div className="mt-9 max-w-sm border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-5">
                <Countdown
                  targetDate={data.date}
                  initialSeconds={secondsUntil(data.date)}
                />
              </div>
            </Reveal>

            <Reveal delay={0.12} className="relative">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-sm border border-[var(--inv-line)] p-2">
                <div className="relative h-full w-full overflow-hidden bg-[var(--inv-accent-soft)]">
                  {portrait ? (
                    <Image
                      src={portrait}
                      alt={names}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 hidden h-24 w-24 border-b border-r border-[var(--inv-accent)] sm:block"
              />
              <p className="mt-4 text-center text-[9px] uppercase tracking-[0.4em] text-[var(--inv-muted)]">
                {initials || "N"}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Verse */}
        <section className="border-y border-[var(--inv-line)] bg-[var(--inv-accent-soft)]/45 px-6 py-16 text-center">
          <Reveal className="mx-auto max-w-2xl">
            <Ornament variant="deco" className="mx-auto" />
            <blockquote className="mt-6 font-inv-display text-2xl italic leading-relaxed text-[var(--inv-ink)] sm:text-3xl">
              &ldquo;{data.quote ?? "Cinta bukan tentang menemukan seseorang yang sempurna, melainkan memilih untuk tetap tinggal."}&rdquo;
            </blockquote>
            <p className="mt-5 text-[9px] uppercase tracking-[0.4em] text-[var(--inv-muted)]">
              {names}
            </p>
          </Reveal>
        </section>

        {/* Details */}
        <section id="acara" className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>Rangkaian Acara</SectionLabel>
            <h2 className="mt-4 font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
              Save The Date
            </h2>

            <div className="mt-10 grid gap-px overflow-hidden border border-[var(--inv-line)] bg-[var(--inv-line)] sm:grid-cols-3">
              {[
                { index: "01", label: "Tanggal", value: formatEventDate(data.date) },
                { index: "02", label: "Waktu", value: formatEventTime(data.date) },
                { index: "03", label: "Tempat", value: data.venue },
              ].map((item) => (
                <div key={item.index} className="bg-[var(--inv-surface)] px-6 py-8">
                  <p className="font-inv-display text-xs tracking-[0.2em] text-[var(--inv-accent)]">
                    {item.index}
                  </p>
                  <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 font-inv-display text-lg leading-snug text-[var(--inv-ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--inv-muted)]">
              {[data.address, data.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </section>

        {/* Gallery */}
        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel>Galeri</SectionLabel>
              <h2 className="mt-4 font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                A Quiet Luxury
              </h2>
              <Reveal className="mt-8">
                <Gallery images={data.images} layout="grid" />
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* Map */}
        {data.mapUrl ? (
          <section id="lokasi" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel>Lokasi</SectionLabel>
              <h2 className="mt-4 font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                The Venue
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
