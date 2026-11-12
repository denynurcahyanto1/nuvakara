# NUVAKARA — Phase 1: Design Foundation & Landing Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun design system, sistem animasi, dan landing page premium NUVAKARA yang responsif, aksesibel, dan hormati `prefers-reduced-motion`.

**Architecture:** Next.js 16 App Router + Tailwind v4 (CSS-first tokens) + Motion v14 untuk animasi. Layer: `components/ui` (primitif), `components/motion` (primitif animasi), `components/marketing` (section landing). Copy marketing terpusat di `src/lib/site-config.ts` sehingga pergantian brand/copy hanya di satu file. Data dinamis (paket harga, template) dibaca lewat DAL dengan fallback empty-state sehingga halaman tetap build tanpa kredensial.

**Tech Stack:** next 16.4.6 · react 19.3 · typescript 5 (strict) · tailwindcss 4.3.3 · motion 14.x · zod 4.x · clsx + tailwind-merge · vitest 3 + @testing-library/react + jsdom

**Spec:** `docs/superpowers/specs/2026-11-12-nuvakara-design.md` (revisi 3)

---

## Roadmap (7 plan terpisah, satu per fase)

| Plan | Fase | File plan |
|---|---|---|
| 1 | Design Foundation + Landing | `docs/superpowers/plans/2026-11-12-phase1-design-foundation-landing.md` (dokumen ini) |
| 2 | Authentikasi | `2026-11-12-phase2-auth.md` — ditulis sebelum Phase 2 dieksekusi |
| 3 | Data layer + Dashboard | `2026-11-12-phase3-dashboard.md` |
| 4 | Public invitation + Template engine | `2026-11-12-phase4-public-invitation.md` |
| 5 | RSVP, Guestbook, Storage | `2026-11-12-phase5-guest-interaction.md` |
| 6 | Admin panel | `2026-11-12-phase6-admin.md` |
| 7 | QA | `2026-11-12-phase7-qa.md` |

Setiap plan menghasilkan perangkat lunak yang bisa dijalankan & diuji sendiri.

---

## Global Constraints

- **Next.js 16.4.6**: `params`/`searchParams` adalah Promise (wajib `await`); `middleware.ts` sudah menjadi **`proxy.ts`** (runtime `nodejs`); Turbopack default; `cacheComponents` **tidak** diaktifkan; `next build` **tidak** menjalankan ESLint → `npm run lint` adalah perintah terpisah; `next lint` sudah dihapus.
- **React 19.3**: `useActionState` untuk form server action.
- **Tailwind CSS v4**: CSS-first. **Tidak ada** `tailwind.config.js`. Token ditulis di `src/app/globals.css` blok `@theme`.
- **Animation library: GSAP 3.15** (`gsap` + `@gsap/react`) — NOT Motion/Anime.js/Theatre.js. Decided 2026-11-12 after a three-way comparison (GSAP 28 KB gz core + 17 KB ScrollTrigger, 100% free incl. all plugins & commercial use; Anime.js 3–10 KB but no official React hook and a shallower scroll API; Theatre.js pre-1.0 with an AGPL studio and a dormant public repo). Rules: `gsap.matchMedia()` with explicit queries; the animate branch only matches `(prefers-reduced-motion: no-preference)`; `useGSAP()` from `@gsap/react` for automatic cleanup; `gsap.quickTo()` for pointer-driven values; `ref` + `scope` instead of bare selectors; **never `autoAlpha`** on page content (it sets `visibility: hidden` and removes the element from the accessibility tree); only `transform`/`opacity`; every animation component needs `"use client"`, including the barrel `components/motion/index.ts`.
- **Brand**: NUVAKARA. Aset: `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`, `public/brand/nuvakara-mark.png`, `public/brand/nuvakara-mark-sm.png`, `public/brand/nuvakara-logo-lockup.png`. Logo lockup **hanya** dipakai di latar terang (sub-teks navy).
- **Copy**: `Every Moment Deserves a Beautiful Invitation.` (tagline), `Create Beautiful Invitations for Your Special Moments.` (hero), `Ubah momen spesial menjadi pengalaman digital yang tak terlupakan bersama Nuvakara.` (subheadline). Tanpa branding vendor lain, tanpa watermark.
- **Tidak boleh** ada data dummy, tombol palsu, atau klaim transaksi.
- **Bahasa**: heading/CTA marketing berbahasa Inggris; subheadline & beberapa section berbahasa Indonesia; label dashboard/admin mengikuti spec. Semua copy berasal dari `site-config.ts`.
- **Aksesibilitas**: kontras WCAG AA, fokus keyboard terlihat, semua input punya label, `prefers-reduced-motion` dihormati.
- **I18n waktu**: belum ada; tanggal landing statis (tanpa DB).
- **TypeScript strict**; `@/*` → `src/*`.

---

## Mobile-First Constraint (prioritas utama)

Mayoritas pengguna NUVAKARA ada di ponsel. Semua yang dibangun di plan ini **mobile-first**: basisnya layar kecil, desktop adalah peningkatan.

