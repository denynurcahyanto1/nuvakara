# NUVAKARA — Design Doc

**Tanggal:** 12 November 2026 · **Revisi:** 3 (rebrand ke NUVAKARA)
**Status:** Menunggu persetujuan
**Produk:** NUVAKARA — Platform undangan digital & event SaaS
**Tagline:** "Every Moment Deserves a Beautiful Invitation."
**Brand descriptor (dari logo):** "Digital Invitation & Event Platform"

---

## 1. Intent & Why

NUVAKARA adalah produk SaaS berbahasa Indonesia untuk membuat **undangan digital premium** — pernikahan, ulang tahun, wisuda, baby shower, dan acara lainnya. Dua audiens:

1. **Penyelenggara acara (host)** yang butuh undangan yang *"berasa mahal dan elegan"* tanpa desainer, dan yang butuh tamu bisa RSVP serta memberi ucapan secara online.
2. **Admin platform** yang menjalankan operasi: memoderasi konten, mengelola user, template, paket harga, dan konfigurasi website.

**Kenapa produk ini harus ada:** pasar undangan digital Indonesia besar dan repeatable — invite sekali pakai, tapi orang butuh *template* baru dan fitur seperti RSVP, guestbook, galeri, musik, serta statistik. Produk ini menghubungkan sisi *craft visual premium* (yang differentiate) dengan sisi *operasional* (dashboard + admin panel) sehingga layak disewakan.

**Kenapa sekarang:** fondasi proyek sudah ada (Next.js 16 + Tailwind 4), belum ada database/auth, dan spesifikasi sudah disepakati. Menerezkan keputusan arsitektur backend sekarang jauh lebih murah daripada mem migrating nanti.

---

## 2. Goals / Non-Goals / Anti-Goals

### Goals
- Landing page premium dengan sistem animasi terarah.
- Autentikasi **nyata** (Supabase Auth), session persisten, route terlindungi, RBAC server-side.
- Dashboard: CRUD undangan, pilih/ganti template, preview, publikasi, statistik, moderasi RSVP & guestbook.
- **Template engine dengan 4 template yang benar-benar berbeda** (layout, warna, tipografi, komponen, animasi).
- Undangan publik di `/invite/[slug]`: countdown, galeri, peta, musik, RSVP, guestbook, preview meta untuk WhatsApp.
- Panel admin terpisah di `/admin` + audit log.
- Postgres + RLS yang benar; service-role key tidak pernah menyentuh browser.
- Lolos QA: `next build`, `tsc --noEmit`, `eslint`, unit test, dan smoke test terhadap Supabase nyata.

### Non-Goals
- Payment gateway sungguhan.
- Email blast ke tamu (email auth Supabase tetap aktif).
- Multi-bahasa, multi-tenant, mobile app native, collaboration real-time.

### Anti-Goals
- Dashboard berisi angka dummy.
- Tombol yang terlihat berfungsi tapi tidak melakukan apa-apa.
- Placeholder DOM tanpa jalur data nyata.
- Template yang hanya berbeda warna.
- Klaim transaksi/"pembayaran berhasil" tanpa payment gateway.
- Mengarang kredensial atau menyatakan fitur selesai tanpa diuji.

---

## 3. Constraints

| Constraint | Detail | Dampak desain |
|---|---|---|
| **Next.js 16.4.6** | `params`/`searchParams` = **Promise** (wajib `await`); `middleware.ts` → **`proxy.ts`**; **runtime proxy = nodejs, edge tidak didukung & tidak bisa dikonfigurasi**; Turbopack default; `cacheComponents` nonaktif; `next build` **tidak lagi menjalankan ESLint** (`next lint` dihapus); `NextRequest.ip` & `.geo` **dihapus sejak v15**; `images.remotePatterns` wajib host allow-list, `images.qualities` default `[75]`; `dynamic = 'force-dynamic'` tetap tersedia. | Route DB-dependent dipaksa dynamic; guard admin hanya di server component; rate-limit & audit tidak boleh bergantung pada `request.ip`; lint = perintah terpisah. |
| **React 19.3** | `useActionState` tersedia. | Form tanpa library form tambahan: `useActionState` + zod. |
| **Tailwind v4** | CSS-first (`@theme`), tanpa `tailwind.config.js`. | Token warna/font via CSS variables. |
| **Supabase** | User sudah punya project. Kredensial belum ada di repo → harus diisi user ke `.env.local`. | Semua kode auth/data ditulis terhadap Supabase; **tanpa kredensial fitur data/auth tidak bisa dijalankan/diuji**. |
| **CLI tersedia** | Supabase CLI v3.1.0 terpasang (bukan Docker). | `supabase db push` & `supabase gen types typescript --remote` bisa dipakai bila user memberi access token / connection string → **tipe database digenerate, bukan handwritten**. |
| **TypeScript strict** | `strict: true`, `@/*` → `src/*`. | Tipe database dari CLI; fallback manual hanya bila CLI tidak bisa dipakai. |
| **Tanpa payment gateway** | Tidak boleh ada klaim transaksi. | Paket = katalog + entitlement; UI menandai eksplisit "pembayaran segera hadir". |
| **Windows / Node 26.13 / npm 11.20** | npm registry & fonts.googleapis.com bisa dijangkau. | `next/font/google` aman; semua font yang dipakai sudah diverifikasi tersedia. |

---

