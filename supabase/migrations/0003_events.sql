CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_visits (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can CRUD their own events" ON events
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public can SELECT published & active events" ON events
    FOR SELECT USING (is_published = TRUE AND is_active = TRUE);

CREATE OR REPLACE FUNCTION track_visit() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO event_visits (event_id, user_id) VALUES (NEW.id, auth.uid());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
