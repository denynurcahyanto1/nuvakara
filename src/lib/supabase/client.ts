import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client (anon key only). Returns `null` when the project
 * is not configured, so the app can render honest empty states instead of
 * crashing.
 */
export function getBrowserClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  if (!client) {
    client = createBrowserClient<Database>(url, key);
  }
  return client;
}
