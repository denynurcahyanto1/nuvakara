# Template Redesign Plan (Our Wedding Link Reference)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 14 production-quality templates matching Our Wedding Link reference designs across Wedding and Non-Wedding catalogs.

**Architecture:** Extend existing `InvitationShell` + token theming. Add new template renderers per category. Update registry, catalogue, preview routes. Preserve Supabase DAL, auth, dashboard.

**Tech Stack:** Next.js 16.4.6, GSAP 3.15 + @gsap/react, Tailwind v4, Supabase.

## Global Constraints
- 10 categories fixed (mapped to reference designs).
- Old slugs remain as aliases in `TEMPLATE_ALIASES`.
- CSS variables (`--inv-*`) drive all shared blocks.
- Build must pass `npm run build` after each task.

## Review Focus
- Theme token contrast ratios (WCAG AA for text).
- Animation performance (60fps on mobile, `prefers-reduced-motion` respected).
- Arabic/RTL text rendering in Islami templates.
- 3D/Canvas memory leaks in Animasi & 3D templates.
- Template switching preserves user data in editor.

---

### Task 1: Theme Token Audit & Expansion
**Files:** `src/components/templates/shared/theme.ts`
- [ ] Add new theme entries matching reference palettes (14 total).
- [ ] Verify all tokens: `background`, `surface`, `ink`, `muted`, `accent`, `accentSoft`, `onAccent`, `line`, `fontDisplay`, `fontBody`, `radius`, `tone`.
- [ ] Update `templateCatalog` in `catalog.ts` with new names, descriptions, categories, tiers.
- [ ] Update `registry.ts` imports & renderers map.
- [ ] Run build.

### Task 2: Wedding Core Templates (4)
**Files:** `src/components/templates/{floral-ivory|elegan-maison|islami-nurani|vintage-sepia}/index.tsx`
- [ ] **floral-ivory → Lilac Flower**: Botanical corners, lilac/cream palette, soft floral ornaments, QS Ar-Rum 21.
- [ ] **elegan-maison → Cypress Linen**: Linen texture bg, sage/earthy tones, minimal floral accents, editorial layout.
- [ ] **islami-nurani → Arabix**: Teal/gold arabesque frames, geometric border, couple cards with decor, gold pattern.
- [ ] **vintage-sepia → Film Roll**: Film grain overlay, perforated edge frames, "Scene 01/12" labels, "Admit One" ticket UI, warm sepia.

### Task 3: Animasi & 3D Templates (3)
**Files:** `src/components/templates/{animasi-kinetic|animasi-whimsical|animasi-joglo}/index.tsx`
- [ ] **animasi-kinetic → Film Roll (Cinematic)**: Reuse Film Roll visual language, cinematic bars, parallax hero, vintage color grade.
- [ ] **animasi-whimsical → Whimsical Colorful**: Multi-color gradient orbs, playful marquee, organic blob shapes, vibrant palette.
- [ ] **animasi-joglo → 3D Joglo Kertas**: Three.js joglo 3D model, paper cutout shader, scroll-reveal paper layers, earth tones.

### Task 4: Game & Dark Templates (2)
**Files:** `src/components/templates/{game-levelup|dark-noir}/index.tsx`
- [ ] **game-levelup → Playful Playdate**: Pixel UI, quest log sections, EXP bar countdown, 8-bit sound toggle.
- [ ] **dark-noir → Editorial Dark**: Charcoal bg, brass accents, magazine editorial layout, large serif headlines.

### Task 5: Adat & Minimalis Templates (2)
**Files:** `src/components/templates/{adat-sekar|minimalis-lumen}/index.tsx`
- [ ] **adat-sekar → Joglo Adat**: Maroon/gold batik ornaments, joglo roof silhouette, traditional Jawa sapaan.
- [ ] **minimalis-lumen → Cypress Linen Minimal**: Paper white, sage accent, hairline borders, maximum whitespace.

### Task 6: Fleksibel Template (1)
**Files:** `src/components/templates/fleksibel-cerita/index.tsx`
- [ ] **fleksibel-cerita → Warm Story**: Terracotta/cream, flowing layout, personal narrative cards, adaptable to non-wedding.

### Task 7: Catalogue & Preview Integration
**Files:** `src/app/template/page.tsx`, `src/components/marketing/TemplateCatalogue.tsx`, `src/app/template/[slug]/page.tsx`
- [ ] Update catalogue filters for 14 templates.
- [ ] Ensure preview route renders each template correctly.
- [ ] Update dashboard editor template selector.

### Task 8: QA & Polish
**Files:** All template files
- [ ] Run `npm run build`.
- [ ] Test 5 template previews manually.
- [ ] Verify dashboard editor shows all templates.
- [ ] Commit all changes.