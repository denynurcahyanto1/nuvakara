/** Shared UI-level types. Database-shaped records live in `lib/dal`. */

export interface Feature {
  id: string;
  title: string;
  description: string;
  /** Name of the inline SVG icon rendered by the marketing sections. */
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Plan {
  id: string;
  slug?: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  features: string[];
  maxInvitations: number;
  isPremium: boolean;
}

export interface TemplatePreview {
  slug: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
  /** Short label of the template's visual identity, e.g. "Ivory & Champagne". */
  palette: string;
}
