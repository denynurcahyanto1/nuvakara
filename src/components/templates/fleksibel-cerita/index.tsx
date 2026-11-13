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

const theme = themes["fleksibel-cerita"];

/** Art-directed placeholder for events without a cover image. */
function Collage({ title }: { title: string }) {
  return (
    <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-[var(--inv-radius)] bg-[var(--inv-accent)] p-6 text-[var(--inv-on-accent)]">
      <span className="text-[9px] font-semibold uppercase tracking-[0.34em] opacity-70">
        Cerita
      </span>
      <p className="max-w-[14ch] font-inv-display text-4xl leading-none">{title}</p>
      <span
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-current opacity-25"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full border border-current opacity-15"
      />
    </div>
  );
}

export function FleksibelCerita({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "You're Invited",
        title: data.title,
        subtitle: data.description || "Satu acara, satu cerita, dan Anda adalah bagian dari kami.",
        date: data.date,
        image: portrait,
        variant: "editorial",
        note: "Kami akan senang bila Anda bisa datang dan merayakan bersama.",
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
        <section id="momen" className="px-6 pb-14 pt-16 sm:pb-20 sm:pt-24">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <Reveal>
              <SectionLabel align="left">Undangan</SectionLabel>
              <h2 className="mt-5 max-w-3xl font-inv-display text-[clamp(2.4rem,8vw,4.6rem)] font-light leading-[1] text-[var(--inv-ink)]">
                {data.title}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--inv-muted)]">
                {data.description || "Dengan senang hati kami mengundang Anda untuk menjadi bagian dari momen ini."}
              </p>

              <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--inv-accent)]">
                  {formatEventDate(data.date)}
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-[var(--inv-line)]" />
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--inv-muted)]">
                  {formatEventTime(data.date)}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {portrait ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--inv-radius)] bg-[var(--inv-accent-soft)]">
                  <Image
                    src={portrait}
                    alt={data.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <Collage title={data.title} />
              )}
            </Reveal>
          </div>
        </section>

        <section className="px-6 pb-14">
          <div className="mx-auto max-w-5xl rounded-[var(--inv-radius)] bg-[var(--inv-accent)] px-6 py-10 text-[var(--inv-on-accent)] sm:px-10 sm:py-12">
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.36em] opacity-70">
                  Hitung mundur
                </p>
                <p className="mt-3 max-w-md font-inv-display text-2xl leading-snug sm:text-3xl">
                  Sampai jumpa di hari yang kita tunggu.
                </p>
              </div>
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
                tone="on-accent"
              />
            </div>
          </div>
        </section>

        <section id="acara" className="px-6 pb-16 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <SectionLabel align="left">Detail Acara</SectionLabel>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <article className="h-full rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                    Kapan
                  </p>
                  <p className="mt-3 font-inv-display text-2xl leading-snug text-[var(--inv-ink)]">
                    {formatEventDate(data.date)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                </article>
              </Reveal>
              <Reveal delay={0.08}>
                <article className="h-full rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                    Di mana
                  </p>
                  <p className="mt-3 font-inv-display text-2xl leading-snug text-[var(--inv-ink)]">
                    {data.venue}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                    {[data.address, data.city].filter(Boolean).join(", ")}
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Galeri</SectionLabel>
              <h2 className="mt-4 font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                Cerita dalam gambar
              </h2>
              <Reveal className="mt-8">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Lokasi</SectionLabel>
              <Reveal className="mt-6">
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
        <InvitationFooter signature={data.title} />
      </main>
    </InvitationShell>
  );
}
