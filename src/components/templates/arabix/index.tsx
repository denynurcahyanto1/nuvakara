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

const theme = themes["arabix"];

export function Arabix({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Bismillahirrahmanirrahim",
        title: names,
        subtitle: data.description || "Dengan memohon rahmat Allah, kami mengundang Anda untuk menghadiri akad dan walimah kami.",
        date: data.date,
        image: portrait,
        variant: "arch",
        note: "Semoga Allah memberkahi pernikahan ini.",
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
      <main className="px-6 py-12 sm:py-20">
        <section id="momen" className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="rounded-[var(--inv-radius)] border-2 border-[var(--inv-accent)] p-4">
              <div className="rounded-[calc(var(--inv-radius)-0.5rem)] border border-[var(--inv-accent)] bg-[var(--inv-surface)] px-6 py-12">
                <p className="font-inv-display text-lg text-[var(--inv-accent)]" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                <h2 className="mt-8 font-inv-display text-5xl text-[var(--inv-ink)]">
                  {data.host ?? "Rafi"} & {data.partner ?? "Aisyah"}
                </h2>
              </div>
            </div>
            <p className="mt-8 text-sm text-[var(--inv-muted)]">{data.description || "Kami mengundang Anda."}</p>
            <div className="mt-10">
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
              />
            </div>
          </Reveal>
        </section>

        <section id="acara" className="mx-auto mt-20 max-w-3xl border-t border-[var(--inv-line)] pt-12">
          <Reveal>
            <h3 className="text-center font-inv-display text-3xl text-[var(--inv-ink)]">Rangkaian Acara</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[var(--inv-radius)] border border-[var(--inv-line)] p-6 text-center">
                <p className="text-sm text-[var(--inv-accent)]">Tanggal</p>
                <p className="mt-2 font-inv-display text-xl text-[var(--inv-ink)]">{formatEventDate(data.date)}</p>
                <p className="text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
              </div>
              <div className="rounded-[var(--inv-radius)] border border-[var(--inv-line)] p-6 text-center">
                <p className="text-sm text-[var(--inv-accent)]">Tempat</p>
                <p className="mt-2 font-inv-display text-xl text-[var(--inv-ink)]">{data.venue}</p>
                <p className="text-sm text-[var(--inv-muted)]">{[data.address, data.city].filter(Boolean).join(", ")}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="mx-auto mt-20 max-w-3xl">
            <Reveal>
              <Gallery images={data.images} />
            </Reveal>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="mx-auto mt-20 max-w-3xl">
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

        <InvitationFooter signature={names} note="Wassalamu'alaikum" />
      </main>
    </InvitationShell>
  );
}