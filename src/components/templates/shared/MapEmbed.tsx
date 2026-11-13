import React from "react";
import { cn } from "@/lib/cn";

interface MapEmbedProps {
  url: string;
  /** Preferred link for the button (e.g. the owner's pasted Maps link). */
  href?: string;
  venue?: string;
  address?: string;
  city?: string;
  /** Matches the surrounding invitation palette. */
  tone?: "light" | "dark";
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
  href,
  venue,
  address,
  city,
  tone = "light",
}) => {
  const lines = [address, city].filter(Boolean).join(", ");
  const query = [venue, address, city].filter(Boolean).join(", ");
  const externalUrl =
    href ||
    (query
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : toExternalUrl(url));
  const dark = tone === "dark";

  return (
    <figure className="w-full">
      <div className={cn("h-64 w-full", dark ? "bg-[#17181A]" : "bg-[#E8E1D3]")}>
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

      <figcaption
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-left",
          dark ? "bg-[#111214]" : "bg-[#FBF7F0]",
        )}
      >
        <div className="min-w-0">
          {venue ? (
            <p
              className={cn(
                "truncate font-serif text-base",
                dark ? "text-[#F3F4F6]" : "text-[#141C2B]",
              )}
            >
              {venue}
            </p>
          ) : null}
          {lines ? (
            <p
              className={cn(
                "truncate text-xs",
                dark ? "text-[#F3F4F6]/55" : "text-[#141C2B]/60",
              )}
            >
              {lines}
            </p>
          ) : null}
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition",
            dark
              ? "border-[#E5A93C]/50 text-[#E5A93C] hover:bg-[#E5A93C]/15"
              : "border-[#C6A15B]/50 text-[#7D5F28] hover:bg-[#C6A15B]/15",
          )}
        >
          Buka di Google Maps
        </a>
      </figcaption>
    </figure>
  );
};
