import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { registry } from "@/components/templates/registry";
import type { TemplateData } from "@/lib/templates-data";

// The forms call server actions through `useActionState`; the network is not
// part of these render tests.
vi.mock("@/lib/actions/events-rsvp", () => ({
  createRSVPAction: vi.fn(),
  createGuestbookMessageAction: vi.fn(),
}));

const baseData: TemplateData = {
  title: "Custom Event Title",
  date: "2026-12-31T11:00:00Z",
  description: "Custom celebration description",
  venue: "Custom Location Hall",
  address: "Jl. Contoh No. 1",
  city: "Jakarta",
  mapUrl: "https://maps.google.com/maps?q=Custom&output=embed",
  musicUrl: "https://example.com/audio.mp3",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  eventType: "wedding",
};

const entries = Object.values(registry);

describe("Invitation templates", () => {
  test.each(entries.map((entry) => [entry.slug, entry] as const))(
    "%s renders the cover, event data, map, and a disabled preview form",
    (_slug, template) => {
      const Renderer = template.renderer;
      const { container } = render(
        <Renderer
          data={baseData}
          messages={[{ name: "Dinda", content: "Selamat ya!" }]}
          mode="preview"
        />,
      );

      // Cover gate is the first thing a guest sees.
      expect(screen.getByRole("button", { name: /Lihat Pratinjau/i })).toBeInTheDocument();
      expect(screen.getAllByText("Custom Event Title").length).toBeGreaterThan(0);

      // The map iframe is present and labelled for screen readers.
      expect(screen.getByTitle(/Peta lokasi/)).toBeInTheDocument();

      // RSVP + guestbook render as a visual preview, not a live form.
      const notes = screen.getAllByText(/formulir aktif pada undangan asli/i);
      expect(notes.length).toBe(2);
      expect(screen.getByText("Selamat ya!")).toBeInTheDocument();

      expect(container.querySelector(`[data-template="${template.slug}"]`)).not.toBeNull();
    },
  );

  test("every template renders without a map, gallery, or music URL", () => {
    const sparse: TemplateData = {
      title: "Sparse Event",
      date: "2026-12-31T11:00:00Z",
      description: "",
      venue: "Rumah",
      images: [],
    };

    for (const template of entries) {
      const Renderer = template.renderer;
      const { unmount } = render(<Renderer data={sparse} mode="preview" />);
      expect(screen.getAllByText("Sparse Event").length).toBeGreaterThan(0);
      unmount();
    }
  });
});