## 4. Approaches yang Dipertimbangkan

### 4.1 Backend & autentikasi

| Opsi | Trade-off |
|---|---|
| A. Local-first (PGlite + Drizzle + session lokal) | Jalan tanpa akun eksternal, tapi menyimpang dari spec (Supabase/RLS/Storage) dan butuh jalur migrasi tambahan. |
| **B. Supabase-first** ✅ | Persis sesuai spec: Supabase Auth + Postgres + Storage + RLS. Otorisasi lewat RLS native. Risiko tunggal: butuh kredensial user. |
| C. Adapter hybrid | Dua jalur auth = dua model keamanan, dua kali surface bug. |

**Chosen: B.** Project Supabase sudah ada; RLS memberi isolasi data yang diminta spec secara native; Storage tersedia untuk media; tidak ada kode auth yang perlu ditulis (hanya konfigurasi).

### 4.2 Bootstrap admin pertama

| Opsi | Trade-off |
|---|---|
| **A. Auto-promote via env `ADMIN_EMAILS`** ✅ | Role ditetapkan di server, nol langkah manual. Env dibaca **runtime** (bukan build-time) → menambah email admin **tidak perlu restart**, cukup login berikutnya. |
| B. Manual via SQL Editor | Tiap admin baru butuh langkah manual. |
| C. Seed di migration SQL | Email admin ter-hardcode di repo. |

Implementasi: helper `ensureAdminRole()` dipanggil **di dalam login server action** (`src/lib/actions/auth.ts`), bukan di `getProfile()` — supaya tidak menulis ke DB di setiap render. Promotion idempotent (`update ... where role <> 'admin'`), hanya menulis audit log bila benar-benar ada baris yang berubah, perbandingan email case-insensitive.

### 4.3 Paket harga tanpa payment gateway

| Opsi | Trade-off |
|---|---|
| **A. Pilih paket → entitlement aktif, tanpa bayar** ✅ | Storefront nyata: user pilih paket → `subscriptions` tersimpan → kuota undangan & akses template premium langsung berlaku, ditegakkan di server. UI selalu menandai "pembayaran segera hadir". |
| B. Tampilan saja (hubungi kami) | Paket tidak punya efek nyata. |
| C. Pilih paket, kuota tidak ditegakkan | Kuota tidak konsisten antar halaman. |

---

## 5. Arsitektur

### 5.1 Stack final
```
next 16.4.6 (App Router, Turbopack)  ·  react 19.3  ·  typescript 5 (strict)
tailwindcss 4.3.3                    ·  gsap 3.15 + @gsap/react
@supabase/supabase-js 2.119          ·  @supabase/ssr 0.12.7
zod 4.x  ·  vitest  ·  clsx + tailwind-merge  ·  server-only
```

### 5.2 Struktur folder
```
src/
  app/
    page.tsx                     # landing
    fitur/ template/ harga/ tentang/ privasi/ ketentuan/
    (auth)/ login/ register/ forgot-password/ reset-password/
    dashboard/                   # layout.tsx = requireUser()
      page.tsx invitations/ templates/ guestbook/ rsvp/ analytics/ settings/
      invitations/ page.tsx new/ page.tsx [id]/edit/ page.tsx [id]/preview/
    admin/                       # layout.tsx = requireAdmin()
      page.tsx users/ invitations/ templates/ pricing/ settings/ logs/
    invite/[slug]/page.tsx       # undangan publik (+ generateMetadata OG)
    api/ rsvp/route.ts guestbook/route.ts track/route.ts
    logout/route.ts (POST)
  components/
    ui/       Button Input Textarea Select Switch Card Badge Modal Tabs
              Toast Skeleton EmptyState DataTable Field Pagination
    motion/   Reveal TextReveal Parallax Counter FloatingDecor GradientOrb
              Stagger PageTransition MagneticButton GradientText
    marketing/ Navbar Hero Features TemplateShowcase HowItWorks Pricing
              Footer SectionHeading CTA
    dashboard/ Sidebar Topbar StatCard EventCard EventForm TemplatePicker
              RsvpTable GuestbookTable ShareBar Chart UploadField
    admin/    AdminSidebar AdminStatCard UserTable InvitationTable
              TemplateForm PricingForm SettingsForm ActivityLogTable
    templates/
      registry.ts                # slug -> { Component, theme, motion, category }
      wedding-classic/ birthday-celebration/ baby-shower/ graduation-modern/
      shared/                    # Countdown, Gallery, MusicPlayer, MapEmbed,
                                # RsvpForm, Guestbook, ShareButtons (netral)
  lib/
    supabase/ client.ts server.ts admin.ts session.ts
    dal/ auth.ts events.ts templates.ts rsvp.ts guestbook.ts users.ts
         pricing.ts settings.ts analytics.ts admin-log.ts storage.ts
    actions/ auth.ts events.ts rsvp.ts guestbook.ts profile.ts
            templates.ts pricing.ts settings.ts users.ts
    validation/ schemas.ts
    utils.ts slug.ts format.ts cn.ts site-config.ts
  types/ database.ts (dari CLI, fallback manual)
  proxy.ts
supabase/
  migrations/ 0001_schema.sql 0002_functions.sql 0003_rls.sql 0004_storage.sql 0005_seed.sql
scripts/ build-favicon.mjs apply-migrations.mjs smoke.mjs
```

