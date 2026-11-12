import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/** True when the email appears in the ADMIN_EMAILS environment variable. */
export function isAdminEmail(
  email: string | null | undefined,
  list: string | undefined,
): boolean {
  if (!email || !list) return false;

  const allowed = list
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.trim().toLowerCase());
}

/** The signed-in user, or null. */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * The caller's profile row. Row Level Security guarantees this is their own
 * row (or every row, when the caller is an admin).
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("[dal/auth] gagal memuat profil:", error.message);
    return null;
  }

  return data;
}

/**
 * Guarantees a signed-in, active user. Redirects to the login page when
 * signed out, and to a suspended notice when the account is suspended.
 */
export async function requireUser(): Promise<Profile> {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.status === "suspended") {
    redirect("/login?suspended=1");
  }

  return profile;
}

/** Guarantees an active administrator. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireUser();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}

/**
 * Promotes the profile to admin when its email is listed in ADMIN_EMAILS.
 *
 * Idempotent: the update only touches rows whose role is not already
 * 'admin', and the audit log is written only when a row actually changed.
 */
export async function ensureAdminRole(profile: Profile): Promise<Profile> {
  if (profile.role === "admin") return profile;
  if (!isAdminEmail(profile.email, process.env.ADMIN_EMAILS)) return profile;

  const admin = createAdminClient();
  if (!admin) return profile;

  const { data, error } = await admin
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", profile.id)
    .neq("role", "admin")
    .select("id");

  if (error) {
    console.warn("[dal/auth] gagal menaikkan peran admin:", error.message);
    return profile;
  }

  if (!data || data.length === 0) {
    return profile;
  }

  const { error: logError } = await admin.from("admin_activity_logs").insert({
    admin_id: profile.id,
    admin_email: profile.email,
    action: "user.promote",
    entity_type: "profile",
    entity_id: profile.id,
    metadata: { from: profile.role, to: "admin", source: "ADMIN_EMAILS" },
  });

  if (logError) {
    console.warn("[dal/auth] gagal menulis audit log:", logError.message);
  }

  return { ...profile, role: "admin" };
}
