-- Guestbook messages must be readable by guests. Until now only the event
-- owner could SELECT, so guests always saw an empty book on a published
-- invitation.
create policy "Public can SELECT guestbook messages of published events"
    on public.guestbook_messages
    for select
    using (
        exists (
            select 1
            from public.events e
            where e.id = guestbook_messages.event_id
              and e.is_published
              and e.is_active
        )
    );

-- Harden the public write policies: the anon key is public, so a direct REST
-- call must not be able to write to draft or archived events.
drop policy if exists "Public can INSERT rsvps" on public.rsvps;
create policy "Public can INSERT rsvps for published events"
    on public.rsvps
    for insert
    with check (
        exists (
            select 1
            from public.events e
            where e.id = rsvps.event_id
              and e.is_published
              and e.is_active
        )
    );

drop policy if exists "Public can INSERT guestbook_messages" on public.guestbook_messages;
create policy "Public can INSERT guestbook messages for published events"
    on public.guestbook_messages
    for insert
    with check (
        exists (
            select 1
            from public.events e
            where e.id = guestbook_messages.event_id
              and e.is_published
              and e.is_active
        )
    );