**Pemisahan layer:** UI (`components/`) → business logic (`lib/actions/`) → data access (`lib/dal/`) → Supabase (`lib/supabase/`). Tidak ada komponen yang menulis query Supabase langsung.

### 5.3 Route map

| Route | Guard | Catatan |
|---|---|---|
| `/`, `/fitur`, `/template`, `/harga`, `/tentang`, `/privasi`, `/ketentuan` | publik | `export const dynamic = 'force-dynamic'` untuk yang membaca DB (harga, template) → konten tidak basi & build tetap aman tanpa kredensial |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | publik | redirect ke dashboard hanya bila session valid **dan** `status = 'active'` |
| `/dashboard/*` | `requireUser()` (server) | suspended → `/login?suspended=1` |
| `/dashboard/invitations/[id]/preview` | owner | pratinjau draft (tidak pernah publik) |
| `/admin/*` | `requireAdmin()` (server) | role dibaca dari DB, bukan dari browser |
| `/invite/[slug]` | publik | hanya `is_published AND is_active`; selain itu `notFound()` |
| `/api/rsvp`, `/api/guestbook`, `/api/track` | publik + rate limit | memanggil RPC SECURITY DEFINER |

**Proteksi admin berlapis:** `src/proxy.ts` = *optimistic check* (refresh cookie + redirect kasar bila belum login). Otorisasi sesungguhnya ada di `admin/layout.tsx` → `requireAdmin()` yang membaca role dari database. Role dari browser tidak pernah dipercaya.

**Pola proxy:** `src/proxy.ts` memanggil `supabase.auth.getUser()` (atau `getClaims()`) dan menulis token baru lewat `setAll` → `response.cookies.set(...)`, karena **Server Component tidak boleh menulis cookie** — tanpa ini refresh token tidak tersimpan → logout acak. `matcher` **sempit** (hanya `/dashboard`, `/admin`, dan route auth) agar tidak menambah network round-trip di setiap request, termasuk prefetch.

### 5.4 Model autentikasi

```
Register  → signUp(email+password). Bila session null (email confirmation ON)
             → tampilkan state "cek email Anda" (bukan error).
             Bila session ada → setSession cookie → ensureAdminRole → redirect.
Login     → signInWithPassword → setSession cookie → ensureAdminRole (idempotent)
             → redirect /dashboard, atau /admin bila role admin.
Logout    → POST /logout → signOut → /login
Reset     → /forgot-password: resetPasswordForEmail(redirectTo /reset-password)
             → /reset-password: updateUser({password}) → /login
Profile   → /dashboard/settings (nama, telepon, avatar via Storage, ganti password)
```

Password di-hash bcrypt oleh Supabase Auth — tidak pernah plaintext, tidak pernah menyentuh DB kita.

### 5.5 Template engine

Registry code = sumber kebenaran **tampilan**; DB = sumber kebenaran **status & metadata**.

```ts
// src/components/templates/registry.ts
export const templateRegistry = {
  "wedding-classic":       { Component: WeddingClassic,       theme: {...}, motion: {...} },
  "birthday-celebration": { Component: BirthdayCelebration, theme: {...}, motion: {...} },
  "baby-shower":          { Component: BabyShower,          theme: {...}, motion: {...} },
  "graduation-modern":    { Component: GraduationModern,    theme: {...}, motion: {...} },
} as const;
```

- `events.template_slug` (denormalized, `not null`) = sumber resolve renderer; `events.template_id` = FK `on delete set null`.
- Resolusi & fallback berjenjang: slug ada di registry → pakai komponennya; slug tidak ada / template non-aktif / `template_id` null → **fallback renderer generik** (bukan crash, bukan template kosong).
- Admin **mengelola metadata** 4 template ter-seed (nama, deskripsi, kategori, premium, aktif) — **tidak** membuat template visual baru (butuh kode renderer). Spec §9 hanya demanding lihat/aktifkan/nonaktifkan/ubah metadata.
- Preview memakai **renderer yang sama** dengan data contoh → preview = tampilan asli.

| Template | Layout | Warna | Tipografi | Animasi khas |
|---|---|---|---|---|
| Wedding Classic | Cover hero → divider floral → countdown → detail → galeri → RSVP → guestbook | Ivory `#FBF7F0`, champagne `#E8D9C0`, gold `#C6A15B`, navy `#141C2B` | Cormorant Garamond + Playfair Display, body Plus Jakarta Sans | Fade-up berurutan, floating floral, parallax lembut |
| Birthday Celebration | Hero playful tilted → angka besar → marquee nama → grid → RSVP | Merah `#E4572E`, kuning `#F4B942`, ungu `#7B2CBF`, cream | Fredoka / Baloo 2 | Confetti, bounce-in angka, marquee berjalan |
| Baby Shower | Terpusat lembut, kartu besar, ilustrasi SVG bulat | Pastel biru `#BFD7EA` & pink `#F6DCE4`, white | Quicksand | Gentle float, scale-in kartu, pulse kecil |
| Graduation Modern | Split screen gelap editorial, tahun besar, list akademik | Hitam `#0B0B0F`, gold `#D4AF37` | Sora / Outfit | Reveal mask wipe, stagger baris, shine sweep |

### 5.6 Sistem animasi

