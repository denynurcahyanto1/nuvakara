import type { TemplateData } from "./templates-data";

function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

function place(venue: string, address: string, city: string) {
  const query = [venue, address, city].join(", ");
  return { venue, address, city, mapUrl: mapsEmbedUrl(query), mapsLink: mapsLink(query) };
}

/**
 * Curated sample content for the public `/template/[slug]` previews. The
 * marketing "Preview" buttons point here, so every registered template must
 * have an entry (enforced by tests/lib/templates-demo.test.ts).
 */
export const demoTemplateData: Record<string, TemplateData> = {
  "lilac-flower": {
    title: "Lilac Flower Demo",
    date: "2026-12-12T03:00:00Z",
    description: "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.",
    ...place("Grand Ballroom", "Jl. Jenderal Sudirman No. 1", "Jakarta"),
    images: [photo("photo-1519741497674-611481863552")],
    host: "Rafi",
    partner: "Aisyah",
    eventType: "wedding",
  },
  "cypress-linen": {
    title: "Cypress Linen Demo",
    date: "2026-11-28T09:00:00Z",
    description: "Sebuah perayaan cinta dan kebahagiaan.",
    ...place("The Langham", "Jl. Jenderal Sudirman", "Jakarta"),
    images: [photo("photo-1465495976277-4387d4b0b4c6")],
    host: "Arga",
    partner: "Kirana",
    eventType: "wedding",
  },
  "cypress-elegan": {
    title: "Cypress Elegan Demo",
    date: "2026-12-31T12:00:00Z",
    description: "Perayaan elegan nan anggun.",
    ...place("Soirée Hall", "Jl. Senopati", "Jakarta"),
    images: [photo("photo-1529636798458-92182e662485")],
    host: "Bara",
    partner: "Nadira",
    eventType: "wedding",
  },
  "arabix": {
    title: "Arabix Demo",
    date: "2026-12-05T01:00:00Z",
    description: "Undangan Islami bernuansa emas dan teal.",
    ...place("Balai Kartini", "Jl. Gatot Subroto", "Jakarta"),
    images: [photo("photo-1511285560929-80b456fea0bc")],
    host: "Fikri",
    partner: "Zahra",
    eventType: "wedding",
  },
  "arabian-gold-pattern": {
    title: "Arabian Gold Demo",
    date: "2026-12-05T01:00:00Z",
    description: "Lattice emas mewah di atas latar navy.",
    ...place("Balai Kartini", "Jl. Gatot Subroto", "Jakarta"),
    images: [photo("photo-1511285560929-80b456fea0bc")],
    host: "Fikri",
    partner: "Zahra",
    eventType: "wedding",
  },
  "film-roll": {
    title: "Film Roll Demo",
    date: "2027-02-14T09:00:00Z",
    description: "Frame sinematik vintage sepia.",
    ...place("Gedung Arsip Nasional", "Jl. Gajah Mada", "Jakarta"),
    images: [photo("photo-1513279922550-250c2129b13a")],
    host: "Dimas",
    partner: "Laras",
    eventType: "wedding",
  },
  "film-roll-cinematic": {
    title: "Film Roll Cinematic Demo",
    date: "2027-02-14T09:00:00Z",
    description: "Pengalaman sinematik dengan grain overlay.",
    ...place("Gedung Arsip Nasional", "Jl. Gajah Mada", "Jakarta"),
    images: [photo("photo-1513279922550-250c2129b13a")],
    host: "Dimas",
    partner: "Laras",
    eventType: "wedding",
  },
  "whimsical-colorful": {
    title: "Whimsical Colorful Demo",
    date: "2026-12-20T11:00:00Z",
    description: "Ceria, pastel, dan penuh kilau.",
    ...place("Kafe Senja", "Jl. Braga", "Bandung"),
    images: [photo("photo-1464349095431-e9a21285b5f3")],
    host: "Nadia",
    eventType: "birthday",
  },
  "joglo-3d-kertas": {
    title: "Joglo 3D Kertas Demo",
    date: "2026-11-22T02:00:00Z",
    description: "Gaya papercraft siluet Joglo.",
    ...place("Pendopo Agung", "Jl. Malioboro", "Yogyakarta"),
    images: [photo("photo-1519225421980-715cb0215aed")],
    host: "Wisnu",
    partner: "Sekar",
    eventType: "wedding",
  },
  "playful-playdate": {
    title: "Playful Playdate Demo",
    date: "2026-11-29T05:00:00Z",
    description: "Theme piksel dan quest 8-bit.",
    ...place("Playground Kemang", "Jl. Kemang Raya", "Jakarta"),
    images: [photo("photo-1550745165-9bc0b252726f")],
    host: "Rian",
    eventType: "birthday",
  },
  "joglo-adat": {
    title: "Joglo Adat Demo",
    date: "2026-11-22T02:00:00Z",
    description: "Ornamen batik maroon & emas.",
    ...place("Pendopo Agung", "Jl. Malioboro", "Yogyakarta"),
    images: [photo("photo-1519225421980-715cb0215aed")],
    host: "Wisnu",
    partner: "Sekar",
    eventType: "wedding",
  },
  "cypress-minimal": {
    title: "Cypress Minimal Demo",
    date: "2027-01-17T04:00:00Z",
    description: "Minimalis, bersih, dan menenangkan.",
    ...place("Studio Lumen", "Jl. Kemang Timur", "Jakarta"),
    images: [photo("photo-1490750967868-88aa4486c946")],
    host: "Lumen Studio",
    eventType: "other",
  },
  "warm-story": {
    title: "Warm Story Demo",
    date: "2026-12-20T11:00:00Z",
    description: "Nuansa terracotta yang hangat.",
    ...place("Kafe Senja", "Jl. Braga", "Bandung"),
    images: [photo("photo-1464349095431-e9a21285b5f3")],
    host: "Nadia",
    eventType: "birthday",
  },
  "editorial-dark": {
    title: "Editorial Dark Demo",
    date: "2026-12-31T12:00:00Z",
    description: "Charcoal dan kuningan gaya majalah.",
    ...place("Soirée Hall", "Jl. Senopati", "Jakarta"),
    images: [photo("photo-1529636798458-92182e662485")],
    host: "Bara",
    partner: "Nadira",
    eventType: "wedding",
  },

  // Legacy mappings for backwards compatibility
  "floral-ivory": {
    title: "Rafi & Aisyah",
    date: "2026-12-12T03:00:00Z",
    description: "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.",
    ...place("Grand Ballroom", "Jl. Jenderal Sudirman No. 1", "Jakarta"),
    images: [photo("photo-1519741497674-611481863552")],
    host: "Rafi",
    partner: "Aisyah",
    eventType: "wedding",
  },
  "elegan-maison": {
    title: "Arga & Kirana",
    date: "2026-11-28T09:00:00Z",
    description: "Sebuah perayaan cinta.",
    ...place("The Langham", "Jl. Jenderal Sudirman", "Jakarta"),
    images: [photo("photo-1465495976277-4387d4b0b4c6")],
    host: "Arga",
    partner: "Kirana",
    eventType: "wedding",
  },
  "dark-noir": {
    title: "Bara & Nadira",
    date: "2026-12-31T12:00:00Z",
    description: "Sebuah malam untuk merayakan babak baru.",
    ...place("Soirée Hall", "Jl. Senopati", "Jakarta"),
    images: [photo("photo-1529636798458-92182e662485")],
    host: "Bara",
    partner: "Nadira",
    eventType: "wedding",
  },
  "fleksibel-cerita": {
    title: "Nadia's 30th",
    date: "2026-12-20T11:00:00Z",
    description: "Mari merayakan bersama.",
    ...place("Kafe Senja", "Jl. Braga", "Bandung"),
    images: [photo("photo-1464349095431-e9a21285b5f3")],
    host: "Nadia",
    eventType: "birthday",
  },
  "adat-sekar": {
    title: "Wisnu & Sekar",
    date: "2026-11-22T02:00:00Z",
    description: "Tasyakuran pernikahan.",
    ...place("Pendopo Agung", "Jl. Malioboro", "Yogyakarta"),
    images: [photo("photo-1519225421980-715cb0215aed")],
    host: "Wisnu",
    partner: "Sekar",
    eventType: "wedding",
  },
  "minimalis-lumen": {
    title: "Lumen Gathering",
    date: "2027-01-17T04:00:00Z",
    description: "Sebuah momen sederhana.",
    ...place("Studio Lumen", "Jl. Kemang Timur", "Jakarta"),
    images: [photo("photo-1490750967868-88aa4486c946")],
    host: "Lumen Studio",
    eventType: "other",
  },
  "islami-nurani": {
    title: "Fikri & Zahra",
    date: "2026-12-05T01:00:00Z",
    description: "Akad nikah dan walimatul ursy.",
    ...place("Balai Kartini", "Jl. Gatot Subroto", "Jakarta"),
    images: [photo("photo-1511285560929-80b456fea0bc")],
    host: "Fikri",
    partner: "Zahra",
    eventType: "wedding",
  },
  "vintage-sepia": {
    title: "Dimas & Laras",
    date: "2027-02-14T09:00:00Z",
    description: "Sebuah perayaan kecil.",
    ...place("Gedung Arsip Nasional", "Jl. Gajah Mada", "Jakarta"),
    images: [photo("photo-1513279922550-250c2129b13a")],
    host: "Dimas",
    partner: "Laras",
    eventType: "wedding",
  },
  "animasi-kinetic": {
    title: "Neon Night 2026",
    date: "2026-12-24T12:00:00Z",
    description: "Awal dari cerita.",
    ...place("Tribrata Hall", "Jl. Jenderal Sudirman", "Jakarta"),
    images: [photo("photo-1518709268805-4e9042af2176")],
    host: "NUVAKARA Studio",
    eventType: "other",
  },
  "game-levelup": {
    title: "Level Up: 25",
    date: "2026-11-29T05:00:00Z",
    description: "Jadilah bagian dari cerita ini.",
    ...place("Playground Kemang", "Jl. Kemang Raya", "Jakarta"),
    images: [photo("photo-1550745165-9bc0b252726f")],
    host: "Rian",
    eventType: "birthday",
  },
};