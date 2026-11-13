import { describe, expect, test } from "vitest";
import { eventToTemplateData } from "@/lib/templates-data";
import type { Database } from "@/types/database";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

function makeEvent(overrides: Partial<EventRow> = {}): EventRow {
  return {
    id: 1,
    owner_id: "owner",
    name: "Pernikahan Deny & Sonya",
    slug: "deny-sonya",
    description: "Kami mengundang Anda.",
    cover_image: null,
    template_slug: "wedding-classic",
    template_data: {},
    is_published: true,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
    event_type: "wedding",
    host_name: "Deny",
    partner_name: "Sonya",
    event_date: "2026-12-12T03:00:00Z",
    venue_name: "Grand Ballroom",
    venue_address: "Jl. Sudirman No. 1",
    city: "Jakarta",
    maps_url: null,
    music_url: null,
    gallery_urls: [],
    ...overrides,
  } as EventRow;
}

describe("eventToTemplateData", () => {
  test("builds the couple title and venue from real columns", () => {
    const data = eventToTemplateData(makeEvent());

    expect(data.title).toBe("Deny & Sonya");
    expect(data.venue).toBe("Grand Ballroom, Jakarta");
    expect(data.address).toBe("Jl. Sudirman No. 1");
    expect(data.date).toBe("2026-12-12T03:00:00Z");
  });

  test("generates an embeddable map from the address", () => {
    const data = eventToTemplateData(makeEvent());

    expect(data.mapUrl).toContain("output=embed");
    expect(data.mapUrl).toContain("Grand%20Ballroom");
  });

  test("keeps a pasted share link for the button but embeds the address", () => {
    const data = eventToTemplateData(
      makeEvent({ maps_url: "https://maps.app.goo.gl/abc123" }),
    );

    expect(data.mapUrl).toContain("output=embed");
    expect(data.mapsLink).toBe("https://maps.app.goo.gl/abc123");
  });

  test("uses an explicit embed URL as-is", () => {
    const embed = "https://www.google.com/maps/embed?pb=xyz";
    const data = eventToTemplateData(makeEvent({ maps_url: embed }));

    expect(data.mapUrl).toBe(embed);
  });

  test("merges cover image and gallery without duplicates", () => {
    const data = eventToTemplateData(
      makeEvent({
        cover_image: "https://img/cover.jpg",
        gallery_urls: ["https://img/cover.jpg", "https://img/2.jpg"],
      }),
    );

    expect(data.images).toEqual(["https://img/cover.jpg", "https://img/2.jpg"]);
  });

  test("falls back to defaults for an empty event", () => {
    const data = eventToTemplateData(
      makeEvent({
        host_name: null,
        partner_name: null,
        event_date: null,
        venue_name: null,
        venue_address: null,
        city: null,
      }),
    );

    expect(data.title).toBe("Pernikahan Deny & Sonya");
    expect(data.venue).toBe("");
    expect(data.date).toBe("2026-11-01T00:00:00Z");
  });
});