**Pustaka: GSAP 3.15** (`gsap` + `@gsap/react`) — dipilih 12 Nov 2026 atas Motion, Anime.js, dan Theatre.js. Alasannya: Phase 4 (template engine) butuh koreografi timeline multi-tahap (confetti, marquee, mask-wipe, shine sweep) yang menjadi specialty GSAP; GSAP kini **100% gratis termasuk semua plugin** (SplitText, ScrollTrigger, MorphSVG) dengan penggunaan komersial; `gsap.matchMedia()` menyatukan responsif + `prefers-reduced-motion` dalam satu tempat; dan `@gsap/react` (`useGSAP`) menangani cleanup/revert dengan benar di App Router.

Prinsip: animasi punya tujuan (mengarah mata, umpan balik, state). Tidak ada parallax pada elemen yang sedang dibaca.

| Komponen | Perilaku | Reduced motion |
|---|---|---|
| `Reveal` | scroll reveal fade+slide 24px, sekali (`ScrollTrigger` `once: true`) | langsung tampil |
| `TextReveal` | split per kata, stagger 0.05s, `yPercent` + `opacity` | teks utuh, tanpa stagger |
| `Parallax` | `ScrollTrigger` `scrub: true`, desktop saja | statis |
| `Counter` | menghitung naik saat masuk viewport, ditulis langsung ke DOM (tanpa re-render React) | angka final |
| `FloatingDecor` | ornament melayang (`repeat: -1, yoyo`) | diam |
| `GradientOrb` | gradient blob bergerak via CSS keyframes (di luar main thread) | statis |
| `Stagger` | container `stagger` + `ScrollTrigger` `once: true` | statis |
| `PageTransition` | fade + slide 8px saat route berubah | tanpa transisi |
| `Modal` / `Toast` | fade + scale; `AnimatePresence` digantikan state `closing` + tween | durasi 0 |
| `MagneticButton` | `gsap.quickTo` mengikuti cursor (desktop + pointer fine) | statis |
| `GradientText` | teks dengan gradient emas (CSS) | statis |

Aturan implementasi:
- Semua animasi memakai `gsap.matchMedia()` dengan query eksplisit. Query `(prefers-reduced-motion: no-preference)` **hanya** cocok bila user tidak meminta reduced motion → callback tidak pernah jalan untuk mereka, dan karena state awal diterapkan GSAP sendiri, konten **tidak pernah** tersangkut di `opacity: 0`.
- Hanya `transform` & `opacity` yang dianimasikan (GPU-friendly). `autoAlpha` **dilarang** untuk konten halaman: ia menyetel `visibility: hidden` yang menghapus elemen dari accessibility tree sebelum animasi berjalan.
- `useGSAP()` dari `@gsap/react` (bukan `useEffect` + `gsap.context()`): cleanup & revert otomatis saat unmount.
- `gsap.quickTo()` untuk animasi yang sering di-update (pointer follow) — bukan membuat tween baru per event.
- Target memakai `ref` + `scope`, bukan selector string tanpa scope.
- Semua komponen animasi wajib ber-`"use client"` (GSAP tidak punya `use client` sendiri) — termasuk file barrel `components/motion/index.ts`.

### 5.7 Design tokens (Tailwind v4 `@theme`)

```css
--color-ivory:#FBF7F0; --color-cream:#F6EFE4; --color-champagne:#E8D9C0;
--color-gold:#C6A15B; --color-gold-light:#E3C68D; --color-navy:#141C2B;
--color-navy-soft:#1F2A3D; --color-blush:#E8C9C4; --color-sage:#B9C7B2;
--color-mist:#F1F5F9; --color-ink:#1A1A1A; --color-muted:#6B7280;
--font-display:"Cormorant Garamond",serif;
--font-sans:"Plus Jakarta Sans",system-ui,sans-serif;
--radius-card:1.25rem; --shadow-soft:0 20px 60px -30px rgb(20 28 43 / .35);
--shadow-glow:0 0 0 1px rgb(198 161 91 / .25), 0 24px 70px -40px rgb(198 161 91 / .6);
```

Font (semua terverifikasi ada di `next/font/google`): display `Cormorant Garamond`; body `Plus Jakarta Sans`; template: `Playfair Display`, `Fredoka`, `Baloo 2`, `Quicksand`, `Sora`, `Outfit`.

### 5.8 Brand asset — NUVAKARA

Logo resmi (emas + navy, dari file yang diberikan user):

| File | Pemakaian |
|---|---|
| `src/app/favicon.ico` | 16/32/48 multi-size, dari **emblem** (kotak rounded navy-emas) |
| `src/app/icon.png` (512), `src/app/apple-icon.png` (180) | app icon & iOS home screen |
| `public/brand/nuvakara-mark.png` (512×450) | monogram N emas — navbar, sidebar, dashboard, dekorasi hero |
| `public/brand/nuvakara-mark-sm.png` (256×225) | varian kecil |
| `public/brand/nuvakara-logo-lockup.png` (1400×381) | lockup penuh (monogram + divider + wordmark + ribbon) untuk section terang |

> Catatan penting warna: wordmark "NUVAKARA" emas + sub-teks navy → **lockup hanya dipakai di latar terang** (cream/ivory). Di navbar (transparan di atas hero gelap) dan sidebar yang gelap, pakai **monogram emas** (`nuvakara-mark.png`) + teks wordmark HTML dengan font display, supaya tajam, ringan, dan kontras di terang maupun gelap. Sub-teks navy pada lockup hilang di atas navy pekat — avoid.

