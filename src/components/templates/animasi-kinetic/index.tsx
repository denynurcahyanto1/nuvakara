import Image from "next/image";
import { Parallax, Reveal } from "@/components/motion";
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

const theme = themes["animasi-kinetic"];

function Orbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--inv-accent)] opacity-30 blur-[90px] motion-safe:animate-[inv-orbit_18s_ease-in-out_infinite]" />
      <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-[#3BC9FF] opacity-20 blur-[110px] motion-safe:animate-[inv-orbit_24s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#FF6BD6] opacity-15 blur-[100px] motion-safe:animate-[inv-orbit_20s_ease-in-out_infinite]" />
    </div>
  );
}

export function AnimasiKinetic({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const marquee = [data.title, "Immersive Invitation", "NUVAKARA", "2026"];

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Immersive Invitation",
        title: data.title,
        subtitle: data.description || "Sebuah pengalaman digital untuk merayakan momen yang tak terlupakan.",
        date: data.date,
        image: portrait,
        variant: "cinematic",
        note: "Geser perlahan — setiap bagian dirancang untuk Anda rasakan.",
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
        <section id="momen" className="relative overflow-hidden px-6 pb-16 pt-16 sm:pt-24">
          <Orbs />
          <div className="relative mx-auto max-w-5xl">
            <Reveal>
              <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-[var(--inv-accent)]">
                {formatEventDate(data.date)}
              </p>
              <h2 className="mt-6 max-w-4xl bg-[linear-gradient(105deg,var(--inv-ink)_10%,var(--inv-accent)_55%,var(--inv-ink)_95%)] bg-clip-text font-inv-display text-[clamp(2.8rem,10vw,6.4rem)] font-light leading-[0.92] tracking-[-0.03em] text-transparent">
                {data.title}
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--inv-muted)] sm:text-base">
                {data.description ||
                  "Bukan sekadar undangan — ini adalah awal dari cerita yang akan kita rayakan bersama."}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[var(--inv-accent)] bg-[var(--inv-accent-soft)] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--inv-accent)]">
                  {formatEventTime(data.date)}
                </span>
                <span className="rounded-full border border-[var(--inv-line)] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--inv-muted)]">
                  {data.venue}
                </span>
              </div>
            </Reveal>

            {portrait ? (
              <Parallax speed={0.16} className="mt-12">
                <Reveal>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] sm:aspect-[21/9]">
                    <Image
                      src={portrait}
                      alt={data.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 80vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-tr from-[var(--inv-accent)]/35 via-transparent to-[#3BC9FF]/20"
                    />
                  </div>
                </Reveal>
              </Parallax>
            ) : null}
          </div>
        </section>

        <div className="overflow-hidden border-y border-[var(--inv-line)] py-4">
          <div className="flex w-max motion-safe:animate-[inv-marquee_26s_linear_infinite]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-6 pr-6" aria-hidden={copy === 1}>
                {marquee.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-muted)]"
                  >
                    {item}
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--inv-accent)]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section id="acara" className="relative px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionLabel align="left">Save The Date</SectionLabel>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
              <Reveal>
                <div className="h-full rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-6 backdrop-blur-sm sm:p-8">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                    Countdown
                  </p>
                  <Countdown
                    targetDate={data.date}
                    initialSeconds={secondsUntil(data.date)}
                    className="mt-5"
                  />
                  <p className="mt-6 text-xs leading-relaxed text-[var(--inv-muted)]">
                    Tiga angka yang memisahkan kita dari perayaan. Sampai bertemu di sana.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="grid h-full gap-3 sm:grid-cols-2">
                  <div className="rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                      Tanggal
                    </p>
                    <p className="mt-3 font-inv-display text-2xl leading-snug text-[var(--inv-ink)]">
                      {formatEventDate(data.date)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                  </div>
                  <div className="rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                      Tempat
                    </p>
                    <p className="mt-3 font-inv-display text-2xl leading-snug text-[var(--inv-ink)]">
                      {data.venue}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                      {[data.address, data.city].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="relative px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Galeri</SectionLabel>
              <h2 className="mt-4 font-inv-display text-4xl text-[var(--inv-ink)] sm:text-5xl">
                Visual Diary
              </h2>
              <Reveal className="mt-8">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="relative px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-5xl">
              <SectionLabel align="left">Lokasi</SectionLabel>
              <Reveal className="mt-6">
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
        <InvitationFooter signature={data.title} note="Sampai jumpa di perayaan" />
      </main>
    </InvitationShell>
  );
}