| Aturan | Nilai konkret |
|---|---|
| Breakpoint | Tailwind default: `sm:640` · `md:768` · `lg:1024` · `xl:1280`. **Komponen ditulis mobile-first** — gaya dasar = tampilan ponsel, `sm:`/`md:`/`lg:` menambah |
| Target sentuh | Semua elemen interaktif **minimal 44×44px** (tombol, link, icon button, item menu, pilihan chip) |
| Tipografi | `text-base` (16px) pada semua input — di bawah 16px iOS auto-zoom saat fokus dan merusak layout |
| Hover | Semua efek hover dibungkus `@media (hover: hover)` — di perangkat sentuh, hover tidak boleh jadi satu-satunya cara menemukan konten |
| Viewport | Tinggi memakai `100dvh` (bukan `100vh`) agar tidak tertutup chrome browser mobile |
| Safe area | Elemen menempel bawah memakai `padding-bottom: env(safe-area-inset-bottom)` (notch/home indicator iOS) |
| Gambar | `next/image` **wajib** menyertakan `sizes` yang akurat; aset berat (lockup 1400px) hanya dimuat di `lg:` ke atas |
| Menu | Drawer mobile = sheet full-height yang bisa di-scroll, dengan tombol tutup besar di kanan atas |
| Form | Input full-width, label selalu terlihat (bukan placeholder-as-label), pesan error dekat input |
| CTA | Tombol utama full-width di mobile (`w-full sm:w-auto`) |
| Data | Tidak ada data weighty di bawah fold; section bawah lazily dimount |

**Review Focus tambahan (item 6):** pengguna membuka dari link WhatsApp di HP Android kelas bawah (RAM 2GB, koneksi 3G) → halaman harus tampil & bisa-RSVP dalam < 3 detik di koneksi lambat; gambar & font tidak boleh memblokir render.

---

## Review Focus

Lima kelas input/kondisi yang paling mungkin menggigit pengguna akhir dan **tidak** diuji oleh task mana pun di plan ini:

1. **Layar 320–390px (mobile sempit)** — navbar, hero, grid fitur, dan tombol CTA harus tetap terbaca & tidak overflow horizontal. → Task 5
2. **Navigasi keyboard** — drawer mobile harus bisa ditutup dengan Escape dan mengembalikan fokus; modal harus trap focus. → Task 2 (Modal) & Task 4 (Navbar)
3. **`prefers-reduced-motion: reduce`** — semua animasi reveal/counter/parallax harus menjadi statis dan konten **tetap terlihat** (tidak stuck di `opacity: 0`). → Task 3
4. **Konten panjang/ekstrem** — judul acara 120 karakter, nama fitur panjang, dan teks tanpa spasi tidak boleh merusak layout (word-break, `text-wrap: balance`). → Task 4 (Features) & Task 5
5. **Konten kosong & belum terkonfigurasi** — DB belum dimigrasi / `pricing_plans` kosong / template nonaktif → landing harus menampilkan empty state yang jujur, **bukan** harga atau template palsu. → Task 4 (Pricing) & Task 5
6. **Pengguna di HP Android kelas bawah, koneksi 3G, dibuka dari WhatsApp** — harus melihat konten utama dan bisa bertindak (CTA/RSVP) tanpa menunggu aset berat; target sentuh tidak boleh lebih kecil dari 44px sehingga tidak salah ketuk. → Task 4 (mobile drawer, CTA full-width, `sizes` gambar) & Task 5 (mobile QA)

---

## File Structure

```
src/
  app/
    globals.css              # @theme tokens, base layer, utility classes
    layout.tsx               # fonts, metadata (metadataBase), <body>
    template.tsx             # page transition wrapper (client)
    page.tsx                 # landing (server component)
    fitur/page.tsx  template/page.tsx  harga/page.tsx
    tentang/page.tsx  privasi/page.tsx  ketentuan/page.tsx
    not-found.tsx  error.tsx
  components/
    ui/       Button.tsx Card.tsx Input.tsx Textarea.tsx Select.tsx
              Switch.tsx Field.tsx Badge.tsx Modal.tsx Toast.tsx
              Skeleton.tsx EmptyState.tsx SectionHeading.tsx Container.tsx
              Logo.tsx
    motion/   Reveal.tsx TextReveal.tsx Parallax.tsx Counter.tsx
              FloatingDecor.tsx GradientOrb.tsx Stagger.tsx
              PageTransition.tsx MagneticButton.tsx GradientText.tsx
              index.ts (barrel)
    marketing/ Navbar.tsx Hero.tsx Features.tsx TemplateShowcase.tsx
              HowItWorks.tsx Pricing.tsx Footer.tsx CtaBanner.tsx
              SectionHeading.tsx (re-export dari ui)
  lib/
    site-config.ts           # seluruh copy marketing + brand
    cn.ts                    # cn()
    utils.ts                 # slugify, formatDate, formatNumber, formatCurrency
    types.ts                 # tipe bersama (Feature, Plan, TemplatePreview…)
  tests/
    setup.ts                 # jest-dom + cleanup
tests/
  unit/                      # test pure logic (node env)
  components/                # test komponen (jsdom)
```

**Konvensi:** satu file = satu tanggung jawab. Komponen presentasional tidak memanggil DAL; data dari DB masuk lewat props.

---

## Task 1: Setup Proyek, Token Design, Konfigurasi Brand

**Files:**
- Modify: `package.json` (scripts + deps), `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/lib/site-config.ts`, `src/lib/cn.ts`, `src/lib/utils.ts`, `src/lib/types.ts`
- Create: `vitest.config.ts`, `src/tests/setup.ts`
- Test: `tests/unit/site-config.test.ts`, `tests/unit/utils.test.ts`

**Interfaces:**
- Produces:
  - `siteConfig: { name: "NUVAKARA"; tagline: string; description: string; nav: { label: string; href: string }[]; features: Feature[]; howItWorks: { step: string; title: string; description: string }[]; footer: { description: string; navGroups: { title: string; links: { label: string; href: string }[] }[]; contact: { email: string; phone: string; address: string }; socials: { label: string; href: string }[] } }`
  - `Feature { id: string; title: string; description: string; icon: string }`
  - `cn(...inputs: ClassValue[]): string`
  - `slugify(input: string): string`, `formatNumber(n: number): string`, `formatCurrency(n: number, currency?: string): string`, `formatDate(d: Date | string): string`
  - `vitest.config.ts` dengan `environment: "jsdom"`, `setupFiles: ["src/tests/setup.ts"]`, alias `@` → `./src`

