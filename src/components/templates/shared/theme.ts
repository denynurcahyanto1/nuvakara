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

/** Old slugs stored on existing events. */
export const TEMPLATE_ALIASES: Record<string, string> = {
  "wedding-classic": "floral-ivory",
  "birthday-celebration": "fleksibel-cerita",
  "baby-shower": "minimalis-lumen",
  "graduation-modern": "dark-noir",
};

const serif = "var(--font-cormorant), ui-serif, Georgia, serif";
const sans = "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif";
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

export const themes: Record<string, TemplateTheme> = {
  "floral-ivory": {
    slug: "floral-ivory",
    name: "Ivory Bloom",
    category: "Floral",
    tier: "Eksklusif",
    palette: "Ivory & Sage",
    background: "#FBF7F0",
    surface: "rgba(255, 253, 248, 0.82)",
    ink: "#1E2A24",
    muted: "#67766C",
    accent: "#A8834B",
    accentSoft: "#EDE3D1",
    onAccent: "#FFFDF8",
    line: "rgba(30, 42, 36, 0.16)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1.5rem",
    tone: "light",
  },
  "elegan-maison": {
    slug: "elegan-maison",
    name: "Maison d'Or",
    category: "Elegan",
    tier: "Luxury",
    palette: "Ivory & Deep Gold",
    background: "#F7F2E8",
    surface: "rgba(255, 252, 245, 0.86)",
    ink: "#14231C",
    muted: "#5C6A62",
    accent: "#9C7B3F",
    accentSoft: "#E7DCC5",
    onAccent: "#FFFCF4",
    line: "rgba(20, 35, 28, 0.18)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.25rem",
    tone: "light",
  },
  "dark-noir": {
    slug: "dark-noir",
    name: "Noir Éditorial",
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
  "fleksibel-cerita": {
    slug: "fleksibel-cerita",
    name: "Cerita",
    category: "Desain fleksibel",
    tier: "Basic",
    palette: "Sand & Terracotta",
    background: "#F7F2EA",
    surface: "rgba(255, 252, 246, 0.9)",
    ink: "#241E19",
    muted: "#6E6258",
    accent: "#B4552F",
    accentSoft: "#F0DCCF",
    onAccent: "#FFF8F2",
    line: "rgba(36, 30, 25, 0.14)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1rem",
    tone: "light",
  },
  "adat-sekar": {
    slug: "adat-sekar",
    name: "Sekar Jagad",
    category: "Adat",
    tier: "Eksklusif",
    palette: "Maroon & Gold",
    background: "#F3EAD8",
    surface: "rgba(255, 250, 240, 0.86)",
    ink: "#3A1015",
    muted: "#7A5A4A",
    accent: "#7A1F2B",
    accentSoft: "#E8D2C0",
    onAccent: "#FFF8EE",
    line: "rgba(122, 31, 43, 0.24)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1.25rem",
    tone: "light",
  },
  "minimalis-lumen": {
    slug: "minimalis-lumen",
    name: "Lumen",
    category: "Minimalis",
    tier: "Basic",
    palette: "Paper & Sage",
    background: "#FAFAF8",
    surface: "rgba(255, 255, 255, 0.94)",
    ink: "#16181A",
    muted: "#787D7B",
    accent: "#8FA491",
    accentSoft: "#EDF1EC",
    onAccent: "#101311",
    line: "rgba(22, 24, 26, 0.12)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.25rem",
    tone: "light",
  },
  "islami-nurani": {
    slug: "islami-nurani",
    name: "Nurani",
    category: "Islami",
    tier: "Premium",
    palette: "Deep Teal & Cream",
    background: "#F6F1E4",
    surface: "rgba(255, 252, 243, 0.9)",
    ink: "#10302F",
    muted: "#5C6F6C",
    accent: "#0F4A47",
    accentSoft: "#DCE7E2",
    onAccent: "#F8F5EC",
    line: "rgba(15, 74, 71, 0.22)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "2rem",
    tone: "light",
  },
  "vintage-sepia": {
    slug: "vintage-sepia",
    name: "Sepia",
    category: "Vintage",
    tier: "Premium",
    palette: "Aged Paper & Burgundy",
    background: "#EFE3CE",
    surface: "rgba(250, 242, 227, 0.88)",
    ink: "#3B2119",
    muted: "#7B6353",
    accent: "#6B2F35",
    accentSoft: "#E0CCB4",
    onAccent: "#FBF3E4",
    line: "rgba(59, 33, 25, 0.28)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "0.25rem",
    tone: "light",
  },
  "animasi-kinetic": {
    slug: "animasi-kinetic",
    name: "Kinetic",
    category: "Animasi & 3D",
    tier: "Luxury",
    palette: "Ink & Electric Violet",
    background: "#08080F",
    surface: "rgba(255, 255, 255, 0.05)",
    ink: "#F5F4FF",
    muted: "rgba(245, 244, 255, 0.62)",
    accent: "#7C5CFF",
    accentSoft: "rgba(124, 92, 255, 0.2)",
    onAccent: "#08080F",
    line: "rgba(245, 244, 255, 0.14)",
    fontDisplay: serif,
    fontBody: sans,
    radius: "1.75rem",
    tone: "dark",
  },
  "game-levelup": {
    slug: "game-levelup",
    name: "Level Up",
    category: "Game",
    tier: "Premium",
    palette: "Midnight & Pixel Yellow",
    background: "#101321",
    surface: "rgba(255, 255, 255, 0.04)",
    ink: "#EAF2FF",
    muted: "#8B9AC7",
    accent: "#FFD447",
    accentSoft: "rgba(255, 212, 71, 0.14)",
    onAccent: "#101321",
    line: "rgba(255, 212, 71, 0.3)",
    fontDisplay: mono,
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
  return themes[canonicalTemplateSlug(slug) ?? "floral-ivory"];
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
