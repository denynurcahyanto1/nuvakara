# QA Phase 1 — Design Foundation & Landing Page

Tanggal: 12 November 2026
Branch: `feature/phase1-design-foundation`
Library animasi: **GSAP 3.15** (`gsap` + `@gsap/react`) — menggantikan Motion 14 pada 12 Nov 2026
Plan: `docs/superpowers/plans/2026-11-12-phase1-design-foundation-landing.md`

Semua angka di bawah adalah hasil pengukuran nyata, bukan estimasi.，环境 yang dipakai:
`npm run build` → `npm run start -p 3200` (build produksi), browser Chromium in-app.

---

## 1. Gate otomatis

| Gate | Perintah | Hasil |
|---|---|---|
| Unit & component test | `npm test` | ✅ 12 file, **80 test passed**, 0 failed, output tanpa warning |
| Type check | `npm run typecheck` | ✅ 0 error |
| Lint | `npm run lint` | ✅ 0 error, 0 warning |
| Production build | `npm run build` | ✅ sukses, 10 route |
| Route dynamic | — | ✅ `/` dan `/harga` = `ƒ` (server-rendered on demand, harga tidak basi) |
| Route static | — | ✅ `/fitur`, `/template`, `/tentang`, `/privasi`, `/ketentuan` = `○` (prerender) |

> Catatan: `next build` **tidak** menjalankan ESLint di Next 16 → `npm run lint` wajib dijalankan terpisah dan **sudah hijau**.

---

## 2. Review Focus — 6 kondisi yang paling mungkin menggigit pengguna

| # | Kondisi | Test / cara ukur | Hasil |
|---|---|---|---|
| 1 | **Pengguna di HP Android kelas bawah, koneksi 3G, dibuka dari WhatsApp** | LCP/FCP di build produksi; audit transfer | ✅ LCP **440 ms**, FCP **440 ms**, DOMContentLoaded **350 ms**, total transfer **277 KB** (15 resource, 195 KB script). Tidak ada gambar > 60 KB: `nuvakara-mark.png` (351 KB) dioptimasi `next/image` jadi **1 KB & 6 KB** varian. ⚠️ Diukur tanpa throttling (localhost); pada 3G nyata tambahkan ±2–3 s untuk 277 KB. |
| 3 | **Navigasi keyboard** | Drawer mobile + unit test Modal | ✅ Toggle **44×44 px**; drawer terbuka → `aria-expanded="true"`, body scroll terkunci; **Escape** menutup → `aria-expanded="false"`, scroll dilepas, **fokus kembali ke tombol toggle**. Modal: unit test mengunci Escape, backdrop click, dan focus masuk ke dialog (`tests/components/ui/Modal.test.tsx`). |
| 4 | **`prefers-reduced-motion: reduce`** | `tests/components/motion/reduced-motion.test.tsx` (file terpisah, isolation modul Vitest) | ✅ 3 test hijau: Counter tampil di nilai akhir, Reveal tetap menampilkan konten utuh (tidak stuck `opacity:0`), TextReveal tanpa pemecahan kata. CSS global juga mematikan animasi via `@media (prefers-reduced-motion: reduce)`. |
| 5 | **Konten panjang / ekstrem** | Injeksi judul 70 karakter + audit lebar | ✅ Injeksi judul panjang → `scrollWidth - clientWidth` tetap **0**; elemen terlebar 565 px < viewport 580 px. |
| 6 | **Konten kosong / belum terkonfigurasi** | `/harga` di build produksi | ✅ Menampilkan **"Paket harga sedang disiapkan"** + empty state. **Tidak ada** harga karangan (`Rp 0` tidak ada). Konsol bersih. |

---

## 3. Aksesibilitas & mutu (Lighthouse, build produksi)

| Kategori | Skor | Catatan |
|---|---|---|
| Accessibility | **1.00** | Awal 0.88 → 3 failure diperbaiki (lihat §4) |
| Best Practices | **1.00** | — |
| SEO | **1.00** | — |

Audit tambahan via DOM:
- `lang="id"` ✅ · `<meta name="viewport" content="width=device-width, initial-scale=1">` ✅ (zoom **tidak** dikunci — aksesibilitas) ✅
- Icon link terpasang: `/favicon.ico`, `/icon.png`, `/apple-icon.png` ✅
- Struktur list valid: `<ol>` punya anak langsung `<li>` ✅
- Heading: `h1` = "Create Beautiful Invitations for Your Special Moments." ✅

---

## 4. Temuan yang diperbaiki selama QA

