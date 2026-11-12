import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

/**
 * Keeps the Supabase session fresh and bounces signed-out visitors away from
 * the protected areas.
 *
 * The matcher is deliberately narrow: this runs a network call on every
 * matched request, and Next.js also prefetches routes — matching everything
 * would tax every page of the site.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile"],
};