- [ ] **Step 1: Install dependency**

Run:
```bash
npm install motion zod clsx tailwind-merge @supabase/supabase-js @supabase/ssr server-only
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event pg @types/pg
```
Expected: exit 0; `package.json` dependencies berisi `motion`, `zod`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`, `@supabase/ssr`, `server-only`.

- [ ] **Step 2: Tambah script npm**

Edit `package.json` scripts menjadi:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```
Expected: `npm run typecheck` → exit 0 (script baru ada).

- [ ] **Step 3: Write failing test — konfigurasi brand & util**

Buat `tests/unit/site-config.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("memakai brand NUVAKARA dan tagline yang disepakati", () => {
    expect(siteConfig.name).toBe("NUVAKARA");
    expect(siteConfig.tagline).toBe("Every Moment Deserves a Beautiful Invitation.");
  });

  it("menampilkan 10 fitur sesuai spec", () => {
    expect(siteConfig.features).toHaveLength(10);
    expect(siteConfig.features.map((f) => f.id)).toEqual(
      expect.arrayContaining(["digital-invitation", "premium-templates", "rsvp", "guestbook", "gallery", "music", "countdown", "maps", "analytics", "whatsapp"]),
    );
  });

  it("memuat 5 langkah how-it-works dan link nav ke section yang ada", () => {
    expect(siteConfig.howItWorks).toHaveLength(5);
    const hrefs = siteConfig.nav.map((n) => n.href);
    expect(hrefs).toEqual(expect.arrayContaining(["/#fitur", "/#template", "/#harga", "/#tentang"]));
  });
});
```

Buat `tests/unit/utils.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber, slugify } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class dan menghapus konflikt", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("slugify", () => {
  it("menghasilkan slug aman untuk URL", () => {
    expect(slugify("Rafi & Aisyah")).toBe("rafi-aisyah");
    expect(slugify("  Wisuda 2026!  ")).toBe("wisuda-2026");
  });
});

describe("format", () => {
  it("memformat angka dan rupiah", () => {
    expect(formatNumber(12345)).toBe("12.345");
    expect(formatCurrency(150000)).toContain("150.000");
  });
});
```

- [ ] **Step 4: Run test untuk memastikan gagal**

Run: `npm test -- tests/unit/site-config.test.ts tests/unit/utils.test.ts`
Expected: FAIL — `Cannot find module '@/lib/site-config'`.

- [ ] **Step 5: Implementasikan konfigurasi & util**

Buat `src/lib/cn.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Buat `src/lib/utils.ts` — exports `slugify`, `formatNumber`, `formatCurrency`, `formatDate` dengan perilaku persis seperti test (lowercase, collapse spasi, strip karakter selain alphanumerik & spasi → ganti dengan `-`).

Buat `src/lib/types.ts` — deklarasi `Feature`, `Plan`, `TemplatePreview`, `NavLink`.

Buat `src/lib/site-config.ts` — isi dengan copy spec: `name: "NUVAKARA"`, tagline, description, nav (`Home /#beranda`, `Fitur /#fitur`, `Template /#template`, `Harga /#harga`, `Tentang Kami /#tentang`), 10 fitur (id, title, description, icon = nama ikon string), 5 langkah how-it-works, footer (3 grup nav: Produk / Perusahaan / Legal, kontak, 4 sosial).

- [ ] **Step 6: Write failing test — token design harus lengkap**

Buat `tests/unit/brand.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("design tokens", () => {
  const required = [
    "--color-ivory", "--color-cream", "--color-champagne", "--color-gold",
    "--color-navy", "--color-navy-soft", "--color-blush", "--color-sage",
    "--font-display", "--font-sans", "--radius-card", "--shadow-soft", "--shadow-glow",
  ];

  it.each(required)("mendefinisikan token %s", (token) => {
    expect(css).toContain(token);
  });

  it("tidak memakai config tailwind terpisah (v4 css-first)", () => {
    expect(() => readFileSync(join(process.cwd(), "tailwind.config.js"), "utf8")).toThrow();
  });
});
```
Expected FAIL: token belum ada di `globals.css`.

- [ ] **Step 7: Implementasikan token & layout**

Rewrite `src/app/globals.css`:
- `@import "tailwindcss";` (baris pertama)
- `@theme inline { ... }` berisi `--color-ivory:#FBF7F0; --color-cream:#F6EFE4; --color-champagne:#E8D9C0; --color-gold:#C6A15B; --color-gold-light:#E3C68D; --color-navy:#141C2B; --color-navy-soft:#1F2A3D; --color-blush:#E8C9C4; --color-sage:#B9C7B2; --color-mist:#F1F5F9; --color-ink:#1A1A1A; --color-muted:#6B7280; --font-display:var(--font-cormorant); --font-sans:var(--font-jakarta); --radius-card:1.25rem; --shadow-soft:...; --shadow-glow:...`
- base layer: `body { background: var(--color-ivory); color: var(--color-ink); font-family: var(--font-sans); }`, `h1,h2,h3 { font-family: var(--font-display); text-wrap: balance; }`
- utility `.container-page` (max-w-7xl + padding responsif `px-5 sm:px-8 lg:px-10`), `.glass` (backdrop-blur + bg-white/60 + border), `.gold-rule`, `.focus-ring`
- utility `.tap-target { min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; }` — dipakai semua elemen interaktif
- utility `.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }` dan `.h-dvh { height: 100dvh; }` (mobile-safe viewport height)
- `input, textarea, select { font-size: 16px; }` — mencegah iOS auto-zoom
- `prefers-reduced-motion: reduce` → `*, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }`