Identitas visual yang diturunkan dari logo:
- Aksen emas = CTA, border, ikon aktif; navy pekat = latar gelap & teks heading; ivory/cream = latar utama. Konsisten dengan token di §5.7 (`--color-gold`, `--color-navy`, `--color-ivory`).
- Motif amplop + daun/laurel + pita → dipakai sebagai ornamen dekoratif (SVG/CSS) di hero, divider antar-section, dan kartu template ("floral decoration" pada Wedding Classic).
- Wordmark memakai serif display dengan letter-spacing lebar agar menyerupai logo.

> Folder repo tetap `D:\vowara` (tidak di-rename agar git & sesi tetap utuh); `package.json` name diubah menjadi `nuvakara`. Folder bisa di-rename kapan saja.

---

## 6. Model data (Postgres / Supabase)

### 6.1 `profiles`
`id uuid PK = auth.users.id` · `email text` · `full_name text` · `phone text` · `avatar_url text` ·
`role text ('user'|'admin')` · `status text ('active'|'suspended')` · `timezone text default 'Asia/Jakarta'` ·
`created_at`, `updated_at`.
Trigger `handle_new_user()` (SECURITY DEFINER) membuat baris saat `auth.users` INSERT.

### 6.2 `templates`
`id uuid PK` · `slug text UNIQUE` · `name text` · `description text` · `category text` · `is_premium bool` · `is_active bool` ·
`theme jsonb` · `preview_image_url text` · `sort_order int` · `created_at`, `updated_at`.

### 6.3 `events`
`id uuid PK` · `owner_id uuid → profiles(id)` · `template_id uuid → templates(id) on delete set null` · `template_slug text not null` ·
`slug text UNIQUE` · `title text` · `event_type text` · `host_name text` · `partner_name text` ·
`event_date timestamptz` · `event_end_date timestamptz` · `timezone text default 'Asia/Jakarta'` ·
`venue_name text` · `venue_address text` · `city text` · `latitude numeric` · `longitude numeric` ·
`description text` · `cover_image_url text` · `gallery jsonb` · `music_url text` ·
`guestbook_auto_approve bool default true` · `is_published bool default false` · `is_active bool default true` · `published_at timestamptz` ·
`created_at`, `updated_at`.
Index: `owner_id`, `slug`, `(is_published, is_active)`.
> Keputusan: `event_time`/`end_time` (text) **dihapus** — waktu disimpan sebagai `timestamptz` + kolom `timezone`; countdown & tampilan diformat dari zona acara. Tidak ada lagi `view_count` (lihat 6.6).

### 6.4 `rsvps`
`id uuid PK` · `event_id uuid → events(id) on delete cascade` · `guest_name text` · `guest_email text` ·
`attendance text ('attending'|'declined'|'maybe')` · `guest_count int default 1` · `message text` · `created_at`.
Unique parsial `unique (event_id, lower(guest_email)) where guest_email is not null` → RSVP ulang = upsert, bukan duplikat. Tanpa email → baris baru boleh.

### 6.5 `guestbook_entries`
`id uuid PK` · `event_id uuid → events(id) on delete cascade` · `guest_name text` · `message text` ·
`is_approved bool default false` · `is_hidden bool default false` · `created_at`. Index `event_id`, `is_approved`.

### 6.6 `event_visits`
`id bigint generated always as identity PK` · `event_id uuid → events(id) on delete cascade` · `visitor_hash text` ·
`referrer text` · `user_agent text` · `day date` · `created_at`.
> Keputusan: **satu baris per kunjungan** (tanpa unique harian). `views` = `count(*)`, `unique visitors` = `count(distinct visitor_hash)`. Kolom `events.view_count` dihapus → tidak ada risiko counter menyimpang.

### 6.7 `pricing_plans`
`id uuid PK` · `slug text UNIQUE` · `name text` · `description text` · `price numeric` · `currency text default 'IDR'` ·
`billing_period text` · `duration_days int` · `features jsonb` · `max_invitations int` · `allow_premium_templates bool` ·
`is_active bool` · `sort_order int` · `created_at`, `updated_at`.

### 6.8 `subscriptions`
`id uuid PK` · `user_id uuid → profiles(id)` · `plan_id uuid → pricing_plans(id)` · `status text ('active'|'cancelled'|'expired')` ·
`started_at timestamptz` · `expires_at timestamptz` · `created_at`.
Entitlement dihitung **`status='active' and (expires_at is null or expires_at > now())`** — tidak pernah `status` saja (baris bisa kedaluwarsa). Pindah paket = cancel-or-update baris aktif yang ada (bukan insert kedua).

### 6.9 `platform_settings`
`key text PK` · `value jsonb` · `updated_at` · `updated_by uuid`.
Keys: `site_name`, `site_tagline`, `logo_url`, `contact_email`, `contact_phone`, `contact_address`, `social_links`, `announcement`, `platform_policy`, `seo`, `footer_note`.

### 6.10 `admin_activity_logs`
`id bigint generated always as identity PK` · `admin_id uuid` · `admin_email text` ·
`action text` (`admin.login`, `user.update`, `user.suspend`, `user.activate`, `template.update`, `pricing.update`, `settings.update`, `invitation.disable`, `invitation.delete`, `guestbook.moderate`) ·
`entity_type text` · `entity_id text` · `metadata jsonb` · `ip text` · `created_at`.

