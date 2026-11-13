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
  "floral-ivory": {
    title: "Rafi & Aisyah",
    date: "2026-12-12T03:00:00Z",
    description:
      "Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.",
    ...place("Grand Ballroom", "Jl. Jenderal Sudirman No. 1", "Jakarta"),
    images: [
      photo("photo-1519741497674-611481863552"),
      photo("photo-1511285560929-80b456fea0bc"),
      photo("photo-1519225421980-715cb0215aed"),
    ],
    host: "Rafi",
    partner: "Aisyah",
    eventType: "wedding",
    quote: "Dua hati yang dipertemukan, tumbuh menjadi satu cerita yang utuh.",
    gift: { bank: "BCA", account: "1234567890", holder: "Rafi & Aisyah" },
  },
  "elegan-maison": {
    title: "Arga & Kirana",
    date: "2026-11-28T09:00:00Z",
    description:
      "Sebuah perayaan cinta, keluarga, dan awal yang baru — dengan sukacita kami menantikan kehadiran Anda.",
    ...place("The Langham", "Jl. Jenderal Sudirman Kav. 52-53", "Jakarta"),
    images: [
      photo("photo-1465495976277-4387d4b0b4c6"),
      photo("photo-1520854221256-17451cc331bf"),
      photo("photo-1606800052052-a08af7148866"),
    ],
    host: "Arga",
    partner: "Kirana",
    eventType: "wedding",
    quote: "Cinta bukan tentang menemukan seseorang yang sempurna, melainkan memilih untuk tetap tinggal.",
    gift: { bank: "Mandiri", account: "9876543210", holder: "Kirana Putri" },
  },
  "dark-noir": {
    title: "Bara & Nadira",
    date: "2026-12-31T12:00:00Z",
    description:
      "Sebuah malam untuk merayakan babak baru. Datanglah, dan jadilah bagian dari cerita yang kami tulis bersama.",
    ...place("Soirée Hall", "Jl. Senopati No. 8", "Jakarta"),
    images: [
      photo("photo-1529636798458-92182e662485"),
      photo("photo-1519741497674-611481863552"),
      photo("photo-1511285560929-80b456fea0bc"),
    ],
    host: "Bara",
    partner: "Nadira",
    eventType: "wedding",
    quote: "Di antara lampu yang redup dan musik yang pelan, kita menemukan rumah.",
    gift: { bank: "BNI", account: "5556667778", holder: "Bara Aditya" },
  },
  "fleksibel-cerita": {
    title: "Nadia's 30th",
    date: "2026-12-20T11:00:00Z",
    description:
      "Tiga puluh tahun, satu malam, dan orang-orang yang membuat semuanya berarti. Mari merayakan bersama.",
    ...place("Kafe Senja", "Jl. Braga No. 12", "Bandung"),
    images: [
      photo("photo-1464349095431-e9a21285b5f3"),
      photo("photo-1530103862676-de8c9debad1d"),
      photo("photo-1511795409834-ef04bbd61622"),
    ],
    host: "Nadia",
    eventType: "birthday",
    quote: "Kita tidak merayakan angka, kita merayakan perjalanan.",
  },
  "adat-sekar": {
    title: "Wisnu & Sekar",
    date: "2026-11-22T02:00:00Z",
    description:
      "Dengan memohon rahmat Tuhan, kami bermaksud menyelenggarakan tasyakuran pernikahan putra-putri kami.",
    ...place("Pendopo Agung", "Jl. Malioboro No. 45", "Yogyakarta"),
    images: [
      photo("photo-1519225421980-715cb0215aed"),
      photo("photo-1520854221256-17451cc331bf"),
      photo("photo-1490750967868-88aa4486c946"),
    ],
    host: "Wisnu",
    partner: "Sekar",
    eventType: "wedding",
    quote: "Tradisi bukan sekadar warisan, melainkan doa yang dirawat dari generasi ke generasi.",
    gift: { bank: "BRI", account: "3344556677", holder: "Sekar Ayu" },
  },
  "minimalis-lumen": {
    title: "Lumen Gathering",
    date: "2027-01-17T04:00:00Z",
    description:
      "Sebuah momen sederhana untuk berkumpul, berbagi cerita, dan merayakan hal yang berarti.",
    ...place("Studio Lumen", "Jl. Kemang Timur No. 21", "Jakarta"),
    images: [
      photo("photo-1490750967868-88aa4486c946"),
      photo("photo-1526506118085-60ce8714f8c5"),
      photo("photo-1511795409834-ef04bbd61622"),
    ],
    host: "Lumen Studio",
    eventType: "other",
    quote: "Yang penting bukan seberapa ramai, tetapi seberapa hadir.",
  },
  "islami-nurani": {
    title: "Fikri & Zahra",
    date: "2026-12-05T01:00:00Z",
    description:
      "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan akad nikah dan walimatul ursy.",
    ...place("Balai Kartini", "Jl. Gatot Subroto Kav. 37", "Jakarta"),
    images: [
      photo("photo-1511285560929-80b456fea0bc"),
      photo("photo-1519741497674-611481863552"),
      photo("photo-1606800052052-a08af7148866"),
    ],
    host: "Fikri",
    partner: "Zahra",
    eventType: "wedding",
    gift: { bank: "BSI", account: "7788990011", holder: "Zahra Amelia" },
  },
  "vintage-sepia": {
    title: "Dimas & Laras",
    date: "2027-02-14T09:00:00Z",
    description:
      "Sebuah perayaan kecil yang penuh makna, dan kami ingin Anda menjadi bagiannya.",
    ...place("Gedung Arsip Nasional", "Jl. Gajah Mada No. 111", "Jakarta"),
    images: [
      photo("photo-1513279922550-250c2129b13a"),
      photo("photo-1520854221256-17451cc331bf"),
      photo("photo-1465495976277-4387d4b0b4c6"),
    ],
    host: "Dimas",
    partner: "Laras",
    eventType: "wedding",
    quote: "Waktu berjalan, tetapi kenangan yang kita buat bersama akan tinggal selamanya.",
    gift: { bank: "BTN", account: "1122334455", holder: "Laras Widya" },
  },
  "animasi-kinetic": {
    title: "Neon Night 2026",
    date: "2026-12-24T12:00:00Z",
    description:
      "Bukan sekadar pesta — ini adalah awal dari cerita yang akan kita rayakan bersama.",
    ...place("Tribrata Hall", "Jl. Jenderal Sudirman No. 1", "Jakarta"),
    images: [
      photo("photo-1518709268805-4e9042af2176"),
      photo("photo-1511795409834-ef04bbd61622"),
      photo("photo-1530103862676-de8c9debad1d"),
    ],
    host: "NUVAKARA Studio",
    eventType: "other",
    quote: "Malam ini, kita menulis ulang arti perayaan.",
  },
  "game-levelup": {
    title: "Level Up: 25",
    date: "2026-11-29T05:00:00Z",
    description:
      "Sebuah misi sederhana: datang, berbagi kebahagiaan, dan jadilah bagian dari cerita ini.",
    ...place("Playground Kemang", "Jl. Kemang Raya No. 14", "Jakarta"),
    images: [
      photo("photo-1550745165-9bc0b252726f"),
      photo("photo-1511512578047-dfb367046420"),
      photo("photo-1464349095431-e9a21285b5f3"),
    ],
    host: "Rian",
    eventType: "birthday",
    quote: "Setiap level baru dimulai dengan satu keberanian untuk menekan start.",
  },
};