Rewrite `src/app/layout.tsx`: `import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google"` dengan `variable: "--font-cormorant"` / `"--font-jakarta"`, `subsets: ["latin"]`, `display: "swap"`; `metadata` berisi `title: { default: "NUVAKARA — Every Moment Deserves a Beautiful Invitation.", template: "%s | NUVAKARA" }`, `description`, `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http:/localhost:3000")`, `applicationName: "NUVAKARA"`, `openGraph.type: "website"`, `icons` menunjuk ke file app icon.

- [ ] **Step 8: Setup vitest**

Buat `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "jsdom", setupFiles: ["./src/tests/setup.ts"], globals: true },
});
```
Buat `src/tests/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
```
Tambahkan ke `tsconfig.json` pada `compilerOptions`: `"types": ["node", "vitest/globals", "@testing-library/jest-dom"]` (`node` wajib — test memakai `node:fs` & `process.cwd()`).

- [ ] **Step 9: Run test untuk memastikan lulus**

Run: `npm test`
Expected: PASS untuk `site-config`, `utils`, `brand`.

- [ ] **Step 10: Typecheck & lint**

Run: `npm run typecheck && npm run lint`
Expected: keduanya exit 0.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tsconfig.json src/app/globals.css src/app/layout.tsx src/lib src/tests tests scripts
git commit -m "feat: design tokens, brand config, and test harness"
```

---

## Task 2: Primitif UI

**Files:**
- Create: `src/components/ui/{Button,Card,Input,Textarea,Select,Switch,Field,Badge,Modal,Toast,Skeleton,EmptyState,Container,SectionHeading,Logo}.tsx`
- Test: `tests/components/ui/*.test.tsx`

**Interfaces:**
- Produces:
  - `<Button variant?: "primary"|"secondary"|"ghost"|"danger"; size?: "sm"|"md"|"lg"; href?: string; isLoading?: boolean; leftIcon?: ReactNode; rightIcon?: ReactNode; ...>` — merender `<a>` bila `href`, `<button>` bila tidak; `isLoading` → `aria-busy="true"` + spinner + `disabled`.
  - `<Input name; type?; label?; error?; hint?; ...>` → merender `<input>` + `<label htmlFor>` + pesan error dengan `aria-invalid` & `aria-describedby`.
  - `<Field label htmlFor error hint required>` — wrapper label/desc/error untuk kontrol custom.
  - `Plan { id: string; slug?: string; name: string; description?: string | null; price: number; currency: string; features: string[]; maxInvitations: number; isPremium: boolean }` — bentuk **UI**; `slug` & `description` opsional supaya fixture test boleh memakai bentuk minimum. DAL mengembalikan `PlanRecord` (snake_case) dan halaman memetakannya secara eksplisit ke `Plan` di `src/app/page.tsx` (mapping eksplisit, bukan diam-diam).
  - `<Modal open onClose title description children footer>` — portal, tutup dengan Escape, klik backdrop, `role="dialog"` `aria-modal="true"`, fokus dipindah ke dialog saat terbuka, focus trap, `document.body` scroll lock.
  - `<ToastProvider>` + `useToast(): { toast: (opts: { title: string; description?: string; variant?: "default"|"success"|"error" }) => void }`.
  - `<Skeleton className?>` (shimmer), `<EmptyState icon? title description action?>`, `<Badge variant?>`, `<Card>`, `<Container>`, `<SectionHeading eyebrow? title description align?>`, `<Logo size? variant? href? />` (monogram emas + wordmark HTML).
  - `<Switch checked onChange label>`, `<Select options value onChange>`, `<Textarea>`.

- [ ] **Step 1: Write failing test — Button**

Buat `tests/components/ui/Button.test.tsx`:
```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("merender anchor ketika href diberikan", () => {
    render(<Button href="/daftar">Buat Undangan</Button>);
    const link = screen.getByRole("link", { name: "Buat Undangan" });
    expect(link).toHaveAttribute("href", "/daftar");
  });

  it("menonaktifkan dan menandai busy saat isLoading", () => {
    render(<Button isLoading>Simpan</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("memanggil onClick saat ditekan", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Kirim</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test untuk memastikan gagal**

Run: `npm test -- tests/components/ui/Button.test.tsx`
Expected: FAIL — `Cannot find module '@/components/ui/Button'`.

- [ ] **Step 3: Implementasikan Button**

`src/components/ui/Button.tsx` — `"use client"` hanya bila butuh interaksi client (tidak perlu; cukup forwardRef + className merge). Varian warna memakai token Tailwind (`bg-gold text-navy`, `bg-navy text-ivory`, `border border-navy/15`, `text-navy hover:bg-navy/5`). `isLoading` → `aria-busy`, `disabled`, dan spinner SVG dengan `aria-hidden`.

- [ ] **Step 4: Write failing test — Input & Field**

Buat `tests/components/ui/Input.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("mengaitkan label, error, dan aria-invalid", () => {
    render(<Input name="email" label="Email" error="Format email tidak valid" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Format email tidak valid");
  });
});
```

- [ ] **Step 5: Implementasikan Input, Textarea, Select, Field, Switch**

Semua memakai `cn()`; error menampilkan `role="alert"` dan `aria-describedby` menunjuk id error; `label` selalu terhubung via `htmlFor`/`id` — `id` diturunkan dari `name` bila tidak diberikan (deterministik, tanpa `useId`, agar komponen tetap bisa dipakai di Server Component).

> Catatan: komponen yang memakai `useId` harus `"use client"`. Fields stateless boleh server.

- [ ] **Step 6: Write failing test — Modal**

Buat `tests/components/ui/Modal.test.tsx`:
```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("menutup dengan tombol Escape", async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Hapus Undangan">Isi</Modal>);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("tidak merender saat open=false", () => {
    render(<Modal open={false} onClose={() => {}} title="X">Isi</Modal>);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
```

- [ ] **Step 7: Implementasikan Modal**

`"use client"`. Render via `createPortal` ke `document.body`; `useEffect` menambah listener `keydown` (Escape) saat `open`; body `overflow: hidden` saat terbuka; fokus ke elemen dialog saat terbuka; `onClick` backdrop (target === currentTarget) memanggil `onClose`. Animasi pakai Motion `AnimatePresence` + `motion.div` (fade + scale 0.96→1, durasi 0.2s), dan **tidak** animasi bila `prefers-reduced-motion`.

- [ ] **Step 8: Write failing test — Toast, EmptyState, Skeleton, Logo**

Buat `tests/components/ui/misc.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Logo } from "@/components/ui/Logo";

describe("misc ui", () => {
  it("EmptyState menampilkan judul dan aksi", () => {
    render(<EmptyState title="Belum ada undangan" description="Buat undangan pertama Anda" action={{ label: "Buat", href: "/dashboard/invitations/new" }} />);
    expect(screen.getByText("Belum ada undangan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buat" })).toHaveAttribute("href", "/dashboard/invitations/new");
  });

  it("Logo menampilkan nama brand NUVAKARA", () => {
    render(<Logo />);
    expect(screen.getByText("NUVAKARA")).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Implementasikan komponen sisanya**

- `Toast.tsx` — `"use client"`, context + `AnimatePresence`, auto-dismiss 4s, `role="status"` (error → `role="alert"`), tombol tutup.
- `Skeleton.tsx` — shimmer via CSS `animate-pulse` + `motion-safe:` guard.
- `EmptyState.tsx` — server-safe, menerima `action?: { label: string; href: string }`.
- `Badge.tsx`, `Card.tsx`, `Container.tsx`, `SectionHeading.tsx`.
- `Logo.tsx` — `next/image` untuk `public/brand/nuvakara-mark.png` dengan `alt=""` (dekoratif) + teks wordmark `NUVAKARA` dalam `font-display` + `tracking-[0.2em]`; menerima `variant?: "light"|"dark"` untuk warna teks.

- [ ] **Step 10: Run test untuk memastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 11: Typecheck & lint, lalu commit**

```bash
npm run typecheck && npm run lint
git add src/components/ui tests/components/ui
git commit -m "feat: reusable UI primitives"
```

---

## Task 3: Sistem Animasi

> **Catatan eksekusi (13 Nov 2026):** task ini dieksekusi dengan **GSAP 3.15**, bukan Motion seperti tertulis di bawah — lihat bagian `Global Constraints` dan ledger Phase 1 untuk alasan dan keputusannya. Langkah di bawah mempertahankan rancangan awal sebagai rujukan.

**Files:**
- Create: `src/components/motion/{Reveal,TextReveal,Parallax,Counter,FloatingDecor,GradientOrb,Stagger,PageTransition,MagneticButton,GradientText,index}.tsx`
- Create: `src/app/template.tsx`
- Test: `tests/components/motion/*.test.tsx`

**Interfaces:**
- Produces:
  - `<Reveal delay?: number; y?: number; once?: boolean; as?: "div"|"section"|"span"; className?; children>` — animasi masuk viewport.
  - `<TextReveal text: string; as?: "h1"|"h2"|"p"; delay?: number; className?>` — split per kata, stagger.
  - `<Parallax speed?: number; className?>` — translateY berbasis scroll.
  - `<Counter to: number; durationMs?: number; suffix?: string; prefix?: string; className?>` — menghitung naik saat masuk viewport.
  - `<FloatingDecor className?; delay?: number; amplitude?: number>` — ornament melayang.
  - `<GradientOrb className?; color?: "gold"|"champagne"|"blush"|"sage">` — blob gradien.
  - `<Stagger children; delay?: number; gap?: number>` — container stagger.
  - `<PageTransition children>` — wrapper transisi halaman.
  - `<MagneticButton strength?: number>` — membungkus Button; tombol bergerak ke arah cursor (desktop saja).
  - `<GradientText children; className?>` — teks dengan gradient emas.

- [ ] **Step 1: Install & verifikasi import Motion**

Run: `node -e "import('gsap').then(m=>console.log('gsap', Object.keys(m).length))"`
Expected: `gsap <n>` — GSAP + `@gsap/react` terpasang, `motion` sudah dilepas dari `package.json`.

- [ ] **Step 2: Write failing test — Reveal & Counter**

Buat `tests/components/motion/Reveal.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";

describe("motion primitives", () => {
  it("Reveal merender children secara utuh (konten tidak boleh hilang)", () => {
    render(<Reveal>JudulUndangan</Reveal>);
    expect(screen.getByText("Judul Undangan")).toBeVisible();
  });

  it("Counter menampilkan nilai akhir", () => {
    render(<Counter to={1250} suffix="+"/>);
    expect(screen.getByText(/1\.250|\+/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implementasikan Reveal, Counter, dan-motion lain**

- Semua komponen `"use client"`.
- `Reveal`: `const reduce = useReducedMotion(); const visible = reduce === true;` → `initial={reduce ? false : { opacity: 0, y }}` dan `whileInView={{ opacity: 1, y: 0 }}` dengan `viewport={{ once: true, margin: "-80px" }}` dan `transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}`.
  > Wajib: `once` di dalam `viewport`, bukan prop top-level.
- `Counter`: `useInView` + `requestAnimationFrame` untuk menghitung dari 0 → `to`; bila `useReducedMotion() === true` tampilkan nilai akhir langsung.
- `TextReveal`: pecah `text` per kata, render `<span className="inline-block">` per kata dengan `motion.span` stagger 0.04s, `aria-label={text}` pada wrapper agar screen reader membaca utuh.
- `Parallax`: `useScroll({ target: ref, offset: ["start end", "end start"] })` + `useTransform(scrollYProgress, [0, 1], [distance, -distance])`; `distance = speed * 100`; nonaktif bila `useReducedMotion()` true atau lebar viewport < 768 (pakai `useMediaQuery` custom hook `window.matchMedia`).
- `FloatingDecor`: `motion.div` dengan `animate={{ y: [0, -amplitude, 0] }}`, `transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}`; `useReducedMotion()` → tanpa animasi.
- `GradientOrb`: `div` dengan `background: radial-gradient(...)`, `filter: blur(60px)`, `aria-hidden`, animasi lewat CSS `@keyframes` di `globals.css` (bukan JS) agar ringan.
- `Stagger`: `motion.div` `variants={{ show: { transition: { staggerChildren: gap } } }}` + children `motion.div` `variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}`.
- `PageTransition`: `"use client"`, `motion.div` `initial={{ opacity: 0, y: 8 }}` `animate={{ opacity: 1, y: 0 }}` `transition={{ duration: 0.25 }}`; `useReducedMotion()` → tanpa offset.
- `MagneticButton`: `"use client"`, `useMotionValue` + `useSpring` untuk `x`/`y`; pointer events dinonaktifkan di touch (`pointerType !== "mouse"`).
- `GradientText`: `span` dengan `bg-clip-text text-transparent` + gradient `from-gold via-gold-light to-champagne`.

- [ ] **Step 4: Buat `src/app/template.tsx`**

Wrapper `PageTransition` di root app agar tiap navigasi fade+slide halus.

- [ ] **Step 5: Write failing test — reduced motion**

Buat `tests/components/motion/reduced-motion.test.tsx`:
```tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

describe("prefers-reduced-motion", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("konten tetap terlihat tanpa animasi", () => {
    render(<Reveal>Isi penting</Reveal>);
    expect(screen.getByText("Isi penting")).toBeVisible();
  });
});
```

- [ ] **Step 6: Run test untuk memastikan lulus**

Run: `npm test`
Expected: PASS (semua test motion hijau).

- [ ] **Step 7: Typecheck & lint, lalu commit**

```bash
npm run typecheck && npm run lint
git add src/components/motion src/app/template.tsx tests/components/motion
git commit -m "feat: motion system with reduced-motion support"
```

---

## Task 4: Section Marketing

**Files:**
- Create: `src/components/marketing/{Navbar,Hero,Features,TemplateShowcase,HowItWorks,Pricing,Footer,CtaBanner}.tsx`
- Create: `src/lib/templates-preview.ts` (data preview 4 template, statis untuk Phase 1)
- Test: `tests/components/marketing/*.test.tsx`

**Interfaces:**
- Consumes: `siteConfig`, komponen `ui` & `motion` dari Task 1–3.
- Produces:
  - `<Navbar />` — fixed, transparan di atas hero, solid setelah scroll (`useEffect` + `scrollY > 24`), menu mobile (drawer) dengan tombol toggle ber-aria, link ke section via anchor `#fitur` dll.
  - `<Hero />` — headline, subheadline, 2 CTA (`/daftar` dan `/#template`), floating invitation cards, animated gradient background.
  - `<Features />` — 10 kartu glassmorphism dari `siteConfig.features`.
  - `<TemplateShowcase templates={TemplatePreview[]}/>` — 4 kartu preview (Wedding Classic, Birthday Celebration, Baby Shower, Graduation Modern) dengan tombol Preview & Gunakan Template.
  - `<HowItWorks />` — 5 langkah.
  - `<Pricing plans={Plan[]}/>` — bila `plans` kosong → empty state "Paket harga sedang disiapkan" (bukan harga palsu).
  - `<Footer />` — logo, nav, kontak, sosial, Privacy Policy, Terms of Service.
  - `<CtaBanner />` — CTA penutup.

- [ ] **Step 1: Write failing test — Navbar**

Buat `tests/components/marketing/Navbar.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/marketing/Navbar";

describe("Navbar", () => {
  it("menampilkan link navigasi utama dan CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Fitur" })).toHaveAttribute("href", "/#fitur");
    expect(screen.getByRole("link", { name: "Buat Undangan" })).toBeInTheDocument();
  });

  it("membuka dan menutup menu mobile", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    await userEvent.click(toggle);
    expect(screen.getByRole("dialog", { name: /menu navigasi/i })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("memastikan target sentuh minimal 44px pada kontrol mobile", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle.className).toMatch(/min-h-11|min-w-11|h-11|w-11/);
    await userEvent.click(toggle);
    const close = screen.getByRole("button", { name: /tutup/i });
    expect(close.className).toMatch(/min-h-11|min-w-11|h-11|w-11/);
  });

  it("memberi aria-expanded pada tombol menu", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
```

- [ ] **Step 2: Implementasikan Navbar**

`"use client"`. `useState` untuk menu mobile & `scrolled`; `useEffect` listener `scroll` (passive) untuk set `scrolled`; drawer memakai `<div role="dialog" aria-label="Menu navigasi">`, tutup dengan Escape (listener `keydown`) dan tombol X; focus dikembalikan ke tombol toggle saat ditutup; body scroll lock saat drawer terbuka.

Spesifikasi mobile: toggle memakai ikon hamburger 44×44px (`aria-label="Buka menu"` / `aria-expanded`); drawer = sheet `h-dvh` full-width, isi bisa di-scroll, area atas berisi logo + tombol tutup 44×44px; setiap link menu `min-h-11` (target sentuh); CTA `Buat Undangan` full-width di mobile (`w-full`) dan `sm:w-auto`; fokus berpindah ke dalam drawer saat terbuka dan kembali ke toggle saat ditutup.

- [ ] **Step 3: Implementasikan Hero**

`"use client"` (karena animasi). Latar: dua `GradientOrb` + grid halus + `Reveal`. Headline `Create Beautiful Invitations for Your Special Moments.` dengan `TextReveal`; subheadline `Ubah momen spesial menjadi pengalaman digital yang tak terlupakan bersama Nuvakara.`; CTA `Mulai Sekarang` → `/daftar`, `Jelajahi Template` → `/#template`; 2–3 kartu undangan melayang (`FloatingDecor`) yang memakai `nuvakara-mark.png`.

- [ ] **Step 4: Write failing test — Features & Pricing**

Buat `tests/components/marketing/sections.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";

describe("Features", () => {
  it("merender 10 fitur dari konfigurasi brand", () => {
    render(<Features />);
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });

  it("judul panjang tidak membuat layout meledak", () => {
    render(<Features />);
    expect(screen.getByText("Berbagai template premium")).toBeInTheDocument();
  });
});

describe("Pricing", () => {
  it("menampilkan empty state, bukan harga palsu, saat belum ada paket", () => {
    render(<Pricing plans={[]} />);
    expect(screen.getByText(/paket harga sedang disiapkan/i)).toBeInTheDocument();
    expect(screen.queryByText(/Rp\s?0/)).toBeNull();
  });

  it("menampilkan paket yang diberikan", () => {
    render(<Pricing plans={[{ id: "free", name: "Gratis", price: 0, currency: "IDR", features: ["1 undangan"], maxInvitations: 1, isPremium: false }]} />);
    expect(screen.getByText("Gratis")).toBeInTheDocument();
    expect(screen.getByText("1 undangan")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Implementasikan Features, TemplateShowcase, HowItWorks, Pricing, Footer, CtaBanner**

- `Features`: `siteConfig.features.map` → `<article>` (role article otomatis dari `<article>`) dengan ikon (inline SVG dari `icon` string), judul `font-display`, deskripsi, glass card, `Reveal` dengan `Stagger`.
- `TemplateShowcase`: menerima `templates: TemplatePreview[]`; tiap kartu menampilkan mock visual mini (warna & tipografi sesuai template, **tidak** memakai screenshot), tombol `Preview` (→ `/template/[slug]`, Phase 4) dan `Gunakan Template` (→ `/daftar?template=<slug>`).
- `HowItWorks`: 5 langkah dengan angka besar, `Reveal` berurutan.
- `Pricing`: menerima `plans`; **bila kosong** tampilkan empty state jujur; bila berisi paket tampilkan kartu harga + label jelas "Pembayaran belum tersedia — paket langsung aktif" (tanpa tombol bayar palsu) + tombol `Pilih Paket` (aksi Phase 3).
- `Footer`: `Logo`, 3 grup nav, kontak, sosial, baris legal berisi link `/privasi` & `/ketentuan`, teks "© {tahun} NUVAKARA".
- `CtaBanner`: section navy dengan gradient + CTA ke `/daftar`.

- [ ] **Step 6: Run test untuk memastikan lulus**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Typecheck & lint, lalu commit**

```bash
npm run typecheck && npm run lint
git add src/components/marketing src/lib/templates-preview.ts tests/components/marketing
git commit -m "feat: marketing sections"
```

---

## Task 5: Landing Page & Halaman Publik

**Files:**
- Create: `src/app/page.tsx`, `src/app/fitur/page.tsx`, `src/app/template/page.tsx`, `src/app/harga/page.tsx`, `src/app/tentang/page.tsx`, `src/app/privasi/page.tsx`, `src/app/ketentuan/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`
- Test: `tests/unit/landing.test.tsx`

**Interfaces:**
- Consumes: seluruh komponen Task 4.
- Produces: route publik `/`, `/fitur`, `/template`, `/harga`, `/tentang`, `/privasi`, `/ketentuan`.

- [ ] **Step 1: Write failing test — komposisi landing**

Buat `tests/unit/landing.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const page = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");

describe("landing page", () => {
  it("memuat hero, fitur, template, how-it-works, harga, dan footer", () => {
    for (const component of ["Hero", "Features", "TemplateShowcase", "HowItWorks", "Pricing", "Footer"]) {
      expect(page).toContain(component);
    }
  });

  it("halaman harga tidak meng-hardcode harga (harus dari data)", () => {
    const harga = readFileSync(join(process.cwd(), "src/app/harga/page.tsx"), "utf8");
    expect(harga).not.toMatch(/Rp\s?\d/);
  });
});
```

- [ ] **Step 2: Implementasikan `src/app/page.tsx`**

Server Component. Urutan: `<Navbar />`, `<Hero />`, `<Features />` (id `fitur`), `<TemplateShowcase />` (id `template`), `<HowItWorks />`, `<Pricing plans={plans} />` (id `harga`), `<CtaBanner />`, `<Footer />` (id `tentang`).
`plans` diambil dari DAL (`getActivePlans()`); bila env Supabase belum ada atau query gagal → `[]` (empty state jujur, tanpa error page).

- [ ] **Step 3: Implementasikan DAL minimal untuk landing**

Buat `src/lib/dal/pricing.ts`:
```ts
export type PlanRecord = { id: string; slug: string; name: string; description: string | null; price: number; currency: string; features: string[]; maxInvitations: number; isPremium: boolean };
export async function getActivePlans(): Promise<PlanRecord[]>
```
Implementasi: bila `!process.env.NEXT_PUBLIC_SUPABASE_URL` → `return []`. Bila pakai Supabase client → query `pricing_plans` dengan `is_active = true` order `sort_order`; bila error (tabel belum ada / RLS) → `console.warn` + `return []` (**tidak** melempar error).

Buat `src/lib/supabase/client.ts` — `createBrowserClient`/plain `createClient` dari `@supabase/supabase-js` memakai `NEXT_PUBLIC_SUPABASE_URL` + anon key; bila env kosong → ekspor `null` (dipakai DAL sebagai guard).

- [ ] **Step 4: Implementasikan halaman sekunder**

`/fitur` (daftar 10 fitur + CTA), `/template` (galeri 4 template), `/harga` (plans dari DAL + catatan "pembayaran segera hadir"), `/tentang` (tentang produk + CTA), `/privasi` & `/ketentuan` (teks kebijakan ringkas, ditulis sebagai konten nyata bukan placeholder lorem), `not-found.tsx` (404 premium), `error.tsx` (`"use client"`, tombol "Coba lagi").

- [ ] **Step 5: Jalankan dev server & verifikasi manual**

Run: `npm run dev` (background), buka `http:/localhost:3000`.
Expected: landing tampil; `/harga` menampilkan empty state (tabel belum ada) **tanpa** error; `/privasi` & `/ketentuan` berisi teks nyata.

- [ ] **Step 6: Cek responsif (mobile-first)**

Uji pada lebar 320px (iPhone SE), 375px, 390px, 430px, 768px, 1440px:
- Tidak ada scroll horizontal di lebar mana pun (`document.documentElement.scrollWidth <= clientWidth`).
- Navbar: link desktop tersembunyi di < 768px, tombol hamburger tampil, drawer bisa dibuka & ditutup.
- Hero: CTA `Mulai Sekarang` full-width di mobile, tidak terpotong teks.
- Grid fitur: 1 kolom di mobile, 2 di tablet, 3 di desktop — tidak ada card yang terpotong.
- Semua tombol/link yang bisa disentuh punya area ≥ 44×44px (periksa lewat DevTools box model pada 3 elemen utama: tombol menu, CTA hero, tombol footer).
- Gambar memakai `sizes` yang benar → di 375px, `vowara-mark.png` terunduh < 60KB (cek tab Network).

Expected: semua benar. Catat hasil aktual di checklist QA Task 6.

- [ ] **Step 6b: Cek performa mobile**

Run: `npm run build`, lalu `npm run start` dan ukur dengan DevTools (Network → Slow 3G, throttling 400kbps) pada `http:/localhost:3000`:
- LCP < 3 detik, First Contentful Paint < 1.8 detik.
- Tidak ada request gambar > 150KB di viewport 375px.
Expected: sesuai. Jika LCP gagal, culprit biasanya `next/image` tanpa `sizes` atau font yang memblokir render — perbaiki di task yang memiliki aset tersebut.

- [ ] **Step 7: Test, typecheck, lint, commit**

```bash
npm test && npm run typecheck && npm run lint
git add src/app src/lib/dal src/lib/supabase tests/unit/landing.test.tsx
git commit -m "feat: landing page and public routes"
```

---

## Task 6: QA Phase 1

**Files:**
- Create: `docs/superpowers/qa/phase1-checklist.md`

- [ ] **Step 1: Jalankan seluruh gate**

```bash
npm test && npm run typecheck && npm run lint && npm run build
```
Expected: semua exit 0. Catatan: `next build` **tidak** menjalankan ESLint → `npm run lint` wajib terpisah.

- [ ] **Step 2: Verifikasi aset brand**

Pastikan `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` ada dan `public/brand/*` ter-load (cek `<link rel="icon">` di HTML hasil build).

- [ ] **Step 3: Tulis checklist QA**

`docs/superpowers/qa/phase1-checklist.md` berisi tabel: item, expected, hasil (✓/✗), catatan — mencakup: 6 item Review Focus + navigasi keyboard + reduced motion + 320/375/390/430/768/1440px + target sentuh 44px + LCP di Slow 3G + empty state harga + konsol browser bersih.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/qa
git commit -m "docs: phase 1 QA checklist and results"
```

---

## Definition of Done (Phase 1)

- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` semuanya hijau.
- [ ] Landing page memuat semua section spec (navbar, hero, features, template showcase, how-it-works, pricing, footer) dengan animasi yang punya tujuan.
- [ ] Tidak ada harga, template, atau statistik palsu — data kosong tampil sebagai empty state jujur.
- [ ] `prefers-reduced-motion` disables seluruh animasi tanpa menyembunyikan konten.
- [ ] Tidak ada scroll horizontal di 320px–430px; drawer mobile berfungsi dengan keyboard; semua target sentuh ≥ 44×44px.
- [ ] LCP < 3 detik pada throttling Slow 3G di viewport 375px.
- [ ] Brand NUVAKARA konsisten (favicon, icon, logo, copy) dan tidak ada sisa branding VOWARA.
- [ ] Checklist QA terisi dengan hasil nyata (bukan asumsi).
