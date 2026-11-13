# RSVP & Guestbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement guest interaction features (RSVP and Guestbook) on public invitation pages.

**Architecture:** New Postgres tables for `rsvps` and `guestbook_messages` with RLS. Server actions handle submissions with spam protection (rate limiting/honeypot).

**Tech Stack:** Next.js 16.4.6, Supabase, Tailwind, Zod.

---

## Task 1: Database Schema & DAL

**Files:**
- Create: `supabase/migrations/0004_rsvp_guestbook.sql`
- Modify: `src/lib/dal/events.ts`

- [ ] Step 1: Migration for `rsvps` (event_id, name, attendance, message) and `guestbook_messages` (event_id, name, content).
- [ ] Step 2: RLS Policies (Public INSERT, Owner SELECT/DELETE).
- [ ] Step 3: DAL functions for `getRSVPs`, `createRSVP`, `getGuestbook`, `createGuestbookMessage`.

## Task 2: RSVP & Guestbook Components

**Files:**
- Create: `src/components/templates/shared/RSVPForm.tsx`
- Create: `src/components/templates/shared/Guestbook.tsx`

- [ ] Step 1: Implement `RSVPForm`.
- [ ] Step 2: Implement `Guestbook`.
- [ ] Step 3: Integrate into `/invite/[slug]/page.tsx`.
