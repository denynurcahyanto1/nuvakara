# NUVAKARA — Phase 3: Event Management

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun core event management: skema database, dashboard overview, dan CRUD undangan.

**Architecture:** Database Supabase (Postgres RLS) + DAL (Data Access Layer) + Server Actions. Pengguna memiliki event-nya sendiri, diatur dengan RLS `owner_id`. Dashboard menampilkan statistik ringkas (statistik nyata).

**Tech Stack:** next 16.4.6, react 19.3, supabase/ssr, zod.

**Spec:** `docs/superpowers/specs/2026-11-12-nuvakara-design.md` (§6.3 events, §6.6 event_visits, §10.2 dashboard)

---

## Global Constraints

- **Next.js 16.4.6**: `params`/`searchParams` wajib `await`.
- **RBAC**: Owner-only untuk manajemen event (RLS `owner_id = auth.uid()`).
- **Data Integrity**: Soft delete (`is_active = false`), slug unik.
- **Form**: `useActionState` + Zod (server-side).
- **Mobile-first**: Dashboard sidebar → drawer.

## Review Focus

1. **Owner-only Access**: User hanya bisa melihat/edit event miliknya sendiri (RLS).
2. **Slug Collision**: Slug yang sudah diambil (atau dihapus) tidak bisa diambil orang lain.
3. **Statistik Akurat**: `event_visits` dihitung di server, deduped per hari+user.
4. **Invalid State**: Menghapus template dari katalog tidak merusak event yang memakainya (`on delete set null`).
5. **Form Validation**: Slug/judul kosong atau judul yang melampaui batas karakter ditolak server.

---

## Task 1: Schema & DAL Event

**Files:**
- Create: `supabase/migrations/0003_events.sql`
- Create: `src/lib/dal/events.ts`
- Test: `tests/unit/events-schema.test.ts`

- [ ] Step 1: Migration `0003_events.sql` (tabel `events`, `event_visits`, fungsi `track_visit`).
- [ ] Step 2: Apply migration (`node scripts/apply-migrations.mjs`).
- [ ] Step 3: Regenerate types (`node scripts/generate-types.mjs`).
- [ ] Step 4: Implement `src/lib/dal/events.ts` (getEvent, getEvents, createEvent, updateEvent).
- [ ] Step 5: Test.

---

## Task 2: Dashboard UI Overview

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/StatCard.tsx`

- [ ] Step 1: Implement `StatCard`.
- [ ] Step 2: Implement `DashboardPage` (overview: total, statistik).

---

## Task 3: CRUD Event

**Files:**
- Create: `src/app/dashboard/invitations/page.tsx` (list)
- Create: `src/app/dashboard/invitations/new/page.tsx` (create)
- Create: `src/lib/actions/events.ts`

- [ ] Step 1: Server Actions untuk `createEvent`, `updateEvent`.
- [ ] Step 2: UI list event.
- [ ] Step 3: UI form create event.
- [ ] Step 4: Test.
