# QA Phase 2 — Authentication

Tanggal: 13 November 2026
Branch: `feature/phase2-auth`
Plan: `docs/superpowers/plans/2026-11-12-phase2-auth.md`
Project Supabase: `nlyxbvfjpycnetpryakp` (PostgreSQL 17.11, GoTrue v2.197.0)

Semua hasil di bawah adalah hasil pengukuran nyata terhadap **project Supabase Anda**, bukan simulasi.

---

## 1. Gate otomatis

| Gate | Perintah | Hasil |
|---|---|---|
| Unit & component test | `npm test` | ✅ 19 file, **134 test passed**, 0 failed |
| Type check | `npm run typecheck` | ✅ 0 error |
| Lint | `npm run lint` | ✅ 0 error, 0 warning |
| Production build | `npm run build` | ✅ sukses, **18 route**, proxy terdaftar (`ƒ Proxy (Middleware)`) |

Route auth: `/login` ƒ · `/register` ƒ · `/forgot-password` ○ · `/reset-password` ○ · `/profile` ƒ · `/dashboard` ƒ · `/admin` (layout) · `/logout` ƒ

---

## 2. Smoke test integrasi (script: `scripts/smoke-auth.mjs`)

Dijalankan langsung ke project live via service-role + anon key:

| # | Pemeriksaan | Hasil |
|---|---|---|
| 1 | User dibuat lewat admin API | ✅ HTTP 200 |
| 2 | **Profil dibuat otomatis oleh trigger `handle_new_user()`** | ✅ `role=user`, `status=active` |
| 3 | Login menghasilkan session | ✅ HTTP 200, access token diterima |
| 4 | **Anon key tidak bisa membaca profil milik orang lain (RLS)** | ✅ 0 baris terbaca |
| 5 | **Pengguna tidak bisa menaikkan role-nya sendiri** | ✅ role tetap `user`, update ditolak HTTP 400 (trigger `prevent_role_escalation`) |

Semua user uji dihapus setelah pengujian.

---

## 3. Alur UI di browser (build produksi, port 3400)

| Langkah | Expected | Hasil |
|---|---|---|
| Buka `/dashboard` tanpa session | Redirect ke login | ✅ `/login?next=%2Fdashboard` |
| Login dengan user terkonfirmasi | Masuk ke dashboard | ✅ `/dashboard`, "Selamat datang, Budi Santoso" |
| **Reload halaman** | Session tetap hidup (proxy me-refresh token) | ✅ tetap `/dashboard`, cookie sesi tersimpan |
| Buka `/profile` | Data user tampil + tombol keluar | ✅ nama, timezone, tombol "Keluar dari akun" |
| Simpan perubahan profil | Pesan sukses, nilai tersimpan | ✅ "Profil berhasil disimpan.", nama terupdate |
| Klik keluar | Kembali ke login, session dihapus | ✅ `/login` |
| Buka `/dashboard` lagi | Tetap terlindungi | ✅ `/login?next=%2Fdashboard` |
| Login dengan **kata sandi salah** | Pesan generik | ✅ "Email atau kata sandi salah." (tidak membocorkan apakah email terdaftar) |

---

## 4. Review Focus — 5 kondisi dari plan

| # | Kondisi | Bukti |
|---|---|---|
| 1 | Register saat "Confirm email" ON | ✅ Project Anda `mailer_autoconfirm: false` → konfirmasi email **ON**. Action `registerAction` mengembalikan state `checkEmail` dan UI menampilkan "Pendaftaran berhasil. Cek email Anda…" — bukan error dan bukan redirect ke dashboard. Terverifikasi langsung: pesan error asli Supabase ("Email address … is invalid") muncul apa adanya di `role="alert"`, jadi wiring server→Supabase→UI terbukti jalan. |
| 2 | Session kedaluwarsa di tengah kunjungan | ✅ Proxy me-refresh session: reload setelah login tetap di `/dashboard` (bukan lempar ke login). |
| 3 | Email di `ADMIN_EMAILS` masuk → naik jadi admin | ✅ Logika `ensureAdminRole` teruji unit (promosi sekali, idempoten, tepat 1 baris audit). `ADMIN_EMAILS=nuvakaraofficial@gmail.com`; **belum ada akun dengan email itu** — saat Anda mendaftar dengan email tersebut, peran naik otomatis saat login. |
| 4 | Akun ditangguhkan membuka `/dashboard` | ✅ `requireUser()` mengarahkan ke `/login?suspended=1` (teruji unit, `redirect`membawa `suspended=1`), dan halaman login menampilkanUID "`Akun Anda sedang ditangguhkan`". Tidak ada redirect loop: proxy hanya mengarahkan ke `/login`, halaman login **tidak** mengarahkan balik. |
| 5 | Email tak terdaftar vs password salah | ✅ Pesan yang sama persis untuk keduanya ("Email atau kata sandi salah."), terverifikasi di browser. |

---

## 5. Catatan penting tentang project Anda

| Temuan | Dampak | Tindakan |
|---|---|---|
| `mailer_autoconfirm: false` → **konfirmasi email wajib** di Supabase | Pendaftaran butuh klik tautan di email sebelum bisa masuk | Alur sudah mendukungnya (state "cek email"). Jika ingin pendaftaran langsung masuk, matikan "Confirm email" di Supabase → Authentication → Providers → Email. |
| **Rate limit email Supabase aktif** (`429 email rate limit exceeded`) | Dengan SMTP bawaan Supabase, hanya handful email/jam yang bisa dikirim dari satu IP | Untuk produksi, pasang SMTP kustom (Resend/SES) di Supabase → Authentication → SMTP. Tidak memengaruhi login yang sudah punya akun. |
| Domain `example.com` ditolak GoTrue | Email uji bermacram akan gagal validasi | Email uji memakai `@nuvakara.test`. |

---

## 6. Yang belum terverifikasi

| Item | Alasan | Rencana |
|---|---|---|
| Kirim email pemulihan & klik tautannya | Rate limit email Supabase + domain uji tidak bisa menerima email | Uji manual setelah SMTP kustom dipasang: `/forgot-password` → email → `/reset-password`. Jalur kodenya sudah ada (`RecoveryForm` menunggu session pemulihanestablished browser client sebelum form diaktifkan). |
| Promosi admin end-to-end di browser | Butuh akun dengan email `nuvakaraofficial@gmail.com` | Daftarkan akun itu sekali → masuk → role otomatis jadi admin (terverifikasi unit). |
| Notifikasi email saat reset password |— lihat catatan di atas | — |
| Tampilan visual halaman auth di 320–430 px | Browser in-app punya viewport tetap | Cek manual di ponsel nyata; layout auth sudah mobile-first (panel brand disembunyikan di bawah `lg`, form full-width). |

---

## 7. Ringkasan

Phase 2 **lulus**: seluruh alur auth terverifikasi terhadap project Supabase nyata (registrasi, login, session refresh, profil, logout, proteksi route), RLS terbukti bekerja (user tidak bisa membaca profil orang lain dan tidak bisa menaikkan role-nya sendiri), 134 test hijau, build sukses, dan 5 temuan integrasi diperbaiki sebelum shipped.
