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
  "lilac-flower": "Bunga lilac botani warna pastel lembut, aksen lavender, dan bingkai bunga yang elegan.",
  "cypress-linen": "Tekstur linen hangat, sage green, dan garis minimalis yang menenangkan.",
  "cypress-elegan": "Mewah dengan sentuhan ivory, sage gold, dan garis art-deco yang anggun.",
  "arabix": "Lengkungan kubah teal dalam, bingkai emas arabesque, dan kutipan sakral.",
  "arabian-gold-pattern": "Pola geometris emas di atas latar navy gelap. Sakral dan mewah.",
  "film-roll": "Frame perforasi film sinema, label scene, tiket admit-one, dan nuansa vintage sepia.",
  "film-roll-cinematic": "Nuansa film sinematik dengan grain overlay, efek parallax, dan bar sinema.",
  "whimsical-colorful": "Warna-warni pastel yang manis, orb berkilau, dan elemen visual yang ceria.",
  "joglo-3d-kertas": "Gaya papercraft 3D siluet Joglo Jawa, tekstur kertas tua, dan warna tanah sakral.",
  "playful-playdate": "UI piksel cerah, log misi, EXP bar, dan nuansa game retro 8-bit.",
  "joglo-adat": "Ornamen batik maroon & emas, siluet atap Joglo Jawa, dan sapaan tradisional.",
  "cypress-minimal": "Ruang putih lapang, garis halus, dan tipografi serif yang tenang.",
  "warm-story": "Warna tanah terracotta, kartu cerita mengalir, hangat dan fleksibel untuk semua acara.",
  "editorial-dark": "Latar charcoal gelap, aksen kuningan, dan tata letak majalah editorial yang dramatis.",
};

const fits: Record<string, TemplateEventFit[]> = {
  "lilac-flower": ["wedding"],
  "cypress-linen": ["wedding", "other"],
  "cypress-elegan": ["wedding", "other"],
  "arabix": ["wedding"],
  "arabian-gold-pattern": ["wedding"],
  "film-roll": ["wedding", "other"],
  "film-roll-cinematic": ["wedding", "other"],
  "whimsical-colorful": ["wedding", "other"],
  "joglo-3d-kertas": ["wedding"],
  "playful-playdate": ["other", "wedding"],
  "joglo-adat": ["wedding"],
  "cypress-minimal": ["wedding", "other"],
  "warm-story": ["wedding", "other"],
  "editorial-dark": ["wedding", "other"],
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