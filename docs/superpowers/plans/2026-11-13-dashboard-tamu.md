# Dashboard Tamu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build dashboard for RSVP and guestbook management including moderation and analytics.

**Architecture:** Extend existing dashboard routes to include `/guests` for RSVP/moderation. Use server-side components for data fetching and client-side for interactive moderation actions.

**Tech Stack:** Next.js, Supabase, Tailwind CSS, Lucide Icons.

**Spec:** Dashboard Tamu implementation (RSVP management, moderation, analytics).

## Global Constraints
- Framework: Next.js 16.4.6.
- Styling: Tailwind v4.
- Database: Supabase.
- Mobile-first approach.

## Review Focus
- Unauthenticated access to dashboard: Ensure `middleware.ts` protects `/dashboard`.
- Rate limiting on public RSVP/Guestbook: Ensure `kv` or database-level throttling.
- Empty states: Ensure graceful UI for 0 guests.
- Moderation failure: Ensure messages correctly flag/delete.
- Analytics calculation: Ensure correct grouping of statuses (Hadir/Tidak/Pending).

---

### Task 1: RSVP & Guestbook Data Schema Check
**Files:**
- Modify: `src/lib/supabase.ts` (if needed)

**Interfaces:**
- Produces: Type definitions for `Guest` and `GuestbookEntry`.

- [ ] **Step 1: Verify database tables exist for `rsvps` and `guestbook`**
- [ ] **Step 2: Update TypeScript types in `src/types/database.ts`**
- [ ] **Step 3: Commit**

### Task 2: Dashboard Guest List UI
**Files:**
- Create: `src/app/dashboard/invitations/[id]/guests/page.tsx`
- Create: `src/components/dashboard/GuestTable.tsx`

**Interfaces:**
- Consumes: Supabase guest data.
- Produces: UI for displaying, sorting, filtering guests.

- [ ] **Step 1: Implement basic table layout**
- [ ] **Step 2: Connect data fetching (server-side)**
- [ ] **Step 3: Add status filters**
- [ ] **Step 4: Commit**

### Task 3: Moderation Actions
**Files:**
- Create: `src/components/dashboard/ModerationControls.tsx`

**Interfaces:**
- Consumes: Guest ID.
- Produces: `approve`, `delete`, `toggleStatus` actions.

- [ ] **Step 1: Implement `approve` action**
- [ ] **Step 2: Implement `delete` action**
- [ ] **Step 3: Implement `toggleStatus` (for RSVP updates)**
- [ ] **Step 4: Commit**

### Task 4: Analytics Component
**Files:**
- Create: `src/components/dashboard/StatsCard.tsx`

**Interfaces:**
- Consumes: Aggregated guest counts.

- [ ] **Step 1: Create StatsCard component**
- [ ] **Step 2: Implement calculation logic for summary stats**
- [ ] **Step 3: Commit**
