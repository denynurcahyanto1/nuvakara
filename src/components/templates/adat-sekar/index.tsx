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

const theme = themes["adat-sekar"];

/** Simplified gunungan (wayang kulit tree of life) used as the section mark. */
function Gunungan({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`text-[var(--inv-accent)] ${className}`}
    >
      <path d="M60 4C44 34 20 58 20 88c0 26 18 44 40 48 22-4 40-22 40-48 0-30-24-54-40-84Z" />
      <path d="M60 18C48 42 32 62 32 88c0 18 12 32 28 38 16-6 28-20 28-38 0-26-16-46-28-70Z" opacity=".7" />
      <path d="M60 42v78M46 62c8 4 20 4 28 0M40 84c12 5 28 5 40 0M36 104c14 5 34 5 48 0" strokeLinecap="round" opacity=".8" />
      <circle cx="60" cy="42" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AdatSekar({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Sugeng Rawuh",
        title: names,
        subtitle: data.description || "Kami mengundang Anda untuk berbagi kebahagiaan dalam tradisi kami.",
        date: data.date,
        image: portrait,
        variant: "arch",
        note: "Ngaturaken sugeng rawuh — terima kasih atas doa dan restu yang diberikan.",
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
        <section id="momen" className="relative overflow-hidden px-6 pb-16 pt-16 text-center sm:pt-20">
          <Gunungan className="pointer-events-none absolute left-1/2 top-6 h-56 w-48 -translate-x-1/2 opacity-[0.06]" />
          <div className="relative mx-auto max-w-3xl">
            <Reveal>
              <p className="text-[10px] font-semibold uppercase tracking-[0.46em] text-[var(--inv-accent)]">
                Sugeng Rawuh
              </p>
              <h2 className="mt-5 font-inv-display text-[clamp(2.6rem,9vw,4.6rem)] font-light leading-[1] text-[var(--inv-ink)]">
                {names}
              </h2>
              <Ornament variant="batik" className="mx-auto mt-6" />
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--inv-muted)] sm:text-base">
                {data.description ||
                  "Dengan memohon rahmat dan ridho Tuhan, kami bermaksud menyelenggarakan tasyakuran pernikahan putra-putri kami."}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-10 max-w-sm rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-muted)]">
                  Tumuju dina
                </p>
                <Countdown
                  targetDate={data.date}
                  initialSeconds={secondsUntil(data.date)}
                  className="mt-4"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[var(--inv-line)] bg-[var(--inv-accent)] px-6 py-16 text-center text-[var(--inv-on-accent)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
          />
          <Reveal className="relative mx-auto max-w-2xl">
            <Gunungan className="mx-auto h-20 w-16 opacity-80" />
            <blockquote className="mt-5 font-inv-display text-2xl italic leading-relaxed sm:text-3xl">
              &ldquo;{data.quote ?? "Tradisi bukan sekadar warisan, melainkan doa yang dirawat dari generasi ke generasi."}&rdquo;
            </blockquote>
            <p className="mt-5 text-[9px] uppercase tracking-[0.4em] opacity-70">
              {names}
            </p>
          </Reveal>
        </section>

        <section id="acara" className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <SectionLabel>Rangkaian Acara</SectionLabel>
            <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
              Adicara
            </h2>

            <Reveal className="mt-10">
              <div className="relative overflow-hidden rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-1.5">
                <div className="rounded-[calc(var(--inv-radius)-0.375rem)] border border-[var(--inv-line)] px-6 py-8 sm:px-10">
                  <div className="grid gap-8 sm:grid-cols-3">
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                        Dinten
                      </p>
                      <p className="mt-2 font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                        {formatEventDate(data.date)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                        Papan
                      </p>
                      <p className="mt-2 font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                        {data.venue}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                        {[data.address, data.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
                        Busana
                      </p>
                      <p className="mt-2 font-inv-display text-xl leading-snug text-[var(--inv-ink)]">
                        Batik &amp; tenun
                      </p>
                      <p className="mt-1 text-sm text-[var(--inv-muted)]">
                        Nuansa marun, emas, atau krem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl">
              <SectionLabel>Galeri</SectionLabel>
              <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                Kenangan
              </h2>
              <Reveal className="mt-8">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl">
              <SectionLabel>Lokasi</SectionLabel>
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
        <InvitationFooter signature={names} note="Matur nuwun sanget" />
      </main>
    </InvitationShell>
  );
}
