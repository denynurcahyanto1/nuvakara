import type { Database } from "@/types/database";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

/**
 * Shape consumed by every template renderer. Templates read these keys with
 * their own fallbacks, so missing values degrade to the template's defaults.
 */
export interface TemplateData {
  title: string;
  date: string;
  description: string;
  venue: string;
  mapUrl?: string;
  musicUrl?: string;
  images: string[];
  host?: string;
  partner?: string;
  address?: string;
  city?: string;
  coverImage?: string | null;
  eventType?: string;
}

function parseGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

/** Google Maps embed URL without an API key. */
function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/**
 * Projects an `events` row into the template contract so the public invitation
 * renders the owner's real data instead of template placeholders.
 */
export function eventToTemplateData(event: EventRow): TemplateData {
  const stored = (event.template_data ?? {}) as Record<string, unknown>;

  const host = event.host_name ?? undefined;
  const partner = event.partner_name ?? undefined;

  const coupleTitle =
    host && partner ? `${host} & ${partner}` : host ? `${event.name}` : event.name;

  const venueParts = [event.venue_name, event.city].filter(Boolean);

  const addressQuery =
    [event.venue_name, event.venue_address, event.city].filter(Boolean).join(", ") || "";

  const gallery = parseGallery(
    (stored.images as unknown) ?? (event.gallery_urls as unknown),
  );

  const images = [
    ...(event.cover_image ? [event.cover_image] : []),
    ...gallery.filter((src) => src !== event.cover_image),
  ];

  return {
    title: (stored.title as string) ?? coupleTitle,
    date:
      (stored.date as string) ??
      event.event_date ??
      event.created_at ??
      new Date().toISOString(),
    description: (stored.description as string) ?? event.description ?? "",
    venue: (stored.venue as string) ?? venueParts.join(", "),
    mapUrl:
      (stored.mapUrl as string) ??
      event.maps_url ??
      (addressQuery ? mapsEmbedUrl(addressQuery) : undefined),
    musicUrl: (stored.musicUrl as string) ?? event.music_url ?? undefined,
    images,
    host,
    partner,
    address: event.venue_address ?? undefined,
    city: event.city ?? undefined,
    coverImage: event.cover_image,
    eventType: event.event_type ?? "wedding",
  };
}
