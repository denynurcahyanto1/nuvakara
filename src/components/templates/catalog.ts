import type { TemplatePreview } from "@/lib/types";
import { themes, type TemplateCategory, type TemplateTier } from "./shared/theme";

export type TemplateEventFit = "wedding" | "other";

export interface TemplateCatalogEntry extends TemplatePreview {
  category: TemplateCategory;
  tier: TemplateTier;
  eventFit: TemplateEventFit[];
  isPremium: boolean;
}

const descriptions: Record<string, string> = {
  "floral-ivory":
    "Nuansa ivory, sage, dan blush dengan lengkungan bunga, tipografi serif, serta detail botanikal yang halus.",
  "elegan-maison":
    "Garis art-deco, emas tua, dan tata letak editorial yang tenang — kemewahan yang tidak perlu berteriak.",
  "dark-noir":
    "Latar charcoal, aksen kuningan, dan tipografi besar bergaya majalah. Dramatis, intim, dan berkelas.",
  "fleksibel-cerita":
    "Hangat dan personal, cocok untuk pernikahan maupun acara lain. Kartu besar, warna tanah, dan cerita yang mengalir.",
  "adat-sekar":
    "Marun dan emas dengan ornamen batik, gunungan, serta sapaan Jawa yang membumi.",
  "minimalis-lumen":
    "Ruang kosong yang lapang, garis rambut, dan tipografi tenang. Untuk acara yang ingin bicara pelan.",
  "islami-nurani":
    "Teal dalam, lengkungan arabesque, dan kutipan Ar-Rum 21. Sakral dan hangat dalam satu napas.",
  "vintage-sepia":
    "Kertas tua, burgundy, perangko, dan bingkai ganda. Seperti membuka surat dari masa lalu.",
  "animasi-kinetic":
    "Gradien hidup, orb 3D, parallax, dan marquee. Undangan yang terasa seperti pengalaman.",
  "game-levelup":
    "UI pixel, quest log, dan EXP bar. Untuk perayaan yang ingin terasa seperti petualangan.",
};

const fits: Record<string, TemplateEventFit[]> = {
  "islami-nurani": ["wedding"],
  "adat-sekar": ["wedding"],
  "floral-ivory": ["wedding", "other"],
  "elegan-maison": ["wedding", "other"],
  "dark-noir": ["wedding", "other"],
  "fleksibel-cerita": ["wedding", "other"],
  "minimalis-lumen": ["wedding", "other"],
  "vintage-sepia": ["wedding", "other"],
  "animasi-kinetic": ["wedding", "other"],
  "game-levelup": ["other", "wedding"],
};

/** Catalogue metadata. Kept free of renderer imports so marketing pages stay light. */
export const templateCatalog: TemplateCatalogEntry[] = Object.entries(themes).map(
  ([slug, theme]) => ({
    slug,
    name: theme.name,
    category: theme.category,
    tier: theme.tier,
    palette: theme.palette,
    description: descriptions[slug] ?? "",
    eventFit: fits[slug] ?? ["wedding", "other"],
    isPremium: theme.tier !== "Basic",
  }),
);
