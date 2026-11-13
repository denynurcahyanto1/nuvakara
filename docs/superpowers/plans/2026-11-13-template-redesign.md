# Template Redesign Plan (10 Categories → 8 Reference Designs)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign 10 invitation templates to visually match 8 reference designs from our-wedding.link while maintaining the cinematic shell, token theming, and shared blocks.

**Architecture:** Update each template's theme tokens in `shared/theme.ts`, then rebuild each template's visual layer (hero, sections, ornaments, animations) in its directory. Keep `InvitationShell`, shared blocks, and data flow unchanged.

**Tech Stack:** Next.js 16.4.6, GSAP 3.15 + @gsap/react, Tailwind v4, Supabase.

**Spec:** Template redesign to match reference designs.

## Global Constraints
- 10 categories fixed (no add/remove).
- Old slugs stay as aliases in `TEMPLATE_ALIASES`.
- CSS variable tokens (`--inv-*`) drive all shared blocks.
- Build must pass `npm run build` after each task.

## Review Focus
- Theme token contrast ratios (WCAG AA for text).
- Animation performance (60fps on mobile, `prefers-reduced-motion` respected).
- Arabic/RTL text rendering in Islami templates.
- 3D/Canvas memory leaks in Animasi & 3D templates.
- Template switching preserves user data in editor.

---

### Task 1: Update Theme Tokens for All 10 Categories
**Files:**
- Modify: `src/components/templates/shared/theme.ts`

**Interfaces:**
- Produces: Updated `themes` object with 10 redesigned palettes.

- [ ] **Step 1: Redesign `floral-ivory` → lilac-flower palette (purple lilac, soft cream, botanical accent)**
- [ ] **Step 2: Add new `floral-cypress` theme for cypress-linen (sage linen, warm neutral, subtle floral)**
- [ ] **Step 3: Redesign `islami-nurani` → arabix (deep teal, gold arabesque, cream)**
- [ ] **Step 4: Add new `islami-arabian` theme for arabian-gold-pattern (rich gold, dark navy, geometric pattern)**
- [ ] **Step 5: Redesign `animasi-kinetic` → film-roll (cinematic grain, vintage film, warm highlights)**
- [ ] **Step 6: Add new `animasi-whimsical` theme for whimsical-colorful (multi-color gradient, playful shapes)**
- [ ] **Step 7: Add new `animasi-joglo` theme for 3d-animation-joglo-kertas (paper 3D, joglo silhouette, earth tones)**
- [ ] **Step 8: Redesign `game-levelup` → playful-playdate (bright UI, pixel art, quest log style)**
- [ ] **Step 9: Redesign `vintage-sepia` → film-roll vintage (sepia, film grain, perforated edges)**
- [ ] **Step 10: Redesign `dark-noir` → editorial dark (charcoal, brass, magazine layout)**
- [ ] **Step 11: Redesign `elegan-maison` → arabian-gold elegance (ivory, deep gold, art deco lines)**
- [ ] **Step 12: Redesign `minimalis-lumen` → cypress-linen minimal (paper white, sage, hairline)**
- [ ] **Step 13: Redesign `fleksibel-cerita` → warm story (terracotta, cream, flowing layout)**
- [ ] **Step 14: Redesign `adat-sekar` → joglo adat (maroon, gold, batik ornament, joglo)**
- [ ] **Step 15: Update `templateCatalog` categories/tiers to match new themes**
- [ ] **Step 16: Run build and verify no TypeScript errors**

---

### Task 2: Rebuild Floral Templates (2 themes)
**Files:**
- Modify: `src/components/templates/floral-ivory/index.tsx` → lilac-flower visual
- Create: `src/components/templates/floral-cypress/index.tsx` → cypress-linen visual
- Modify: `src/components/templates/registry.ts` (import + register)

**Interfaces:**
- Consumes: Updated theme tokens from Task 1.

- [ ] **Step 1: Rebuild `floral-ivory` with lilac botanical corners, soft gradient hero, floral ornaments**
- [ ] **Step 2: Create `floral-cypress` with linen texture bg, sage palette, minimal floral accents**
- [ ] **Step 3: Register both in `registry.ts`**
- [ ] **Step 4: Build and verify**

