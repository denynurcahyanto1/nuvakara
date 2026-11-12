import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

/**
 * Fetch a single event by its unique slug.
 * Returns null when not found or on error.
 */
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

/**
 * Fetch all events owned by a specific user, newest first.
 */
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

/**
 * Insert a new event. Returns the created row or null on error.
 */
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

/**
 * Update an existing event by id. Returns the updated row or null on error.
 */
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

/**
 * Delete an event by id. Returns true on success, false on error.
 */
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
