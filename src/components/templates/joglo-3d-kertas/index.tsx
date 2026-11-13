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

const theme = themes["joglo-3d-kertas"];

export function Joglo3DKertas({ data, eventId, messages = [], mode = "live" }: TemplateRenderProps) {
  const portrait = data.coverImage ?? data.images[0] ?? null;
  const names = data.host && data.partner ? `${data.host} & ${data.partner}` : data.title;

  return (
    <InvitationShell
      theme={theme}
      mode={mode}
      musicUrl={data.musicUrl}
      cover={{
        eyebrow: "Pernikahan Adat",
        title: names,
        subtitle: "Joglo 3D Kertas",
        date: data.date,
        image: portrait,
        variant: "arch",
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
      <main className="px-6 py-12">
        <section id="momen" className="text-center">
          <Reveal>
            <h2 className="font-inv-display text-5xl text-[var(--inv-ink)]">{names}</h2>
            <div className="mt-12">
              <Countdown
                targetDate={data.date}
                initialSeconds={secondsUntil(data.date)}
              />
            </div>
          </Reveal>
        </section>

        {data.images.length > 0 ? (
          <section id="galeri" className="mt-20">
            <Reveal>
              <Gallery images={data.images} />
            </Reveal>
          </section>
        ) : null}

        <div className="mt-20">
            <GiftInfo gift={data.gift} />
            <RSVPForm eventId={eventId} readOnly={mode === "preview"} />
            <Guestbook eventId={eventId} messages={messages} readOnly={mode === "preview"} />
        </div>

        <InvitationFooter signature={names} />
      </main>
    </InvitationShell>
  );
}