### 6.11 `rate_limits`
`key text PK` · `window_start timestamptz` · `count int` — dikelola oleh RPC `check_rate_limit`.

### 6.12 Supabase Storage
Buckets: `avatars` (avatar user), `event-media` (cover + galeri), `audio` (musik latar).
Public read (agar `next/image` & share preview bisa mengambilnya), write terbatas: pemilik event untuk `event-media`/`audio`, user untuk `avatars`. MIME & ukuran divalidasi di route upload sebelum masuk bucket.

---

## 7. Row Level Security & Fungsi Database

Helper (SECURITY DEFINER, `search_path` dipatok, `grant execute` eksplisit ke `anon, authenticated`):
```sql
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin' and p.status='active');
$$;
create function public.owns_event(p_event uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.events e where e.id = p_event and e.owner_id = auth.uid());
$$;
```
> `profiles` memakai `enable row level security` **tanpa** `force` — dengan `force`, query di dalam `is_admin()` ikut difilter policy yang memanggil `is_admin()` → rekursi (42P17).

### 7.1 Policy

| Tabel | Select | Insert | Update | Delete |
|---|---|---|---|---|
| `profiles` | own row; admin semua | trigger saja | own row | — |
| `events` | own; **publik bila `is_published and is_active`**; admin semua | own | own | own (soft delete) |
| `rsvps` | owner event; admin semua | **hanya via RPC** | owner | owner |
| `guestbook_entries` | **dua policy (OR)**: `to anon, authenticated using (is_approved and not is_hidden)` **dan** `to authenticated using (public.owns_event(event_id))` → owner melihat approved **dan** unapproved **dan** hidden untuk moderasi | **hanya via RPC** | owner (moderasi) | owner |
| `event_visits` | owner (agregat); admin semua | **hanya via RPC** | — | — |
| `templates` | publik bila `is_active`; admin semua | admin | admin | admin |
| `pricing_plans` | publik bila `is_active`; admin semua | admin | admin | admin |
| `subscriptions` | own; admin semua | own | own | own |
| `platform_settings` | select publik untuk key aman; admin semua | admin | admin | admin |
| `admin_activity_logs` | admin saja | admin | — | — |

**Kenapa INSERT publik dimatikan:** anon key bersifat publik (`NEXT_PUBLIC_*`), sehingga policy INSERT untuk anon bisa dilewati total — orang bisa POST langsung ke PostgREST tanpa honeypot, tanpa rate limit, tanpa validasi. Karena itu seluruh tulisan dari tamu **hanya lewat RPC `SECURITY DEFINER`** yang menegakkan validasi + rate limit + honeypot **di dalam database**.

### 7.2 Fungsi
| Fungsi | Peran |
|---|---|
| `handle_new_user()` | trigger; **SECURITY DEFINER** (trigger dari `supabase_auth_admin` tidak punya hak INSERT ke `profiles`) |
| `prevent_role_escalation()` | trigger guard `role`/`status`; **SECURITY DEFINER**; mengizinkan bila `auth.role()='service_role'` **atau** `public.is_admin()`, selain itu raise. (Service-role JWT tidak punya `sub` → `auth.uid()` NULL; `current_user` di SECURITY DEFINER = owner fungsi, jadi cabang `service_role` wajib) |
| `check_rate_limit(p_key, p_limit, p_window_seconds)` | SECURITY DEFINER, `search_path` dipatok; upsert atomik ke `rate_limits` |
| `submit_rsvp(...)` | SECURITY DEFINER; validasi attendance/jumlah, upsert per `(event_id, lower(email))`, cek event published, terapkan rate limit |
| `submit_guestbook(...)` | SECURITY DEFINER; cek event published, `is_approved = event.guestbook_auto_approve`, terapkan rate limit |
| `track_visit(...)` | SECURITY DEFINER; hitung `visitor_hash` & `day` **di server** (`current_date` + digest), insert visit, kembalikan bool "baru" |
| `subscribe_plan(p_plan_id)` | SECURITY DEFINER; cancel-or-update subscription aktif |

`visitor_hash` & `day` dihitung di dalam DB → klien tidak bisa memalsukan. `on conflict do nothing` dipakai agar dedup tidak menghilangkan penghitung.

---

## 8. Keamanan

| Area | Implementasi |
|---|---|
| Authentication | Supabase Auth (bcrypt), cookie httpOnly via `@supabase/ssr` |
| Authorization | Role dari DB di server (`requireUser`/`requireAdmin`) + RLS mengunci baris; `proxy.ts` hanya optimistic check |
| Role dari browser | Tidak pernah dipercaya |
| Server-side validation | Semua input divalidasi zod **di server**; validasi juga diulang **di dalam RPC** untuk tulisan tamu |
| Input sanitization | React auto-escape; URL divalidasi (http/https saja); panjang dibatasi; slug disanitasi |
| Rate limiting | `check_rate_limit` di dalam RPC: RSVP 5/menit, guestbook 3/menit per `event+ip`; honeypot field; durasi minimum submit 2 detik |
| IP address | `NextRequest.ip` **tidak ada** (dihapus v15) → helper `getClientIp()`: `x-forwarded-for` (hop pertama) → `x-real-ip` → `"local"`. Key limit = `eventSlug + ip` agar satu acara tidak menghabiskan kuota acara lain |
| Secret handling | `SUPABASE_SERVICE_ROLE_KEY` hanya di `lib/supabase/admin.ts` (`import "server-only"`); browser hanya anon key + RLS |
| Audit log | Semua aksi admin lewat `logAdminAction()` |
| Suspension | Ditegakkan **hanya** di `requireUser()` (proxy tidak bisa tahu status tanpa query DB per request, dan campaigns redirect loop). Login page hanya redirect bila `status='active'` |
| Session | Cookie httpOnly, SameSite lax; logout menginvalidasi session server-side |
| Media | Validasi MIME + ukuran di route upload; bucket terpisah; write policy per pemilik |

