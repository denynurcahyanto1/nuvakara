import type { CSSProperties } from "react";

/**
 * Theme tokens for the invitation templates.
 *
 * Every template renders inside `InvitationShell`, which puts these values on
 * the root element as CSS custom properties. Shared blocks (countdown, RSVP,
 * guestbook, map) style themselves with `var(--inv-*)`, so they inherit the
 * template's identity without receiving colours through props.
 *
 * `globals.css` declares the same variables on `:root` with the brand palette,
 * so the blocks still render correctly outside a shell.
 */

export type TemplateTier = "Basic" | "Premium" | "Eksklusif" | "Luxury";

export type TemplateCategory =
  | "Desain fleksibel"
  | "Adat"
  | "Minimalis"
  | "Floral"
  | "Elegan"
  | "Islami"
  | "Vintage"
  | "Animasi & 3D"
  | "Game"
  | "Dark & moody";

export interface TemplateTheme {
  slug: string;
  name: string;
  category: TemplateCategory;
  tier: TemplateTier;
  /** Short human label for the catalogue swatch, e.g. "Ivory & Sage". */
  palette: string;
  background: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  line: string;
  fontDisplay: string;
  fontBody: string;
  radius: string;
  tone: "light" | "dark";
}

/** Old slugs stored on existing events. Mapped to new 14-template design system. */
export const TEMPLATE_ALIASES: Record<string, string> = {
  "wedding-classic": "lilac-flower",
  "birthday-celebration": "warm-story",
  "baby-shower": "cypress-minimal",
  "graduation-modern": "editorial-dark",
};

const serif = "var(--font-cormorant), ui-serif, Georgia, serif";
const sans = "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif";
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

