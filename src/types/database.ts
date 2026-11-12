export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Hand-written subset of the database types.
 *
 * Phase 3 regenerates this file from the live Supabase project with
 * `supabase gen types typescript --db-url … --schema public`, which replaces
 * the `pricing_plans` entry below with the full schema.
 */
export interface Database {
  public: {
    Tables: {
      pricing_plans: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          price: number;
          currency: string;
          features: string[];
          max_invitations: number;
          allow_premium_templates: boolean;
          is_premium: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          price: number;
          currency?: string;
          features?: string[];
          max_invitations?: number;
          allow_premium_templates?: boolean;
          is_premium?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pricing_plans"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
