# Task 1 Report: Database Schema & DAL

**Completed Steps:**
- [x] Create `supabase/migrations/0004_rsvp_guestbook.sql`: Added `rsvps` and `guestbook_messages` tables with RLS policies.
- [x] Apply migration using `node scripts/apply-migrations.mjs`.
- [x] Regenerate types with `node scripts/generate-types.mjs`.
- [x] Update `src/lib/dal/events.ts`: Added `getRSVPs`, `createRSVP`, `getGuestbook`, `createGuestbookMessage`.

**Status:**
- Migration successfully applied.
- Types updated.
- DAL functions implemented.
- Existing typecheck errors unrelated to this change are present and pending fix in other tasks.

**Verification:**
- `npm test tests/unit/events-dal.test.ts` passed.
