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

const theme = themes["islami-nurani"];

function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-t-[999px] border border-[var(--inv-line)] p-2">
      <div className="relative overflow-hidden rounded-t-[999px] bg-[var(--inv-accent-soft)]">
        {children}
      </div>
    </div>
  );
}

export function IslamiNurani({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
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
        note: "Semoga Allah memberkahi pernikahan ini dan mempertemukan kita dalam kebaikan.",
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,var(--inv-accent-soft),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <Reveal>
              <p className="font-inv-display text-lg tracking-wide text-[var(--inv-accent)]" dir="rtl">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <Ornament variant="arabesque" className="mx-auto mt-4" />
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--inv-muted)]">
                Undangan Pernikahan
              </p>
              <h2 className="mt-4 font-inv-display text-[clamp(2.6rem,9vw,4.6rem)] font-light leading-[1] text-[var(--inv-ink)]">
                {data.host ?? "Rafi"}
                <span className="mx-3 inline-block align-middle text-[0.4em] text-[var(--inv-accent)]">
                  &amp;
                </span>
                {data.partner ?? "Aisyah"}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[var(--inv-muted)]">
                {data.description ||
                  "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan akad nikah dan walimatul ursy."}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div className="mx-auto max-w-sm rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] px-5 py-6">
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
          </div>
        </section>

        <section className="border-y border-[var(--inv-line)] bg-[var(--inv-accent)] px-6 py-16 text-center text-[var(--inv-on-accent)]">
          <Reveal className="mx-auto max-w-2xl">
            <p className="font-inv-display text-xl leading-loose opacity-90" dir="rtl">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوْا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <p className="mt-6 text-sm leading-relaxed opacity-80">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan untukmu dari
              jenismu sendiri, agar kamu merasa tenteram, dan Dia menjadikan di antara kamu rasa
              kasih dan sayang.&rdquo;
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.4em] opacity-60">QS. Ar-Rum: 21</p>
          </Reveal>
        </section>

        <section id="acara" className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-[0.85fr_1.15fr]">
            {portrait ? (
              <Reveal>
                <ArchFrame>
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={portrait}
                      alt={names}
                      fill
                      sizes="(min-width: 640px) 35vw, 80vw"
                      className="object-cover"
                    />
                  </div>
                </ArchFrame>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <SectionLabel align="left">Walimatul Ursy</SectionLabel>
              <h2 className="mt-4 font-inv-display text-3xl leading-tight text-[var(--inv-ink)] sm:text-4xl">
                Akad &amp; Resepsi
              </h2>
              <dl className="mt-6 divide-y divide-[var(--inv-line)] border-y border-[var(--inv-line)]">
                {[
                  { term: "Hari", detail: formatEventDate(data.date) },
                  { term: "Waktu", detail: formatEventTime(data.date) },
                  { term: "Tempat", detail: data.venue },
                  {
                    term: "Alamat",
                    detail: [data.address, data.city].filter(Boolean).join(", ") || "—",
                  },
                ].map((row) => (
                  <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-[90px_1fr] sm:gap-4">
                    <dt className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--inv-accent)]">
                      {row.term}
                    </dt>
                    <dd className="font-inv-display text-lg leading-snug text-[var(--inv-ink)]">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-[var(--inv-muted)]">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara
                berkenan hadir untuk memberikan doa restu.
              </p>
            </Reveal>
          </div>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="px-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl">
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
        <InvitationFooter
          signature={names}
          note="Wassalamu'alaikum warahmatullahi wabarakatuh"
        />
      </main>
    </InvitationShell>
  );
}
