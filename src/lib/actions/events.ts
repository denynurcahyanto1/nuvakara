"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/dal/auth";
import { slugify } from "@/lib/utils";
import { eventInputToIsoString } from "@/lib/datetime";
import type { Database } from "@/types/database";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

function getEventData(formData: FormData): Partial<EventInsert> {
  return {
    name: formData.get("name") as string,
    slug: slugify(formData.get("slug") as string),
    description: (formData.get("description") as string) || null,
    is_published: false,
    is_active: true,
  };
}

export async function createEventAction(prevState: unknown, formData: FormData) {
  const profile = await requireUser();
  const supabase = await createClient();

  const eventData = getEventData(formData);

  const { data, error } = await supabase
    .from("events")
    .insert({
      name: eventData.name || "Undangan Baru",
      slug: eventData.slug || `event-${Date.now()}`,
      description: eventData.description,
      owner_id: profile.id,
      is_published: false,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
  redirect(`/dashboard/invitations/${data.id}/edit`);
}

export async function updateEventAction(id: number, formData: FormData) {
  const profile = await requireUser();
  const supabase = await createClient();

  // Verify ownership
  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!event || event.owner_id !== profile.id) {
    return { ok: false, error: "Tidak diizinkan" };
  }

  const updates: EventUpdate = {
    name: formData.get("name") as string,
    slug: slugify(formData.get("slug") as string),
    description: (formData.get("description") as string) || null,
    event_type: (formData.get("event_type") as string) || "wedding",
    host_name: (formData.get("host_name") as string) || null,
    partner_name: (formData.get("partner_name") as string) || null,
    event_date: eventInputToIsoString(formData.get("event_date") as string),
    venue_name: (formData.get("venue_name") as string) || null,
    venue_address: (formData.get("venue_address") as string) || null,
    city: (formData.get("city") as string) || null,
    maps_url: (formData.get("maps_url") as string) || null,
    music_url: (formData.get("music_url") as string) || null,
    cover_image: (formData.get("cover_image") as string) || null,
    template_slug: (formData.get("template_slug") as string) || "wedding-classic",
    is_published: formData.get("is_published") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");

  return { ok: true };
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!event || event.owner_id !== profile.id) {
    return;
  }

  // Soft delete
  await supabase
    .from("events")
    .update({ is_active: false })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
}

export async function publishEventAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!event || event.owner_id !== profile.id) {
    return;
  }

  await supabase
    .from("events")
    .update({ is_published: true })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
}

export async function unpublishEventAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!event || event.owner_id !== profile.id) {
    return;
  }

  await supabase
    .from("events")
    .update({ is_published: false })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
}

export async function duplicateEventAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const profile = await requireUser();
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event || event.owner_id !== profile.id) {
    return;
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      name: `${event.name} (Salinan)`,
      slug: `${event.slug}-copy-${Date.now()}`,
      description: event.description,
      owner_id: profile.id,
      is_published: false,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return;
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
  redirect(`/dashboard/invitations/${data.id}/edit`);
}