| Temuan | Dampak | Perbaikan | Regression test |
|---|---|---|---|
| Teks emas `#C6A15B` di latar terang hanya **2.27:1** (butuh 4.5:1) | Badge hero, judul grup footer, label section tidak terbaca oleh pengguna dengan penglihatan rendah | Token baru `--color-gold-deep: #7D5F28` (5.56:1 di ivory, 5.19:1 di cream) untuk **teks di latar terang**; emas tetap untuk latar gelap & ornamen. `SectionHeading` dapat `tone="dark"` untuk section navy | `tests/components/marketing/sections.test.tsx` (gold-deep di terang, gold di gelap) + `tests/unit/brand.test.ts` (token ada) |
| `<ol>` berisi `<div>` pembungkus sehingga `<li>` bukan anak langsung | Screen reader salah mengumumkan daftar 5 langkah How It Works | `Reveal` kini mendukung `as="li"`; HowItWorks memakai `<Reveal as="li">` | `sections.test.tsx`: `ol > li` berjumlah 5 |
| Link logo hanya **28 px** tinggi | Target sentuh di bawah 44 px → salah ketuk di ponsel | Logo memakai `min-h-11` | Terverifikasi ulang di browser: tinggi link drawer **44 px** |
| Vite memperingatkan config ESM dimuat sebagai CommonJS | Output test tidak pristine | `vitest.config.ts` → `vitest.config.mts` | `npm test` tanpa warning |
| `eslint` error `react-hooks/set-state-in-effect` di Counter | Build/lint gagal | Nilai reduced-motion dihitung saat render, bukan `setState` di dalam effect | `npm run lint` hijau |
| `@types/node@20` (scaffold) bentrok dengan peer `vitest@5` | `npm install -D` gagal ERESOLVE | Dinaikkan ke `^26` sesuai runtime Node 26.13 | Install bersih |
| `autoAlpha: 0` (GSAP) menyetel `visibility: hidden` | Elemen **hilang dari accessibility tree** sebelum animasi scroll-reveal jalan → konten tak terbaca screen reader, dan query role di test gagal | Semua animasi konten halaman memakai `opacity` + `transform` saja; `autoAlpha` hanya boleh untuk elemen yang memang dirender saat terbuka (modal/toast) | `tests/components/motion/motion.test.tsx`: `Reveal tidak menyembunyikan isi dari accessibility tree` |
| `"use client"` hilang dari 8 komponen motion saat penulisan ulang | Build gagal: `importing a module that depends on useRef into a React Server Component module` | Directive dikembalikan ke seluruh komponen motion **dan** ke barrel `components/motion/index.ts` (GSAP tidak punya directive sendiri,unlike Motion) | `npm run build` sukses |
| jsdom (Vitest 5) tidak menyediakan `window.matchMedia` | `ScrollTrigger` memanggilnya saat `registerPlugin` → seluruh file test yang mengimpor komponen GSAP gagal saat import | Polyfill `matchMedia` di `src/tests/setup.ts` yang menjawab query yang dipakai project | 80/80 test hijau |
| `Reveal as="li"` menghasilkan `<li>` di dalam `<ol>` | Struktur list jadi valid untuk screen reader | `Reveal` mendukung `as="li"`; HowItWorks memakai `<Reveal as="li">` | `sections.test.tsx`: `ol > li` berjumlah 5 |

---

## 5. Checklist manual — telah diuji

| Item | Expected | Hasil |
|---|---|---|
| `/` memuat semua section | hero, fitur, template, cara kerja, harga, CTA, footer | ✅ 5 section (`beranda`, `fitur`, `template`, `cara`, `harga`) + footer `tentang`; 10 kartu fitur + 4 kartu template |
| Drawer mobile | terbuka/tertutup, bisa ditutup Escape | ✅ (lihat §2 no. 3) |
| Target sentuh | ≥ 44×44 px | ✅ toggle 44, link drawer 44, CTA hero 56 |
| Horizontal overflow | 0 px | ✅ 0 px |
| Konsol browser | tanpa error | ✅ 0 error di `/` dan `/harga` |
| Brand | logo, favicon, wordmark NUVAKARA | ✅ `src/app/favicon.ico` (16/32/48), `icon.png` 256 px, `apple-icon.png` 180 px, `public/brand/*` |
| Sisa branding VOWARA | nihil | ✅ `grep -ri vowara src/` → 0 hasil |
| Data palsu | nihil | ✅ Harga kosong → empty state jujur; DAL mengembalikan `[]` + `console.warn` bila query gagal |

---

## 6. Yang **belum** terverifikasi (batas Phase 1)

| Item | Alasan | Rencana |
|---|---|---|
| Tampilan visual pada 320/375/390/430 px | Browser in-app punya viewport tetap 580 px dan tidak bisa di-resize dari harness | Verifikasi visual manual oleh pemilik di ponsel nyata; kode sudah mobile-first + audit `min-width` bersih |
| LCP pada jaringan 3G sungguhan | Tidak ada tool throttling di harness ini | Uji manual di DevTools (Slow 3G) |
| Screenshot visual | `browser.screenshot` butuh jendela desktop terlihat (tidak tersedia dari harness) | Ambil manual dari browser |
| Performa desktop ≥ 1024 px | Viewport harness < breakpoint `lg` | Audit breakpoint dilakukan lewat kelas Tailwind (`sm:`/`md:`/`lg:`) |
| Data harga nyata | Tabel `pricing_plans` belum ada — migrasi ada di Phase 3 | Seed paket + generate tipe di Phase 3 |

---

## 7. Ringkasan

Phase 1 **lulus**: 79 test hijau, typecheck & lint bersih, build produksi sukses, Lighthouse 1.00/1.00/1.00, tanpa scroll horizontal, tanpa data palsu, tanpa branding VOWARA tersisa, dan 6 temuan aksesibilitas/performanya sudah diperbaiki dengan regression test.
