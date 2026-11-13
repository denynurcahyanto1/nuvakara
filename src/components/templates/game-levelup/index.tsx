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

const theme = themes["game-levelup"];

function PixelPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-2 border-[var(--inv-accent)] bg-[var(--inv-surface)] p-5 shadow-[5px_5px_0_0_var(--inv-accent)] ${className}`}
    >
      {children}
    </div>
  );
}

export function GameLevelUp({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Player 1 & Player 2",
        title: data.title,
        subtitle: data.description || "Sebuah quest baru dimulai. Anda diundang untuk ikut bermain.",
        date: data.date,
        image: portrait,
        variant: "cinematic",
        note: "Tekan tombol untuk memulai. Pastikan suara aktif untuk pengalaman terbaik.",
      }}
      nav={[
        { id: "momen", label: "Quest" },
        { id: "acara", label: "Info" },
        { id: "galeri", label: "Captures" },
        { id: "lokasi", label: "Map" },
        { id: "rsvp", label: "Join" },
        { id: "ucapan", label: "Chat" },
      ]}
    >
      <main>
        <section id="momen" className="px-6 pb-16 pt-16 sm:pt-20">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--inv-line)] pb-4">
                <p className="font-inv-display text-[10px] uppercase tracking-[0.32em] text-[var(--inv-accent)]">
                  Main Quest
                </p>
                <p className="font-inv-display text-[10px] uppercase tracking-[0.26em] text-[var(--inv-muted)]">
                  LV. 01 · {formatEventDate(data.date)}
                </p>
              </div>

              <h2 className="mt-8 font-inv-display text-[clamp(2.4rem,8vw,4.6rem)] font-bold uppercase leading-[0.98] tracking-[-0.02em] text-[var(--inv-ink)]">
                {data.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--inv-muted)]">
                {data.description ||
                  "Sebuah misi sederhana: datang, berbagi kebahagiaan, dan jadilah bagian dari cerita ini."}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <PixelPanel>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-inv-display text-[9px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
                    Time Until Event
                  </p>
                  <span className="flex items-center gap-1.5 font-inv-display text-[8px] uppercase tracking-[0.2em] text-[#4ADE80]">
                    <span className="h-1.5 w-1.5 animate-pulse bg-[#4ADE80]" />
                    Live
                  </span>
                </div>
                <Countdown
                  targetDate={data.date}
                  initialSeconds={secondsUntil(data.date)}
                  className="mt-5"
                />
                <div className="mt-6 h-3 w-full border border-[var(--inv-line)]">
                  <div className="h-full w-2/3 bg-[var(--inv-accent)]" />
                </div>
                <p className="mt-2 font-inv-display text-[8px] uppercase tracking-[0.22em] text-[var(--inv-muted)]">
                  EXP menuju hari-H
                </p>
              </PixelPanel>
            </Reveal>

            {portrait ? (
              <Reveal delay={0.12} className="mt-8">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[var(--inv-line)] bg-[var(--inv-surface)]">
                  <Image
                    src={portrait}
                    alt={data.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-cover [image-rendering:pixelated]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--inv-bg)] via-transparent to-transparent opacity-80" />
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        <section id="acara" className="px-6 pb-16 sm:pb-20">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="font-inv-display text-[10px] uppercase tracking-[0.32em] text-[var(--inv-accent)]">
                Quest Log
              </p>
            </Reveal>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <PixelPanel className="h-full">
                  <p className="font-inv-display text-[8px] uppercase tracking-[0.26em] text-[var(--inv-muted)]">
                    Checkpoint 01 · Waktu
                  </p>
                  <p className="mt-3 font-inv-display text-lg uppercase leading-snug text-[var(--inv-ink)]">
                    {formatEventDate(data.date)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--inv-muted)]">{formatEventTime(data.date)}</p>
                  <div className="mt-4 flex items-center gap-2 font-inv-display text-[8px] uppercase tracking-[0.2em] text-[#4ADE80]">
                    <span className="flex h-4 w-4 items-center justify-center border border-[#4ADE80] text-[9px]">
                      ✓
                    </span>
                    Unlocked
                  </div>
                </PixelPanel>
              </Reveal>

              <Reveal delay={0.08}>
                <PixelPanel className="h-full">
                  <p className="font-inv-display text-[8px] uppercase tracking-[0.26em] text-[var(--inv-muted)]">
                    Checkpoint 02 · Lokasi
                  </p>
                  <p className="mt-3 font-inv-display text-lg uppercase leading-snug text-[var(--inv-ink)]">
                    {data.venue}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--inv-muted)]">
                    {[data.address, data.city].filter(Boolean).join(", ")}
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-inv-display text-[8px] uppercase tracking-[0.2em] text-[var(--inv-accent)]">
                    <span className="flex h-4 w-4 items-center justify-center border border-current text-[9px]">
                      !
                    </span>
                    Fast travel available
                  </div>
                </PixelPanel>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="mt-4">
              <div className="border border-[var(--inv-line)] px-5 py-4">
                <ul className="divide-y divide-[var(--inv-line)] font-inv-display text-[9px] uppercase tracking-[0.18em] text-[var(--inv-muted)]">
                  {[
                    "Hadir tepat waktu · +50 EXP",
                    "Berikan doa & restu · +100 EXP",
                    "Tinggalkan pesan di chat · +25 EXP",
                  ].map((quest) => (
                    <li key={quest} className="flex items-center gap-3 py-3">
                      <span className="h-2 w-2 border border-[var(--inv-accent)]" />
                      {quest}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl">
              <p className="font-inv-display text-[10px] uppercase tracking-[0.32em] text-[var(--inv-accent)]">
                Screenshots
              </p>
              <Reveal className="mt-6">
                <Gallery images={data.images} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {data.mapUrl ? (
          <section id="lokasi" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl">
              <p className="mb-4 font-inv-display text-[10px] uppercase tracking-[0.32em] text-[var(--inv-accent)]">
                Map Unlocked
              </p>
              <Reveal>
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
        <InvitationFooter signature={data.title} note="Thanks for playing — sampai jumpa di hari-H" />
      </main>
    </InvitationShell>
  );
}
