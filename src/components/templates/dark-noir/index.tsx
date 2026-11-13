import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Countdown } from "../shared/Countdown";
import { Gallery } from "../shared/Gallery";
import { GiftInfo } from "../shared/GiftInfo";
import { Guestbook } from "../shared/Guestbook";
import { InvitationFooter } from "../shared/InvitationFooter";
import { InvitationShell } from "../shared/InvitationShell";
import { MapEmbed } from "../shared/MapEmbed";
import { RSVPForm } from "../shared/RSVPForm";
import { SectionLabel } from "../shared/SectionLabel";
import { themes } from "../shared/theme";
import type { TemplateRenderProps } from "../types";
import { formatEventDate, formatEventTime, secondsUntil } from "@/lib/datetime";

const theme = themes["dark-noir"];

export function DarkNoir({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "An Invitation",
        title: names,
        subtitle: data.description || "Sebuah malam untuk merayakan babak baru.",
        date: data.date,
        image: portrait,
        variant: "cinematic",
        note: "Dress code: formal, dengan palet gelap dan aksen logam.",
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
            <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-accent)]">
              Nuvakara · Noir
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
              {formatEventDate(data.date)}
            </p>
          </div>
        </div>

        {/* Hero */}
        <section id="momen" className="relative px-6 pb-16 pt-14 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-[var(--inv-accent)]">
                Undangan {data.eventType === "wedding" ? "Pernikahan" : "Acara"}
              </p>
              <h2 className="mt-6 max-w-4xl font-inv-display text-[clamp(3rem,11vw,7rem)] font-light leading-[0.9] tracking-[-0.02em] text-[var(--inv-ink)]">
                {data.title}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-8 border-t border-[var(--inv-line)] pt-8 sm:grid-cols-[1.4fr_1fr] sm:gap-12">
              <Reveal delay={0.06}>
                <p className="max-w-lg text-sm leading-relaxed text-[var(--inv-muted)] sm:text-base">
                  {data.description ||
                    "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami."}
                </p>
                {data.quote ? (
                  <p className="mt-6 border-l border-[var(--inv-accent)] pl-5 font-inv-display text-xl italic leading-relaxed text-[var(--inv-ink)]">
                    {data.quote}
                  </p>
                ) : null}
              </Reveal>

              <Reveal delay={0.12} className="sm:text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                  Menuju Acara
                </p>
                <Countdown
                  targetDate={data.date}
                  initialSeconds={secondsUntil(data.date)}
                  className="mt-4 sm:justify-end"
                />
              </Reveal>
            </div>

            {portrait ? (
              <Reveal delay={0.1} className="mt-12">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--inv-surface)] sm:aspect-[21/9]">
                  <Image
                    src={portrait}
                    alt={names}
                    fill
                    priority
                    sizes="(min-width: 1024px) 80vw, 100vw"
                    className="object-cover opacity-90 grayscale transition duration-700 hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--inv-bg)] via-transparent to-transparent opacity-70" />
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* Details */}
        <section id="acara" className="border-y border-[var(--inv-line)] px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionLabel align="left">Detail</SectionLabel>
              <h2 className="mt-5 font-inv-display text-4xl leading-[1.05] text-[var(--inv-ink)] sm:text-5xl">
                Waktu &amp;
                <br />
                Tempat
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--inv-muted)]">
                Kami menantikan kehadiran Anda. Berikut informasi yang Anda perlukan.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="divide-y divide-[var(--inv-line)] border-y border-[var(--inv-line)]">
                {[
                  { term: "Tanggal", detail: formatEventDate(data.date) },
                  { term: "Waktu", detail: formatEventTime(data.date) },
                  { term: "Tempat", detail: data.venue },
                  {
                    term: "Alamat",
                    detail: [data.address, data.city].filter(Boolean).join(", ") || "—",
                  },
                ].map((row) => (
                  <div key={row.term} className="grid gap-1 py-5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                      {row.term}
                    </dt>
                    <dd className="font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Gallery */}
        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Galeri</SectionLabel>
              <h2 className="mt-5 font-inv-display text-4xl text-[var(--inv-ink)] sm:text-5xl">
                Fragments
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
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Lokasi</SectionLabel>
              <h2 className="mt-5 font-inv-display text-4xl text-[var(--inv-ink)] sm:text-5xl">
                Find Us
              </h2>
              <Reveal className="mt-8">
                <MapEmbed
                  url={data.mapUrl}
                  href={data.mapsLink}
                  venue={data.venue}
                  address={data.address}
                  city={data.city}
                  tone="dark"
                />
              </Reveal>
            </div>
          </section>
        ) : null}

        <GiftInfo gift={data.gift} />

        <RSVPForm eventId={eventId} readOnly={mode === "preview"} />

        <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />

        <InvitationFooter
          signature={names}
          note="Kami menghargai setiap doa dan kehadiran Anda"
        />
      </main>
    </InvitationShell>
  );
}
