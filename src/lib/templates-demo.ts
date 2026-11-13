import type { TemplateData } from "./templates-data";

function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/**
 * Curated sample content for the public `/template/[slug]` previews. The
 * marketing "Preview" buttons point here, so every template must have an entry
 * (enforced by tests/lib/templates-demo.test.ts).
 */
export const demoTemplateData: Record<string, TemplateData> = {
  "wedding-classic": {
    title: "Rafi & Aisyah",
    date: "2026-12-12T03:00:00Z",
    description:
      "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.",
    venue: "Grand Ballroom, Jakarta",
    address: "Jl. Jenderal Sudirman No. 1",
    city: "Jakarta",
    mapUrl: mapsEmbedUrl("Grand Ballroom, Jl. Jenderal Sudirman No. 1, Jakarta"),
    mapsLink: mapsLink("Grand Ballroom, Jl. Jenderal Sudirman No. 1, Jakarta"),
    images: [
      photo("photo-1519741497674-611481863552"),
      photo("photo-1511285560929-80b456fea0bc"),
    ],
    host: "Rafi",
    partner: "Aisyah",
    eventType: "wedding",
  },
  "birthday-celebration": {
    title: "Nadia's 25th Birthday",
    date: "2026-12-20T11:00:00Z",
    description:
      "Satu perayaan kecil untuk satu tahun yang luar biasa. Mari merayakan bersama!",
    venue: "Kafe Senja, Bandung",
    address: "Jl. Braga No. 12",
    city: "Bandung",
    mapUrl: mapsEmbedUrl("Kafe Senja, Jl. Braga No. 12, Bandung"),
    mapsLink: mapsLink("Kafe Senja, Jl. Braga No. 12, Bandung"),
    images: [
      photo("photo-1464349095431-e9a21285b5f3"),
      photo("photo-1530103862676-de8c9debad1d"),
    ],
    host: "Nadia",
    eventType: "birthday",
  },
  "baby-shower": {
    title: "Baby Shower Alya & Bima",
    date: "2026-12-06T06:00:00Z",
    description:
      "Dengan sukacita kami mengundang Anda untuk merayakan calon buah hati kami.",
    venue: "Sweet Garden Cafe, Jakarta",
    address: "Jl. Kemang Raya No. 8",
    city: "Jakarta",
    mapUrl: mapsEmbedUrl("Sweet Garden Cafe, Jl. Kemang Raya No. 8, Jakarta"),
    mapsLink: mapsLink("Sweet Garden Cafe, Jl. Kemang Raya No. 8, Jakarta"),
    images: [
      photo("photo-1519689680058-324335c77eba"),
      photo("photo-1522771930-78848d9293e8"),
    ],
    host: "Alya",
    partner: "Bima",
    eventType: "baby-shower",
  },
  "graduation-modern": {
    title: "Wisuda Kelas 2026",
    date: "2026-12-19T02:00:00Z",
    description:
      "Merayakan kerja keras dan pencapaian Kelas 2026. Terima kasih atas dukungan Anda.",
    venue: "Auditorium Magna, University Hall",
    address: "Jl. Pendidikan No. 45",
    city: "Yogyakarta",
    mapUrl: mapsEmbedUrl("Auditorium Magna, Jl. Pendidikan No. 45, Yogyakarta"),
    mapsLink: mapsLink("Auditorium Magna, Jl. Pendidikan No. 45, Yogyakarta"),
    images: [
      photo("photo-1523580494863-6f3031224c94"),
      photo("photo-1627556704290-2b1f5853ff78"),
    ],
    host: "Kelas 2026",
    eventType: "graduation",
  },
};
