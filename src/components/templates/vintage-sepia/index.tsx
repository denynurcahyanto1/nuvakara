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

const theme = themes["vintage-sepia"];

function Stamp({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-16 w-14 rotate-3 flex-col items-center justify-center border border-dashed border-[var(--inv-accent)] bg-[var(--inv-surface)] text-center"
    >
      <span className="font-inv-display text-lg leading-none text-[var(--inv-accent)]">N</span>
      <span className="mt-1 text-[7px] uppercase tracking-[0.12em] text-[var(--inv-muted)]">
        {label}
      </span>
    </span>
  );
}

export function VintageSepia({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "You Are Cordially Invited",
        title: names,
        subtitle: data.description || "Sebuah undangan untuk merayakan hari yang telah lama kami nantikan.",
        date: data.date,
        image: portrait,
        variant: "deco",
        note: "Dengan hormat, kami menantikan kehadiran Anda.",
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
        <section id="momen" className="px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="relative overflow-hidden border border-[var(--inv-line)] bg-[var(--inv-surface)] p-2 shadow-[0_30px_80px_-50px_rgba(59,33,25,0.6)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,var(--inv-accent)_0.5px,transparent_0)] [background-size:14px_14px]"
                />
                <div className="relative border border-[var(--inv-line)] px-6 py-10 sm:px-12 sm:py-14">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.42em] text-[var(--inv-accent)]">
                        The Invitation
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.26em] text-[var(--inv-muted)]">
                        {formatEventDate(data.date)}
                      </p>
                    </div>
                    <Stamp label="NUVAKARA" />
                  </div>

                  <div className="mt-10 text-center">
                    <p className="font-inv-display text-sm italic text-[var(--inv-muted)]">
                      With great pleasure, we invite you to celebrate
                    </p>
                    <h2 className="mt-4 font-inv-display text-[clamp(2.4rem,8vw,4.2rem)] font-light leading-[1.05] text-[var(--inv-ink)]">
                      {data.title}
                    </h2>
                    <Ornament variant="deco" className="mx-auto mt-5" />
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--inv-muted)]">
                      {data.description ||
                        "Sebuah perayaan kecil yang penuh makna, dan kami ingin Anda menjadi bagiannya."}
                    </p>
                  </div>

                  <div className="mt-10 grid gap-4 border-t border-[var(--inv-line)] pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                        When
                      </p>
                      <p className="mt-1 font-inv-display text-lg leading-snug text-[var(--inv-ink)]">
                        {formatEventDate(data.date)}
                      </p>
                      <p className="text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--inv-accent)]">
                        Where
                      </p>
                      <p className="mt-1 font-inv-display text-lg leading-snug text-[var(--inv-ink)]">
                        {data.venue}
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--inv-muted)]">
                        {[data.address, data.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-8 max-w-xs text-center">
                <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[var(--inv-muted)]">
                  Counting the days
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

        {portrait && data.images.length > 0 ? (
          <section id="galeri" className="px-4 pb-16 sm:px-6 sm:pb-20">
            <div className="mx-auto max-w-3xl">
              <SectionLabel>Galeri</SectionLabel>
              <h2 className="mt-4 text-center font-inv-display text-3xl text-[var(--inv-ink)] sm:text-4xl">
                Album Kenangan
              </h2>
              <Reveal className="mt-8 [&_img]:sepia-[0.25]">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        <section id="acara" className="border-y border-[var(--inv-line)] bg-[var(--inv-accent-soft)]/40 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Ornament variant="deco" className="mx-auto" />
            <blockquote className="mx-auto mt-6 max-w-xl font-inv-display text-2xl italic leading-relaxed text-[var(--inv-ink)] sm:text-3xl">
              &ldquo;{data.quote ?? "Waktu berjalan, tetapi kenangan yang kita buat bersama akan tinggal selamanya."}&rdquo;
            </blockquote>
            <p className="mt-5 text-[9px] uppercase tracking-[0.4em] text-[var(--inv-muted)]">
              {names}
            </p>
          </div>
        </section>

        {data.mapUrl ? (
          <section id="lokasi" className="px-4 pb-16 pt-16 sm:px-6 sm:pb-20">
            <div className="mx-auto max-w-3xl">
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
        <InvitationFooter signature={names} note="Dengan hormat dan terima kasih" />
      </main>
    </InvitationShell>
  );
}