---

## 9. Permukaan API

**Server actions** (`lib/actions/*`): `auth` (register, login, logout, forgotPassword, resetPassword, updateProfile), `events` (create, update, delete, publish, unpublish, changeTemplate), `rsvps` (moderasi & hapus), `guestbook` (moderate, delete), `templates` (admin metadata), `pricing` (admin CRUD, subscribe), `settings` (admin), `users` (admin: suspend/activate/role).

Urutannya selalu: (1) validasi zod → (2) cek session + role → (3) query via DAL → (4) `revalidatePath` → (5) return `{ ok, error }` serializable (bukan throw) supaya UI bisa menampilkan error inline.

**Route handler publik** (menulis lewat RPC, bukan INSERT langsung):
- `POST /api/rsvp` → `supabase.rpc('submit_rsvp', …)`
- `POST /api/guestbook` → `supabase.rpc('submit_guestbook', …)`
- `POST /api/track` → `supabase.rpc('track_visit', …)`

Rate limit & honeypot ditegakkan **di dalam RPC**; route handler hanya memvalidasi bentuk input, banned-IP check, dan meneruskan.

---

## 10. Halaman & Komponen Inti

### 10.1 Landing
`Navbar` (transparan di hero → solid saat scroll; drawer mobile), `Hero` (animated gradient + floating invitation cards + text reveal + 2 CTA), `Features` (10 fitur, glassmorphism card), `TemplateShowcase` (4 preview + Preview / Gunakan Template), `HowItWorks` (5 langkah), `Pricing` (dari DB), `Footer` (logo, nav, kontak, sosial, privasi, ketentuan). Smooth scroll + `scroll-margin-top`.

### 10.2 Dashboard
- **Overview**: 5 stat card (Total undangan, Pengunjung, RSVP, Konfirmasi hadir, Ucapan) + grafik (SVG custom, tanpa lib chart) + aktivitas terbaru.
- **Undangan Saya**: card (cover, judul, tanggal, status publish, views, uniques) + aksi edit / preview / publish / unpublish / salin link / share WhatsApp / ganti template / hapus.
- **Buat Undangan**: wizard 3 langkah (Basic Info → Template → Detail & Preview) dengan live preview memakai renderer asli.
- **Template**: galeri + filter kategori + "Gunakan".
- **Guestbook**: approve / hide / hapus.
- **RSVP**: filter status + statistik kehadiran.
- **Analytics**: views per hari, unique visitors, sumber traffic, breakdown RSVP.
- **Pengaturan Akun**: nama, telepon, timezone, avatar (Storage), ganti password.

Sidebar: Overview, Undangan Saya, Buat Undangan, Template, Guestbook, RSVP, Analytics, Pengaturan Akun, Logout. Mobile → drawer.

### 10.3 Admin `/admin`
Overview (total user, undangan, aktif, terpublikasi, pengunjung, grafik pendaftaran, aktivitas terbaru), User Management (cari, detail, jumlah undangan, suspend/activate, ubah role), Invitation Management (cari judul/pemilik, detail, nonaktifkan, hapus + audit), Template Management (metadata 4 template: nama/deskripsi/kategori/premium/aktif), Pricing Management (CRUD paket, harga, masa berlaku, fitur, kuota, premium), System Settings (nama platform, logo, kontak, sosial, pengumuman, kebijakan), Activity Log (filter).

### 10.4 Undangan publik `/invite/[slug]`
Cover → nama/pair → countdown → detail acara & lokasi + peta → galeri (lightbox) → musik (toggle, tanpa autoplay bersuara) → RSVP → guestbook (approved) → share (WhatsApp + salin link) → footer "Dibuat dengan NUVAKARA".
Event belum published / nonaktif / tidak ada → `notFound()`.
**Preview draft** memakai renderer yang sama di `/dashboard/invitations/[id]/preview` (owner only) — tidak pernah diekspos publik.
**OG metadata** (`generateMetadata` + `await params`, `metadataBase` di root layout, `openGraph.images` = cover) → pratinjau link WhatsApp/Telegram menampilkan kartu yang benar.

---

## 11. Strategi Pengujian & QA (Phase 7)

| Level | Isi | Cara |
|---|---|---|
| Unit (Vitest) | slugify, validasi zod, kuota paket, integritas registry template, helper format, `getClientIp` | `npm test` |
| Type | strict | `npx tsc --noEmit` |
| Lint | next core-web-vitals + typescript — **perintah terpisah** (`next build` tidak lagi menjalankan ESLint di Next 16) | `npm run lint` |
| Build | produksi | `npm run build` |
| Integrasi DB | create user (lewat admin API agar ter-confirm) → buat event → publish → fetch publik → RSVP → guestbook → suspend user → **uji RLS**: anon tak bisa baca event unpublished / event orang lain; anon tak bisa INSERT langsung ke `rsvps` | `node scripts/smoke.mjs` |
| Manual | alur auth, ganti template, publish/unpublish, moderasi, admin, layout mobile, animasi, reduced motion | checklist + screenshot |

