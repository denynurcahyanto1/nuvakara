import { getServerClient } from "@/lib/supabase/server";

/** A pricing plan exactly as it is stored in Postgres. */
export interface PlanRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  max_invitations: number;
  is_premium: boolean;
}

/**
 * Active pricing plans, ordered for display.
 *
 * Never throws: when Supabase is not configured, or when the table does not
 * exist yet (migrations not applied), it returns an empty list so the page
 * can render an honest empty state instead of a fake price.
 */
export async function getActivePlans(): Promise<PlanRecord[]> {
  const supabase = getServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pricing_plans")
    .select(
      "id, slug, name, description, price, currency, features, max_invitations, is_premium",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("[dal/pricing] gagal memuat paket harga:", error.message);
    return [];
  }

  return data ?? [];
}
