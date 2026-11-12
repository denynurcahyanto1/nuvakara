# NUVAKARA — Phase 4: Template Engine & Public Invitation Renderer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun template engine dengan 4 template unik (Wedding Classic, Birthday Celebration, Baby Shower, Graduation Modern), rute undangan publik `/invite/[slug]` dengan OpenGraph metadata, dan rute pratinjau draft `/dashboard/invitations/[id]/preview`.

**Architecture:** Registry pattern di `src/components/templates/registry.ts` yang memetakan `template_slug` ke komponen renderer dan konfigurasi tema. Komponen shared (Countdown, Gallery, MusicPlayer, MapEmbed) bersifat Netral/Dapat Disesuaikan. Rute `/invite/[slug]` bersifat publik, menginisialisasi metadata OG, dan menggunakan `generateMetadata`.

**Tech Stack:** Next.js 16.4.6 (App Router), React 19.3, Tailwind v4, GSAP 3.15 + `@gsap/react`.

**Spec:** `docs/superpowers/specs/2026-11-12-nuvakara-design.md` (§5.5 Template engine, §10.4 Undangan publik)

---

## Global Constraints

- **Next.js 16.4.6**: `params` & `searchParams` bersifat Promise dan wajib di-`await`.
- **GSAP 3.15**: Animasi menggunakan `useGSAP` hook dan wajib mendukung `prefers-reduced-motion`.
- **Public & Draft Safety**: `/invite/[slug]` hanya menampilkan event yang `is_published = true` AND `is_active = true`. Rute pratinjau draft `/dashboard/invitations/[id]/preview` terlindungi dan hanya untuk pemilik event.
- **OG Metadata**: `generateMetadata` menyusun OpenGraph card (title, description, cover image) secara dinamis.

---

## Review Focus

1. **Fallback Renderer**: Jika `template_slug` tidak dikenal, gunakan fallback renderer generik tanpa aplikasi mengalami crash.
2. **Reduced Motion**: Semua komponen template (terutama Countdown, FloatingDecor, Marquee) menghormati `prefers-reduced-motion`.
3. **OG Image Preview**: Link yang dibagikan di WhatsApp/Social media menyertakan URL gambar cover yang valid.
4. **Draft Protection**: Event unpublished tidak bisa diakses lewat `/invite/[slug]` (mengembalikan `notFound()`).
5. **Mobile Responsiveness**: Tampilan template sempurna di resolusi mobile (320px - 430px) tanpa overflow horizontal.

---

## Task 1: Shared Template Components & Registry Setup

**Files:**
- Create: `src/components/templates/shared/Countdown.tsx`
- Create: `src/components/templates/shared/Gallery.tsx`
- Create: `src/components/templates/shared/MusicPlayer.tsx`
- Create: `src/components/templates/shared/MapEmbed.tsx`
- Create: `src/components/templates/registry.ts`
- Test: `tests/unit/template-registry.test.ts`

- [ ] Step 1: Implementasi komponen shared (`Countdown`, `Gallery` dengan Lightbox dasar, `MusicPlayer` tanpa autoplay bersuara, `MapEmbed`).
- [ ] Step 2: Implementasi `registry.ts` untuk memetakan template slug ke metadata dan komponen renderer.
- [ ] Step 3: Tulis unit test untuk menguji registry dan ketersediaan komponen fallback.
- [ ] Step 4: Jalankan test dan typecheck.

---

## Task 2: 4 Unik Template Components

**Files:**
- Create: `src/components/templates/wedding-classic/index.tsx`
- Create: `src/components/templates/birthday-celebration/index.tsx`
- Create: `src/components/templates/baby-shower/index.tsx`
- Create: `src/components/templates/graduation-modern/index.tsx`
- Test: `tests/components/templates.test.tsx`

- [ ] Step 1: Buat template `WeddingClassic` (Elegan, Ivory/Gold/Navy, Cormorant Garamond).
- [ ] Step 2: Buat template `BirthdayCelebration` (Playful, Merah/Kuning/Ungu, Fredoka/Baloo 2).
- [ ] Step 3: Buat template `BabyShower` (Soft pastel, Quicksand, Kartu membulat).
- [ ] Step 4: Buat template `GraduationModern` (Editorial dark, Hitam/Emas, Sora/Outfit).
- [ ] Step 5: Tulis komponen test untuk memastikan ke-4 template dapat dirender tanpa crash.

---

## Task 3: Public Invitation Route & Draft Preview

**Files:**
- Create: `src/app/invite/[slug]/page.tsx`
- Create: `src/app/dashboard/invitations/[id]/preview/page.tsx`
- Test: `tests/integration/invite-route.test.ts`

- [ ] Step 1: Implementasi rute `/invite/[slug]` lengkap dengan `generateMetadata` untuk OpenGraph.
- [ ] Step 2: Proteksi publik: Jika `!is_published` atau `!is_active`, kembalikan `notFound()`.
- [ ] Step 3: Implementasi rute pratinjau draft `/dashboard/invitations/[id]/preview` (Owner-only via `requireUser()`).
- [ ] Step 4: Tulis integration test untuk rute publik & draft preview.
- [ ] Step 5: Jalankan `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
