import React from "react";

interface MapEmbedProps {
  url: string;
  venue?: string;
  address?: string;
  city?: string;
}

/** Strips the embed-only flag so the same URL can open in a normal tab. */
function toExternalUrl(url: string): string {
  return url
    .replace(/([?&])output=embed(&|$)/, "$1")
    .replace(/[?&]$/, "");
}

/**
 * Map block shared by every template. Google occasionally refuses to render
 * inside an iframe (consent walls, headless browsers), so the address and a
 * direct link are always visible below the embed as a fallback.
 */
export const MapEmbed: React.FC<MapEmbedProps> = ({
  url,
  venue,
  address,
  city,
}) => {
  const lines = [address, city].filter(Boolean).join(", ");
  const query = [venue, address, city].filter(Boolean).join(", ");
  const externalUrl = query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : toExternalUrl(url);

  return (
    <figure className="w-full">
      <div className="h-64 w-full bg-[#E8E1D3]">
        <iframe
          src={url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={venue ? `Peta lokasi ${venue}` : "Peta lokasi acara"}
        />
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 bg-[#FBF7F0] px-4 py-3 text-left">
        <div className="min-w-0">
          {venue ? (
            <p className="truncate font-serif text-base text-[#141C2B]">
              {venue}
            </p>
          ) : null}
          {lines ? (
            <p className="truncate text-xs text-[#141C2B]/60">{lines}</p>
          ) : null}
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[#C6A15B]/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7D5F28] transition hover:bg-[#C6A15B]/15"
        >
          Buka di Google Maps
        </a>
      </figcaption>
    </figure>
  );
};
