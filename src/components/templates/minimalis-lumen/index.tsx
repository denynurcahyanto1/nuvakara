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
import { themes } from "../shared/theme";
import type { TemplateRenderProps } from "../types";
import { formatEventDate, formatEventTime, secondsUntil } from "@/lib/datetime";

const theme = themes["minimalis-lumen"];

export function MinimalisLumen({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Invitation",
        title: data.title,
        subtitle: data.description || "Dengan senang hati kami mengundang Anda.",
        date: data.date,
        image: portrait,
        variant: "editorial",
        note: "Kami menantikan kehadiran Anda.",
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
      <main className="mx-auto max-w-3xl px-6">
        <section id="momen" className="pb-16 pt-20 sm:pb-24 sm:pt-28">
          <Reveal>
            <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-[var(--inv-accent)]">
              {data.eventType === "wedding" ? "Pernikahan" : "Undangan"}
            </p>
            <h2 className="mt-8 max-w-2xl font-inv-display text-[clamp(2.6rem,8.5vw,4.8rem)] font-light leading-[1.02] text-[var(--inv-ink)]">
              {data.title}
            </h2>
            <div className="mt-10 grid gap-8 border-t border-[var(--inv-line)] pt-8 sm:grid-cols-[1fr_1fr]">
              <p className="max-w-sm text-sm leading-relaxed text-[var(--inv-muted)]">
                {data.description ||
                  "Sebuah momen sederhana untuk berkumpul, berbagi cerita, dan merayakan hal yang berarti."}
              </p>
              <div className="sm:text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                  {formatEventDate(data.date)}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[var(--inv-muted)]">
                  {formatEventTime(data.date)}
                </p>
                <p className="mt-4 font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                  {data.venue}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <Countdown
              targetDate={data.date}
              initialSeconds={secondsUntil(data.date)}
              className="border-y border-[var(--inv-line)] py-6"
            />
          </Reveal>

          {portrait ? (
            <Reveal delay={0.14} className="mt-12">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--inv-accent-soft)]">
                <Image
                  src={portrait}
                  alt={data.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </section>

        <section id="acara" className="pb-16 sm:pb-24">
          <Reveal>
            <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-muted)]">
              Detail
            </p>
            <dl className="mt-6 divide-y divide-[var(--inv-line)] border-y border-[var(--inv-line)]">
              {[
                { term: "Tanggal", detail: formatEventDate(data.date) },
                { term: "Waktu", detail: formatEventTime(data.date) },
                { term: "Tempat", detail: data.venue },
                { term: "Alamat", detail: [data.address, data.city].filter(Boolean).join(", ") || "—" },
              ].map((row) => (
                <div key={row.term} className="grid gap-1 py-5 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-muted)]">
                    {row.term}
                  </dt>
                  <dd className="font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                    {row.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        {data.images.length > 1 ? (
          <section id="galeri" className="pb-16 sm:pb-24">
            <Reveal>
              <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-muted)]">
                Galeri
              </p>
              <Gallery images={data.images} layout="grid" className="mt-6 gap-1.5 sm:gap-2" />
            </Reveal>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="pb-16 sm:pb-24">
            <Reveal>
              <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-muted)]">
                Lokasi
              </p>
              <div className="mt-6">
                <MapEmbed
                  url={data.mapUrl}
                  href={data.mapsLink}
                  venue={data.venue}
                  address={data.address}
                  city={data.city}
                />
              </div>
            </Reveal>
          </section>
        ) : null}
      </main>

      <GiftInfo gift={data.gift} />
      <RSVPForm eventId={eventId} readOnly={mode === "preview"} />
      <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />
      <InvitationFooter signature={data.title} note="Terima kasih" />
    </InvitationShell>
  );
}
