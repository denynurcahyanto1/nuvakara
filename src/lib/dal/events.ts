import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
type RSVP = Database["public"]["Tables"]["rsvps"]["Row"];
type RSVPInsert = Database["public"]["Tables"]["rsvps"]["Insert"];
type RSVPUpdate = Database["public"]["Tables"]["rsvps"]["Update"];
type GuestbookMessage = Database["public"]["Tables"]["guestbook_messages"]["Row"];
type GuestbookInsert = Database["public"]["Tables"]["guestbook_messages"]["Insert"];

/** Fetch a single event by its ID. */
export async function getEventById(id: number): Promise<Event | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

/** Fetch a single event by its unique slug. */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

/** Fetch all events owned by a specific user, newest first. */
export async function getEventsByOwner(ownerId: string): Promise<Event[]> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

/** Insert a new event. Returns the created row or null on error. */
export async function createEvent(event: EventInsert): Promise<Event | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) return null;
  return data;
}

/** Update an existing event by id. Returns the updated row or null on error. */
export async function updateEvent(
  id: number,
  updates: EventUpdate,
): Promise<Event | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data;
}

/** Delete an event by id. Returns true on success, false on error. */
export async function deleteEvent(id: number): Promise<boolean> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return false;
  }

  const { error } = await supabase.from("events").delete().eq("id", id);
  return !error;
}

/** Fetch all RSVPs for an event. */
export async function getRSVPs(eventId: number): Promise<RSVP[]> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return [];
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

/** Insert a new RSVP. Returns the created row or null on error. */
export async function createRSVP(rsvp: RSVPInsert): Promise<RSVP | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase.from("rsvps").insert(rsvp).select().single();
  if (error) return null;
  return data;
}

/** Update an existing RSVP. Returns the updated row or null on error. */
export async function updateRSVP(rsvpId: number, updates: RSVPUpdate): Promise<RSVP | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("rsvps")
    .update(updates)
    .eq("id", rsvpId)
    .select()
    .single();

  if (error) return null;
  return data;
}

/** Delete an RSVP. Returns true on success, false on error. */
export async function deleteRSVP(rsvpId: number): Promise<boolean> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return false;
  }

  const { error } = await supabase.from("rsvps").delete().eq("id", rsvpId);
  return !error;
}

/** Fetch all guestbook messages for an event. */
export async function getGuestbook(eventId: number): Promise<GuestbookMessage[]> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return [];
  }

  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

/** Insert a new guestbook message. Returns the created row or null on error. */
export async function createGuestbookMessage(
  message: GuestbookInsert,
): Promise<GuestbookMessage | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return null;
  }

  const { data, error } = await supabase
    .from("guestbook_messages")
    .insert(message)
    .select()
    .single();

  if (error) return null;
  return data;
}

/** Get total visitor count for an event. */
export async function getVisitorCount(eventId: number): Promise<number> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return 0;
  }

  const { count, error } = await supabase
    .from("event_visits")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) return 0;
  return count ?? 0;
}