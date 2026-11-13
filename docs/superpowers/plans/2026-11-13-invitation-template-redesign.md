# Invitation Template Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four plain templates with ten premium, category-distinct invitation experiences on one cinematic shell, without breaking existing event links.

**Architecture:** A theme-token layer drives every colour/typography decision through CSS variables; a client `InvitationShell` adds cover, music, and in-invitation navigation; each template composes shared blocks in its own layout; RSVP/guestbook live inside the template so they inherit its theme.

**Tech Stack:** Next.js 16 App Router, React 19 server components for content, GSAP 3.15 + `@gsap/react` for motion, Tailwind v4 with CSS variables, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-13-template-redesign-design.md`

## Global Constraints

- Brand is **NUVAKARA**; UI copy Indonesian, invitation copy may be bilingual.
- Mobile-first; every tap target ≥ 44px; no horizontal scroll at 390px.
- Dates formatted through `src/lib/datetime.ts` (Asia/Jakarta).
- `prefers-reduced-motion: reduce` must never leave content at `opacity: 0`.
- Old slugs `wedding-classic`, `birthday-celebration`, `baby-shower`, `graduation-modern` must keep working via aliases.
- Templates are event-agnostic: no wedding-only assumption in shared blocks.
- No new runtime dependencies.
- Each task ends with `npm test` on the touched files plus `npm run typecheck`.

## Review Focus

- **Reduced motion + cover:** with motion disabled, the cover must still open and the page must scroll.
- **Preview page:** `/template/[slug]` has no event row; RSVP/guestbook must render an explicit preview state instead of calling an action with `eventId: undefined`.
- **Unknown/alias slug:** stored `template_slug` values from older events must resolve, not fall back to "Template not found".
- **Missing media:** events without cover image, gallery, music, or map must still produce a complete-looking invitation (gradient/text fallbacks, no empty boxes).
- **Long text:** a long event title, venue, or guestbook message must not overflow at 390px.

---

### Task 1: Theme tokens and CSS variable defaults

**Files:**
- Create: `src/components/templates/shared/theme.ts`
- Modify: `src/app/globals.css`
- Test: `tests/lib/template-theme.test.ts`

**Interfaces:**
- Produces: `TemplateTheme` (fields: `slug`, `category`, `tier`, `name`, `palette`, `background`, `surface`, `ink`, `muted`, `accent`, `accentSoft`, `onAccent`, `line`, `fontDisplay`, `fontBody`, `radius`, `tone: "light" | "dark"`), `themes: Record<string, TemplateTheme>`, `themeStyle(theme: TemplateTheme): React.CSSProperties`, `resolveTheme(slug: string): TemplateTheme`.

- [ ] Write a test asserting all ten canonical slugs exist, every theme defines non-empty token strings, and `themeStyle(themes["floral-ivory"])["--inv-ink"]` is defined.
- [ ] Run it; expect failure (module missing).
- [ ] Implement `theme.ts` with the ten palettes from the spec and `themeStyle` returning CSS custom properties.
- [ ] Add `:root` defaults for `--inv-*` in `globals.css` matching the ivory/gold brand palette.
- [ ] Test passes; typecheck.

### Task 2: Cover, shell, music, nav

**Files:**
- Create: `src/components/templates/shared/InvitationCover.tsx`
- Create: `src/components/templates/shared/InvitationShell.tsx`
- Create: `src/components/templates/shared/InvitationNav.tsx`
- Rewrite: `src/components/templates/shared/MusicPlayer.tsx`
- Test: `tests/components/invitation-shell.test.tsx`

**Interfaces:**
- `CoverConfig = { eyebrow: string; title: string; subtitle?: string; date: string; image?: string | null; variant: "arch" | "editorial" | "cinematic" | "deco"; note?: string }`
- `NavItem = { id: string; label: string }`
- `InvitationShellProps = { theme: TemplateTheme; cover: CoverConfig; nav: NavItem[]; musicUrl?: string; mode?: "live" | "preview"; children: ReactNode }`
- `MusicPlayerProps = { url: string; playSignal?: number }`

- [ ] Test: shell renders cover title and `Buka Undangan` (preview mode renders `Pratinjau`), and children are present but hidden behind the overlay.
- [ ] Implement cover variants with image scrim + gradient fallback, real `<button>`.
- [ ] Implement shell: `open` state, body-scroll lock only in live mode, GSAP overlay exit via `gsap.to` inside `matchMedia(animate)` with an immediate `onComplete`; music `playSignal` increments on open.
- [ ] Rewrite `MusicPlayer` as a fixed 44px disc button with `useRef<HTMLAudioElement>`, `aria-pressed`, and no native controls; render nothing without `url`.
- [ ] Implement nav with `IntersectionObserver`, hide while cover closed, `safe-bottom` spacing.
- [ ] Tests pass; typecheck.

### Task 3: Token-themed shared blocks

**Files:**
- Modify: `shared/Countdown.tsx`, `shared/RSVPForm.tsx`, `shared/Guestbook.tsx`, `shared/Gallery.tsx`, `shared/MapEmbed.tsx`
- Create: `shared/SectionLabel.tsx`, `shared/Ornament.tsx`, `shared/InvitationFooter.tsx`, `shared/GiftInfo.tsx`
- Test: extend `tests/components/templates.test.tsx`

**Interfaces:**
- `Countdown` renders values with `var(--inv-*)`; units stay `Hari/Jam/Menit/Detik`.
- `RSVPForm`/`Guestbook` accept `{ eventId?: number; messages?: GuestbookMessage[]; readOnly?: boolean }`; when `eventId` is undefined they render the visual section with a disabled submit and the note `Pratinjau — formulir aktif pada undangan asli`.
- `SectionLabel({ children, align?: "left" | "center" })`, `Ornament({ variant: "floral" | "deco" | "arabesque" | "batik" | "pixel" | "hairline", className? })`, `GiftInfo({ bank, account, holder })`, `InvitationFooter({ name, theme })`.

- [ ] Write failing tests: read-only RSVP shows the preview note and no enabled submit; guestbook renders provided messages.
- [ ] Convert colours to `var(--inv-*)`; keep focus rings accessible (accent-based).
- [ ] Implement the new blocks.
- [ ] Tests pass.

### Task 4: Flagship templates — Floral, Elegan, Dark

**Files:**
- Create: `src/components/templates/floral-ivory/index.tsx`
- Create: `src/components/templates/elegan-maison/index.tsx`
- Create: `src/components/templates/dark-noir/index.tsx`
- Test: `tests/components/templates.test.tsx`

**Interfaces:**
- Each exports a `React.FC<TemplateRenderProps>` where `TemplateRenderProps = { data: TemplateData; eventId?: number; messages?: GuestbookMessage[]; mode?: "live" | "preview" }`.
- Sections use `id` values `momen`, `acara`, `galeri`, `lokasi`, `hadiah`, `rsvp`, `ucapan`.

- [ ] Write failing render tests: real title, venue, cover button, section anchors, map titled `Peta lokasi`, and read-only RSVP in preview mode.
- [ ] Build Floral: arch cover, botanical SVG corners, centred serif, sage/blush washes, arch-framed portrait, quote block.
- [ ] Build Maison d'Or: deco cover, split hero with rule work, champagne cards, art-deco ornament, gift section.
- [ ] Build Noir: cinematic cover, sticky-ish editorial header, oversized type, film grain, brass hairlines, dark map tone.
- [ ] Tests pass at 390px and desktop (manual screenshot).

### Task 5: Registry, aliases, editor, showcase metadata

**Files:**
- Rewrite: `src/components/templates/registry.ts`
- Rewrite: `src/lib/templates-preview.ts`
- Modify: `src/components/marketing/TemplateShowcase.tsx`
- Modify: `src/components/invitations/EditEventForm.tsx`
- Test: `tests/unit/template-registry.test.ts`

**Interfaces:**
- `TemplateMetadata = { slug, name, category, tier, palette, description, eventFit: ("wedding" | "other")[], isPremium, renderer }`
- `registry: Record<canonicalSlug, TemplateMetadata>` (10 entries)
- `aliases: Record<oldSlug, canonicalSlug>` (4 entries)
- `resolveTemplateSlug(slug: string): string | null`, `getTemplate(slug): TemplateMetadata | null`, `getRenderer(slug): TemplateRenderer`
- `TemplateDispatcher = ({ slug, data, eventId?, messages?, mode? }) => JSX`

- [ ] Test: ten canonical entries, four aliases resolving to canonical slugs, unknown slug falls back safely.
- [ ] Implement registry; delete the four old template directories and their imports.
- [ ] Derive `templatePreviews` from registry; showcase renders palette swatches and tier/category badges for all ten.
- [ ] Editor select lists all ten, grouped by category via `<optgroup>` if `Select` supports children (otherwise flat labels `Kategori — Nama`).
- [ ] Tests pass; `npm run lint`.

### Task 6: Public pages use the new contract

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`
- Modify: `src/app/template/[slug]/page.tsx`
- Modify: `src/app/template/page.tsx`
- Modify: `src/lib/templates-demo.ts`
- Test: `tests/integration/invite-route.test.ts`, `tests/lib/templates-demo.test.ts`

