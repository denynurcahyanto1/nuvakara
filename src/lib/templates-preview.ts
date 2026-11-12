import type { TemplatePreview } from "@/lib/types";

/**
 * Static catalogue of the four flagship templates. Phase 4 replaces this
 * with real template components; Phase 1 only needs the metadata to render
 * the showcase honestly.
 */
export const templatePreviews: TemplatePreview[] = [
  {
    slug: "wedding-classic",
    name: "Wedding Classic",
    category: "Pernikahan",
    description:
      "Elegan dan romantis dengan nuansa ivory, aksen champagne, dan ornamen floral yang halus.",
    isPremium: false,
    palette: "Ivory & Champagne",
  },
  {
    slug: "birthday-celebration",
    name: "Birthday Celebration",
    category: "Ulang Tahun",
    description:
      "Ceria dan berenergi dengan warna cerah, tipografi dinamis, dan animasi confetti.",
    isPremium: false,
    palette: "Colourful & Playful",
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    category: "Baby Shower",
    description:
      "Lembut dan hangat dengan pastel biru dan pink, ilustrasi ramah, serta animasi yang gentle.",
    isPremium: true,
    palette: "Pastel Blue & Pink",
  },
  {
    slug: "graduation-modern",
    name: "Graduation Modern",
    category: "Wisuda",
    description:
      "Premium dan tegas dengan latar hitam, aksen emas, tipografi modern, dan reveal mask wipe.",
    isPremium: true,
    palette: "Black & Gold",
  },
];
