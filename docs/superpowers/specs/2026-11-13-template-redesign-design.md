# NUVAKARA Invitation Template Redesign — Design

**Date:** 2026-11-13
**Status:** Approved direction, implementing

## Problem

The four current templates are plain Tailwind layouts: a header, a countdown, a
gallery, a map, and a raw `<audio controls>`. Guests open the link and see no
cover, no motion, no navigation, and RSVP/guestbook styled for a different
palette. The catalogue advertises four templates while the reference market
(our-wedding.link/design) ships ten distinct design categories with tiers.

## Goal

Ten event-agnostic templates, one per reference category, all built on a
cinematic shared shell so every invitation feels designed rather than coloured.
Old template slugs keep working as aliases.

## Categories and canonical slugs

| # | Category | Slug | Name | Tier | Palette | Cover | Layout family |
|---|----------|------|------|------|---------|-------|---------------|
| 1 | Floral | `floral-ivory` | Ivory Bloom | Eksklusif | ivory, sage, blush, antique gold | arch | botanical centred |
| 2 | Elegan | `elegan-maison` | Maison d'Or | Luxury | ivory, champagne, deep gold, ink | deco | deco editorial |
| 3 | Dark & moody | `dark-noir` | Noir Éditorial | Eksklusif | charcoal, bone, brass | cinematic | dark editorial |
| 4 | Desain fleksibel | `fleksibel-cerita` | Cerita | Basic | sand, terracotta, olive | editorial | stacked story |
| 5 | Adat | `adat-sekar` | Sekar Jagad | Eksklusif | maroon, cream, gold | arch | batik ceremonial |
| 6 | Minimalis | `minimalis-lumen` | Lumen | Basic | paper white, charcoal, sage | editorial | hairline minimal |
| 7 | Islami | `islami-nurani` | Nurani | Premium | deep teal, cream, muted gold | arch | arabesque |
| 8 | Vintage | `vintage-sepia` | Sepia | Premium | aged paper, burgundy, faded gold | deco | postcard |
| 9 | Animasi & 3D | `animasi-kinetic` | Kinetic | Luxury | ink, violet, electric blue | cinematic | kinetic 3D |
| 10 | Game | `game-levelup` | Level Up | Premium | midnight, pixel yellow, mint | cinematic | pixel quest |

Aliases (old slug → canonical): `wedding-classic` → `floral-ivory`,
`birthday-celebration` → `fleksibel-cerita`, `baby-shower` → `minimalis-lumen`,
`graduation-modern` → `dark-noir`.

## Architecture

### Theme tokens

`src/components/templates/shared/theme.ts` exports `TemplateTheme` and
`themes: Record<string, TemplateTheme>`. `themeStyle(theme)` maps values to CSS
custom properties (`--inv-bg`, `--inv-surface`, `--inv-ink`, `--inv-muted`,
`--inv-accent`, `--inv-accent-soft`, `--inv-on-accent`, `--inv-line`,
`--inv-font-display`, `--inv-font-body`, `--inv-radius`, `--inv-tone`).
`globals.css` declares the same names on `:root` with the existing ivory/gold
palette so shared blocks also render outside a shell.

Every template and shared block styles with `var(--inv-*)` instead of literal
hex. This is what makes RSVP, guestbook, countdown, and map inherit the
template identity without prop-drilling colours.

### InvitationShell

`shared/InvitationShell.tsx` (client) owns the experience:

- `cover` config (`eyebrow`, `title`, `subtitle`, `date`, `image`, `variant`,
  `note`) rendered by `shared/InvitationCover.tsx` as a fixed overlay until the
  guest presses **Buka Undangan**.
- Locks page scroll while closed (restores previous overflow on open/unmount).
- On open: GSAP fade/scale of the overlay, unlock scroll, start music if a URL
  exists, reveal the bottom nav.
- Renders `MusicPlayer` (floating gold disc, real play/pause, no native
  controls) and `InvitationNav` (bottom pill with anchors, active section
  tracked by `IntersectionObserver`).
- Accepts `mode: "live" | "preview"`; preview skips the scroll lock so the
  `/template/[slug]` page stays scrollable and labels the cover button
  **Pratinjau**.

Templates receive `TemplateRenderProps = { data: TemplateData; eventId?: number;
messages?: GuestbookMessage[]; mode?: "live" | "preview" }`.

### Templates own the whole invitation

Each template composes: cover → hero/couple → verse or quote → event details →
story/gallery → location → gift → RSVP → guestbook → footer. The public
`/invite/[slug]` page renders only `TemplateDispatcher`; it no longer appends a
hard-coded RSVP/guestbook section. `/template/[slug]` renders the same template
with `mode="preview"`, demo event id absent, and demo messages.

### Motion

Reuse `src/components/motion` (`Reveal`, `Stagger`, `Parallax`) which already
respect `prefers-reduced-motion` via `gsap.matchMedia`. Add
`shared/InvitationMotion.tsx` only for cover choreography and the progress bar.
No motion may hide content when reduced motion is on.

### Catalogue

`TemplateMetadata` gains `category`, `tier`, `palette`, `description`,
`eventFit: ("wedding" | "other")[]`, `isPremium`. `templatePreviews` is derived
from the registry (single source of truth). `/template` gets client-side filters
for category, tier, and event fit; each card shows a palette swatch strip and
links to preview + register.

### Event editor

`EditEventForm` template `<select>` lists all ten canonical names grouped by
category. Existing rows keep working because the server resolves aliases.

## Non-goals

- No custom-template builder.
- No server-side screenshot generation.
- Dashboard guest/analytics work is a separate plan.

## Success criteria

- 10 registered templates; every slug has demo content and renders real event
  data.
- Old slugs render the new designs (no `Template not found`, no 404).
- Cover opens on tap, music toggles, nav scrolls, sections reveal, RSVP and
  guestbook match the template palette.
- Reduced motion leaves all content visible.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` green.
