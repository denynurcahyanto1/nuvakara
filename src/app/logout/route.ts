import { type NextRequest, NextResponse } from "next/server";
import { logoutAction } from "@/lib/actions/auth";

/**
 * Programmatic sign-out. The profile page and the dashboard use the server
 * action directly; this route exists for POSTs from anywhere else.
 */
export async function POST() {
  return logoutAction();
}

/**
 * Opening the URL directly should not dead-end on a 405, so a GET simply
 * returns home. Signing out requires the POST above (or the UI button) so a
 * stray link cannot end someone's session.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}
