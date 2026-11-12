import type { Feature, NavLink } from "@/lib/types";

/**
 * Single source of truth for brand identity and marketing copy.
 * Changing the brand name, tagline or any landing-page copy happens here only.
 */
export const siteConfig = {
  name: "NUVAKARA",
  tagline: "Every Moment Deserves a Beautiful Invitation.",
  description:
    "Ubah momen spesial menjadi pengalaman digital yang tak terlupakan bersama Nuvakara.",
  nav: [
    { label: "Home", href: "/#beranda" },
    { label: "Fitur", href: "/#fitur" },
    { label: "Template", href: "/#template" },
    { label: "Harga", href: "/#harga" },
    { label: "Tentang Kami", href: "/#tentang" },
  ] as NavLink[],
  features: [
    {
      id: "digital-invitation",
      title: "Undangan digital",
      description:
        "Undangan interaktif dengan URL unik yang bisa dibuka siapa saja, kapan saja, tanpa perlu cetak.",
      icon: "invitation",
    },
    {
      id: "premium-templates",
      title: "Berbagai template premium",
      description:
        "Empat template dengan karakter visual berbeda — elegance, celebratory, tender, dan modern.",
      icon: "templates",
    },
    {
      id: "rsvp",
      title: "RSVP online",
      description:
        "Tamu mengonfirmasi kehadiran langsung dari halaman undangan, lengkap dengan jumlah tamu.",
      icon: "rsvp",
    },
    {
      id: "guestbook",
      title: "Guestbook",
      description:
        "Kumpulkan ucapan dan doa dari tamu di satu halaman, dengan moderasi sebelum tampil.",
      icon: "guestbook",
    },
    {
      id: "gallery",
      title: "Galeri foto",
      description:
        "Bagikan momen terbaik melalui galeri foto yang elegan dan ringan dimuat di ponsel.",
      icon: "gallery",
    },
    {
      id: "music",
      title: "Musik latar",
      description:
        "Pilih nada pengiring untuk suasana acara yang lebih hangat dan personal.",
      icon: "music",
    },
    {
      id: "countdown",
      title: "Countdown acara",
      description:
        "Hitung mundur waktu menuju hari besar, membuat tamu ikut bersemangat dan tidak lupa.",
      icon: "countdown",
    },
    {
      id: "maps",
      title: "Lokasi Google Maps",
      description:
        "Tampilkan lokasi acara di peta dengan tombol rute sekali ketuk untuk Directions.",
      icon: "maps",
    },
    {
      id: "analytics",
      title: "Statistik pengunjung",
      description:
        "Pantau jumlah pengunjung, sumber traffic, dan reconfirmasi kehadiran lewat dasbor.",
      icon: "analytics",
    },
    {
      id: "whatsapp",
      title: "Bagikan undangan melalui WhatsApp",
      description:
        "Kirim tautan undangan ke grup WhatsApp dalam satu ketukan, lengkap dengan pesan siap kirim.",
      icon: "whatsapp",
    },
  ] as Feature[],
  howItWorks: [
    {
      step: "01",
      title: "Buat akun",
      description: "Daftar dengan email, lalu lengkapi profil singkat.",
    },
    {
      step: "02",
      title: "Pilih template",
      description: "Pilih karakter visual yang paling sesuai dengan acara Anda.",
    },
    {
      step: "03",
      title: "Isi informasi acara",
      description: "Tanggal, lokasi, galeri, musik, dan detail penting lainnya.",
    },
    {
      step: "04",
      title: "Publikasikan undangan",
      description: "Satu klik untuk menerbitkan dan mendapatkan link unik.",
    },
    {
      step: "05",
      title: "Bagikan ke tamu",
      description: "Kirim link via WhatsApp, email, atau media sosial.",
    },
  ],
  footer: {
    description:
      "Platform undangan digital premium untuk momen yang layak dikenang.",
    navGroups: [
      {
        title: "Produk",
        links: [
          { label: "Fitur", href: "/#fitur" },
          { label: "Template", href: "/#template" },
          { label: "Harga", href: "/#harga" },
          { label: "Buat Undangan", href: "/daftar" },
        ],
      },
      {
        title: "Perusahaan",
        links: [
          { label: "Tentang Kami", href: "/tentang" },
          { label: "Kebijakan Platform", href: "/ketentuan" },
          { label: "Kebijakan Privasi", href: "/privasi" },
        ],
      },
      {
        title: "Akun",
        links: [
          { label: "Masuk", href: "/login" },
          { label: "Daftar", href: "/register" },
          { label: "Dasbor", href: "/dashboard" },
        ],
      },
    ] as { title: string; links: NavLink[] }[],
    contact: {
      email: "halo@nuvakara.com",
      phone: "+62 812 0000 0000",
      address: "Jakarta, Indonesia",
    },
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "WhatsApp", href: "https://wa.me/6281200000000" },
    ] as NavLink[],
  },
} as const;

export type SiteConfig = typeof siteConfig;
