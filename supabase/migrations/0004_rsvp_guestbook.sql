CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    attendance BOOLEAN NOT NULL DEFAULT TRUE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guestbook_messages (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;

-- RSVP Policies
CREATE POLICY "Public can INSERT rsvps" ON rsvps
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Owners can SELECT rsvps" ON rsvps
    FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE events.id = rsvps.event_id AND events.owner_id = auth.uid()));

CREATE POLICY "Owners can DELETE rsvps" ON rsvps
    FOR DELETE USING (EXISTS (SELECT 1 FROM events WHERE events.id = rsvps.event_id AND events.owner_id = auth.uid()));

-- Guestbook Policies
CREATE POLICY "Public can INSERT guestbook_messages" ON guestbook_messages
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Owners can SELECT guestbook_messages" ON guestbook_messages
    FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE events.id = guestbook_messages.event_id AND events.owner_id = auth.uid()));

CREATE POLICY "Owners can DELETE guestbook_messages" ON guestbook_messages
    FOR DELETE USING (EXISTS (SELECT 1 FROM events WHERE events.id = guestbook_messages.event_id AND events.owner_id = auth.uid()));