---

### Task 3: Rebuild Islami Templates (2 themes)
**Files:**
- Modify: `src/components/templates/islami-nurani/index.tsx` → arabix (arabesque, teal/gold)
- Create: `src/components/templates/islami-arabian/index.tsx` → arabian-gold-pattern
- Modify: `src/components/templates/registry.ts`

**Interfaces:**
- Consumes: Updated theme tokens.

- [ ] **Step 1: Rebuild `islami-nurani` with arabesque border, Ar-Rum 21, teal/gold palette**
- [ ] **Step 2: Create `islami-arabian` with geometric islamic pattern, gold foil effect, navy bg**
- [ ] **Step 3: Register both in `registry.ts`**
- [ ] **Step 4: Build and verify**

---

### Task 4: Rebuild Animasi & 3D Templates (3 themes)
**Files:**
- Modify: `src/components/templates/animasi-kinetic/index.tsx` → film-roll (cinematic, grain, parallax)
- Create: `src/components/templates/animasi-whimsical/index.tsx` → whimsical-colorful
- Create: `src/components/templates/animasi-joglo/index.tsx` → 3d-animation-joglo-kertas
- Modify: `src/components/templates/registry.ts`

**Interfaces:**
- Consumes: Updated theme tokens.

- [ ] **Step 1: Rebuild `animasi-kinetic` with film grain shader, cinematic bars, vintage parallax**
- [ ] **Step 2: Create `animasi-whimsical` with multi-color orbs, playful marquee, organic shapes**
- [ ] **Step 3: Create `animasi-joglo` with Three.js joglo 3D model, paper texture, scroll-reveal**
- [ ] **Step 4: Register all three in `registry.ts`**
- [ ] **Step 5: Build and verify**

---

### Task 5: Rebuild Game Template (1 theme)
**Files:**
- Modify: `src/components/templates/game-levelup/index.tsx` → playful-playdate
- Modify: `src/components/templates/registry.ts`

**Interfaces:**
- Consumes: Updated theme tokens.

- [ ] **Step 1: Rebuild with pixel UI, quest log sections, EXP bar countdown, 8-bit audio toggle**
- [ ] **Step 2: Register in `registry.ts`**
- [ ] **Step 3: Build and verify**

---

### Task 6: Rebuild Remaining 4 Templates
**Files:**
- Modify: `src/components/templates/vintage-sepia/index.tsx` → film-roll vintage
- Modify: `src/components/templates/dark-noir/index.tsx` → editorial dark
- Modify: `src/components/templates/elegan-maison/index.tsx` → arabian-gold elegance
- Modify: `src/components/templates/minimalis-lumen/index.tsx` → cypress-linen minimal
- Modify: `src/components/templates/fleksibel-cerita/index.tsx` → warm story
- Modify: `src/components/templates/adat-sekar/index.tsx` → joglo adat
- Modify: `src/components/templates/registry.ts`

**Interfaces:**
- Consumes: Updated theme tokens.

- [ ] **Step 1: Rebuild each with new visual identity per theme tokens**
- [ ] **Step 2: Register all in `registry.ts`**
- [ ] **Step 3: Build and verify**

---

### Task 7: Update Catalogue & Preview Pages
**Files:**
- Modify: `src/components/templates/catalog.ts` (descriptions, fits, tiers)
- Modify: `src/app/template/page.tsx` (showcase filters)
- Modify: `src/components/marketing/TemplateShowcase.tsx`

**Interfaces:**
- Consumes: Updated theme tokens and registry.

- [ ] **Step 1: Update catalogue metadata (names, descriptions, tiers)**
- [ ] **Step 2: Verify `/template` page shows all 10 with correct filters**
- [ ] **Step 3: Verify `/template/[slug]` preview renders correctly**
- [ ] **Step 4: Build and verify**

---

### Task 8: Final Verification & Polish
**Files:**
- All template files

**Interfaces:**
- Consumes: Complete redesign.

- [ ] **Step 1: Run full build (`npm run build`)**
- [ ] **Step 2: Test 5 template previews manually (visual check)**
- [ ] **Step 3: Verify dashboard editor shows all 10 templates**
- [ ] **Step 4: Commit all changes**