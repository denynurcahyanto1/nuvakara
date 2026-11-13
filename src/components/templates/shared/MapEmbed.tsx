import React from "react";
import { cn } from "@/lib/cn";

interface MapEmbedProps {
  url: string;
  /** Preferred link for the button (e.g. the owner's pasted Maps link). */
  href?: string;
  venue?: string;
  address?: string;
  city?: string;
  /** Kept for template compatibility; colours come from the theme tokens. */
  tone?: "light" | "dark";
  className?: string;
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
  className,
}) => {
  const lines = [address, city].filter(Boolean).join(", ");
  const query = [venue, address, city].filter(Boolean).join(", ");
  const externalUrl =
    href ||
    (query
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : toExternalUrl(url));

  return (
    <figure
      className={cn(
        "w-full overflow-hidden rounded-[var(--inv-radius)] border border-[var(--inv-line)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-64 w-full",
          tone === "dark" ? "bg-[#101114]" : "bg-[var(--inv-accent-soft)]",
        )}
      >
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

      <figcaption className="flex flex-wrap items-center justify-between gap-3 bg-[var(--inv-surface)] px-4 py-3 text-left">
        <div className="min-w-0">
          {venue ? (
            <p className="truncate font-inv-display text-base text-[var(--inv-ink)]">
              {venue}
            </p>
          ) : null}
          {lines ? (
            <p className="truncate text-xs text-[var(--inv-muted)]">{lines}</p>
          ) : null}
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[var(--inv-accent)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--inv-accent)] transition hover:bg-[var(--inv-accent-soft)]"
        >
          Buka di Google Maps
        </a>
      </figcaption>
    </figure>
  );
};