export const themes: Record<string, TemplateTheme> = {
  // FLORAL
  "lilac-flower": {
    slug: "lilac-flower",
    name: "Lilac Flower",
    category: "Floral",
    tier: "Eksklusif",
    palette: "Lilac & Cream",
    background: "#F8F0FA",
    surface: "rgba(255, 252, 255, 0.9)",
    ink: "#2D1B3D",
    muted: "#7A6B8A",
    accent: "#B892D9",
    accentSoft: "#EDE3F5",
    onAccent: "#2D1B3D",
    line: "rgba(45, 27, 61, 0.14)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1.5rem",
    tone: "light",
  },
  "cypress-linen": {
    slug: "cypress-linen",
    name: "Cypress Linen",
    category: "Floral",
    tier: "Premium",
    palette: "Sage & Warm Neutral",
    background: "#F5F2EB",
    surface: "rgba(255, 253, 249, 0.92)",
    ink: "#1E2A24",
    muted: "#6B7A6E",
    accent: "#8FA491",
    accentSoft: "#E8EDE9",
    onAccent: "#1E2A24",
    line: "rgba(30, 42, 36, 0.12)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.75rem",
    tone: "light",
  },

  // ELEGAN
  "cypress-elegan": {
    slug: "cypress-elegan",
    name: "Cypress Elegan",
    category: "Elegan",
    tier: "Luxury",
    palette: "Ivory & Sage Gold",
    background: "#FAF8F3",
    surface: "rgba(255, 254, 250, 0.9)",
    ink: "#1A1F18",
    muted: "#6E7A6B",
    accent: "#B8A05E",
    accentSoft: "#F0EBE0",
    onAccent: "#1A1F18",
    line: "rgba(26, 31, 24, 0.1)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.25rem",
    tone: "light",
  },

  // ISLAMI
  "arabix": {
    slug: "arabix",
    name: "Arabix",
    category: "Islami",
    tier: "Premium",
    palette: "Deep Teal & Gold",
    background: "#F0F5F4",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#0D2B2A",
    muted: "#4A6B6A",
    accent: "#C8A24A",
    accentSoft: "#E8E2D0",
    onAccent: "#0D2B2A",
    line: "rgba(13, 43, 42, 0.16)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "2rem",
    tone: "light",
  },
  "arabian-gold-pattern": {
    slug: "arabian-gold-pattern",
    name: "Arabian Gold Pattern",
    category: "Islami",
    tier: "Luxury",
    palette: "Navy & Gold Lattice",
    background: "#0A1628",
    surface: "rgba(255, 255, 255, 0.04)",
    ink: "#F5F0E8",
    muted: "rgba(245, 240, 232, 0.6)",
    accent: "#D4A843",
    accentSoft: "rgba(212, 168, 67, 0.12)",
    onAccent: "#0A1628",
    line: "rgba(245, 240, 232, 0.1)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.5rem",
    tone: "dark",
  },

  // VINTAGE
  "film-roll": {
    slug: "film-roll",
    name: "Film Roll",
    category: "Vintage",
    tier: "Premium",
    palette: "Cinematic Sepia & Gold",
    background: "#1A1612",
    surface: "rgba(255, 248, 235, 0.06)",
    ink: "#F5E8D0",
    muted: "rgba(245, 232, 208, 0.55)",
    accent: "#C8A24A",
    accentSoft: "rgba(200, 162, 74, 0.12)",
    onAccent: "#1A1612",
    line: "rgba(245, 232, 208, 0.12)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.125rem",
    tone: "dark",
  },

  // ANIMASI & 3D
  "film-roll-cinematic": {
    slug: "film-roll-cinematic",
    name: "Film Roll Cinematic",
    category: "Animasi & 3D",
    tier: "Luxury",
    palette: "Cinematic Ink & Brass",
    background: "#0A0A0C",
    surface: "rgba(255, 250, 240, 0.04)",
    ink: "#F5F0E8",
    muted: "rgba(245, 240, 232, 0.5)",
    accent: "#C8A24A",
    accentSoft: "rgba(200, 162, 74, 0.1)",
    onAccent: "#0A0A0C",
    line: "rgba(245, 240, 232, 0.08)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0rem",
    tone: "dark",
  },
  "whimsical-colorful": {
    slug: "whimsical-colorful",
    name: "Whimsical Colorful",
    category: "Animasi & 3D",
    tier: "Eksklusif",
    palette: "Pastel Rainbow",
    background: "#FDF8F5",
    surface: "rgba(255, 255, 255, 0.94)",
    ink: "#2D2A35",
    muted: "#8A8494",
    accent: "#F4A261",
    accentSoft: "#FEF3EB",
    onAccent: "#2D2A35",
    line: "rgba(45, 42, 53, 0.1)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "2rem",
    tone: "light",
  },
  "joglo-3d-kertas": {
    slug: "joglo-3d-kertas",
    name: "Joglo 3D Kertas",
    category: "Animasi & 3D",
    tier: "Luxury",
    palette: "Earth & Paper",
    background: "#F2E8DB",
    surface: "rgba(255, 252, 248, 0.9)",
    ink: "#2D2218",
    muted: "#7A6E62",
    accent: "#B8860B",
    accentSoft: "#F0E8DC",
    onAccent: "#2D2218",
    line: "rgba(45, 34, 24, 0.14)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1rem",
    tone: "light",
  },

  // GAME
  "playful-playdate": {
    slug: "playful-playdate",
    name: "Playful Playdate",
    category: "Game",
    tier: "Premium",
    palette: "Bright Pixel",
    background: "#0D1117",
    surface: "rgba(255, 255, 255, 0.05)",
    ink: "#E6EDF3",
    muted: "#8B949E",
    accent: "#FFD700",
    accentSoft: "rgba(255, 215, 0, 0.12)",
    onAccent: "#0D1117",
    line: "rgba(255, 215, 0, 0.25)",
    fontDisplay: mono,
    fontBody: sans,
    radius: "0rem",
    tone: "dark",
  },

  // ADAT
  "joglo-adat": {
    slug: "joglo-adat",
    name: "Joglo Adat",
    category: "Adat",
    tier: "Eksklusif",
    palette: "Maroon & Gold Batik",
    background: "#F5ECE3",
    surface: "rgba(255, 250, 243, 0.9)",
    ink: "#3D151A",
    muted: "#8A5A55",
    accent: "#C8963E",
    accentSoft: "#F2E8DC",
    onAccent: "#3D151A",
    line: "rgba(61, 21, 26, 0.2)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1.25rem",
    tone: "light",
  },

  // MINIMALIS
  "cypress-minimal": {
    slug: "cypress-minimal",
    name: "Cypress Minimal",
    category: "Minimalis",
    tier: "Basic",
    palette: "Paper White & Sage",
    background: "#FAFAF8",
    surface: "rgba(255, 255, 255, 0.96)",
    ink: "#16181A",
    muted: "#787D7B",
    accent: "#8FA491",
    accentSoft: "#EDF1EC",
    onAccent: "#101311",
    line: "rgba(22, 24, 26, 0.08)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.125rem",
    tone: "light",
  },

  // DESAIN FLEKSIBEL
  "warm-story": {
    slug: "warm-story",
    name: "Warm Story",
    category: "Desain fleksibel",
    tier: "Basic",
    palette: "Terracotta & Cream",
    background: "#FDF6F0",
    surface: "rgba(255, 252, 248, 0.92)",
    ink: "#2D1E16",
    muted: "#8A7468",
    accent: "#D47A4A",
    accentSoft: "#F5E8E0",
    onAccent: "#2D1E16",
    line: "rgba(45, 30, 22, 0.12)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1rem",
    tone: "light",
  },

  // DARK & MOODY
  "editorial-dark": {
    slug: "editorial-dark",
    name: "Editorial Dark",
    category: "Dark & moody",
    tier: "Eksklusif",
    palette: "Charcoal & Brass",
    background: "#0A0B0D",
    surface: "rgba(255, 255, 255, 0.045)",
    ink: "#EFEAE0",
    muted: "rgba(239, 234, 224, 0.58)",
    accent: "#C8A24A",
    accentSoft: "rgba(200, 162, 74, 0.14)",
    onAccent: "#0A0B0D",
    line: "rgba(239, 234, 224, 0.16)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0rem",
    tone: "dark",
  },
};

/** Canonical slug for an alias, or `null` when the template does not exist. */
export function canonicalTemplateSlug(slug: string): string | null {
  if (themes[slug]) return slug;
  const aliased = TEMPLATE_ALIASES[slug];
  return aliased && themes[aliased] ? aliased : null;
}

/** Theme for a canonical slug or legacy alias; falls back to the brand theme. */
export function resolveTheme(slug: string): TemplateTheme {
  return themes[canonicalTemplateSlug(slug) ?? "lilac-flower"];
}

/**
 * CSS custom properties consumed by every shared block. Applied on the shell's
 * root element; values cascade to the whole invitation.
 */
export function themeStyle(theme: TemplateTheme): CSSProperties {
  return {
    "--inv-bg": theme.background,
    "--inv-surface": theme.surface,
    "--inv-ink": theme.ink,
    "--inv-muted": theme.muted,
    "--inv-accent": theme.accent,
    "--inv-accent-soft": theme.accentSoft,
    "--inv-on-accent": theme.onAccent,
    "--inv-line": theme.line,
    "--inv-font-display": theme.fontDisplay,
    "--inv-font-body": theme.fontBody,
    "--inv-radius": theme.radius,
    "--inv-tone": theme.tone,
  } as CSSProperties;
}