import React from "react";
import { FloralIvory } from "./floral-ivory";
import { EleganMaison } from "./elegan-maison";
import { DarkNoir } from "./dark-noir";
import { FleksibelCerita } from "./fleksibel-cerita";
import { AdatSekar } from "./adat-sekar";
import { MinimalisLumen } from "./minimalis-lumen";
import { IslamiNurani } from "./islami-nurani";
import { VintageSepia } from "./vintage-sepia";
import { AnimasiKinetic } from "./animasi-kinetic";
import { GameLevelUp } from "./game-levelup";
import { templateCatalog, type TemplateCatalogEntry } from "./catalog";
import { TEMPLATE_ALIASES, canonicalTemplateSlug } from "./shared/theme";
import type { TemplateRenderer, TemplateRenderProps } from "./types";

export type { TemplateRenderProps, TemplateRenderer };
export type { TemplateEventFit } from "./catalog";
export { TEMPLATE_ALIASES };

export interface TemplateMetadata extends TemplateCatalogEntry {
  renderer: TemplateRenderer;
}

const renderers: Record<string, TemplateRenderer> = {
  "floral-ivory": FloralIvory,
  "elegan-maison": EleganMaison,
  "dark-noir": DarkNoir,
  "fleksibel-cerita": FleksibelCerita,
  "adat-sekar": AdatSekar,
  "minimalis-lumen": MinimalisLumen,
  "islami-nurani": IslamiNurani,
  "vintage-sepia": VintageSepia,
  "animasi-kinetic": AnimasiKinetic,
  "game-levelup": GameLevelUp,
};

export const registry: Record<string, TemplateMetadata> = Object.fromEntries(
  templateCatalog.map((entry) => [
    entry.slug,
    { ...entry, renderer: renderers[entry.slug] },
  ]),
);

const FallbackRenderer: TemplateRenderer = () =>
  React.createElement(
    "div",
    {
      style: {
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        fontFamily: "var(--font-cormorant), Georgia, serif",
        background: "#FBF7F0",
        color: "#141C2B",
        textAlign: "center",
      },
    },
    "Template tidak ditemukan. Silakan hubungi pemilik undangan.",
  );

/** Canonical slug for aliases; `null` when nothing matches. */
export function resolveTemplateSlug(slug: string): string | null {
  return canonicalTemplateSlug(slug);
}

export function getTemplate(slug: string): TemplateMetadata | null {
  const canonical = resolveTemplateSlug(slug);
  return canonical ? registry[canonical] : null;
}

export const getRenderer = (slug: string): TemplateRenderer => {
  return getTemplate(slug)?.renderer ?? FallbackRenderer;
};

export const TemplateDispatcher: React.FC<{ slug: string } & TemplateRenderProps> = ({
  slug,
  data,
  eventId,
  messages,
  mode,
}) => {
  const Renderer = getRenderer(slug);
  return React.createElement(Renderer, { data, eventId, messages, mode });
};