Tidak ada klaim "selesai" tanpa output build/test di atas.

---

## 12. Prasyarat dari user (blocking)

**Wajib** — isi `D:\vowara\.env.local` (gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ADMIN_EMAILS=<email admin, dipisah koma>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
**Sangat disarankan** — agar migrasi & tipe bisa di-*generate* dan diuji sendiri:
```
SUPABASE_ACCESS_TOKEN=<personal access token>   # untuk supabase db push + gen types
SUPABASE_PROJECT_REF=<project ref>
# atau
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres
```
**Perilaku saat env belum ada:** helper DAL mengembalikan hasil kosong/fallback (bukan throw) sehingga landing page tetap bisa di-build & tampil dengan **empty state yang jujur** — tanpa data palsu. Semua fitur data/auth ditandai "belum teruji" sampai kredensial masuk.

**Tambahkan di Supabase Dashboard → Authentication:** aktifkan Email/Password; allow-list redirect `http://localhost:3000/reset-password`; (opsional) matikan "Confirm email" agar alur register langsung masuk dashboard — **apapun statusnya, kode menangani keduanya**.

---

## 13. Peta Fase → Pekerjaan

| Fase | Isi | Output terverifikasi |
|---|---|---|
| 1 | Design tokens, komponen UI, sistem animasi, navbar responsif, landing page, brand asset | Landing jalan, responsif, reduced-motion aman |
| 2 | Supabase clients, `proxy.ts`, halaman auth, DAL, RBAC, register/login/forgot/reset/logout/profile | Alur auth nyata + proteksi route |
| 3 | Schema + RLS + seed, dashboard overview, CRUD undangan, galeri template, preview, ganti template | Data nyata di dashboard |
| 4 | Renderer + 4 template, `/invite/[slug]`, countdown, galeri, musik, peta, OG metadata | Undangan publik per template |
| 5 | RPC RSVP/guestbook + rate limit + moderasi + WhatsApp share + Storage upload | Data tamu tersimpan & termoderasi |
| 6 | Panel admin lengkap + audit log + settings + pricing + paket gratis | Aksi admin tercatat |
| 7 | Unit test, smoke test, typecheck, lint, build, QA manual + responsive | Semua hijau + laporan |

---

## 14. Keputusan builder (dicatat)

| # | Keputusan | Alasan |
|---|---|---|
| 1 | **Paket "Gratis" di-seed**; trigger auto-create subscription untuk user baru (`max_invitations=1`, `allow_premium_templates=false`) | User baru tidak boleh menabrak "belum punya paket"; tetap jelas ada batas |
| 2 | Preview draft di route **owner-only** `/dashboard/invitations/[id]/preview` | Undangan unpublished tak boleh bocor lewat URL publik |
| 3 | `event_date` + `event_end_date` (timestamptz) + `events.timezone` (default `Asia/Jakarta`); kolom `event_time`/`end_time` (text) dihapus | Satu sumber kebenaran waktu; countdown & format konsisten |
| 4 | Owner "hapus" = **soft delete** (`is_active=false`, slug tetap direservasi); admin punya "nonaktifkan" **dan** "hapus permanen" (audit log) | Menjaga histori & tidak merusak link yang sudah dibagikan |
| 5 | `guestbook_auto_approve` default **true** + toggle di form acara | Guestbook kosong = fitur yang tampak mati |
| 6 | RSVP upsert per `(event_id, lower(email))` lewat RPC; email opsional | RSVP ulang tidak menduplikasi |
| 7 | Admin **tidak** membuat template visual baru, hanya mengelola metadata 4 template ter-seed | Sesuai spec §9; renderer butuh kode |
| 8 | Slug: auto dari judul, suffix otomatis bila bentrok, **dapat diedit hanya sebelum publish** | Link yang sudah dibagikan tidak boleh rusak |
| 9 | Media lewat **Supabase Storage** (bucket avatars/event-media/audio) + alternatif input URL | Sesuai stack spec; tetap fleksibel |
| 10 | Register menangani **both cases** email confirmation ON/OFF; smoke test membuat user ter-confirm via admin API | Tidak bergantung setting project |
| 11 | Metrik: `views` = `count(event_visits)`, `unique visitors` = `count(distinct visitor_hash)`; kolom `view_count` dihapus | Satu sumber data, tidak ada counter menyimpang |
| 12 | `NEXT_PUBLIC_SITE_URL` default localhost, dapat diubah; **di-freeze saat build** | Untuk metadataBase, OG, sitemap, redirect reset password, share URL |
| 13 | Copy mengikuti spec apa adanya (heading/CTA English, subheadline & sebagian section Indonesian, label dashboard/admin sesuai spec) — marketing copy dipusatkan di `src/lib/site-config.ts` | Pergantian bahasa cukup di satu file |
| 14 | Chart = komponen SVG sendiri (tanpa library chart) | Bundle kecil, tampilan premium, data dari DB |
| 15 | Toast kustom (tanpa sonner) | Konsistensi design system |
| 16 | `next/image` hanya untuk host allow-list (Supabase Storage); URL pengguna memakai `<img>` biasa | `images.remotePatterns` wajib allow-list; `images.qualities` default `[75]` |