- [ ] Extend demo data for all ten canonical slugs (realistic Indonesian host names, venues, dates, galleries).
- [ ] `/invite/[slug]` resolves the alias, passes `eventId`, messages, and `mode="live"`; removes the external RSVP section.
- [ ] `/template/[slug]` passes demo messages and `mode="preview"`; unknown slug 404s.
- [ ] Category/tier/event-fit filters on `/template` (client component with `useState`, URL-independent).
- [ ] Tests pass.

### Task 7: Remaining seven templates

**Files:**
- Create: `fleksibel-cerita`, `adat-sekar`, `minimalis-lumen`, `islami-nurani`, `vintage-sepia`, `animasi-kinetic`, `game-levelup` under `src/components/templates/`
- Test: `tests/components/templates.test.tsx`

- [ ] One failing render test per template with its signature copy (e.g. `Sekar Jagad`, `Bismillah`, `PRESS START`).
- [ ] Implement each with its own layout, ornament, and motion accent — no template may reuse another's section order verbatim.
- [ ] Register and add demo data.
- [ ] All tests pass; build green.

### Task 8: Verification and ship

- [ ] `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
- [ ] `npx next start -p 3500` + `scripts/mcp-audit.mjs` at 1280×900 and 390×844 for `/template` and all ten previews; no console errors, no overflow.
- [ ] Screenshot every template, check cover → open → scroll → RSVP.
- [ ] Commit and push; verify `https://nuvakara.vercel.app/template`.
