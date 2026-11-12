import { logoutAction } from "@/lib/actions/auth";

/**
 * Programmatic sign-out. The profile page and the dashboard use the server
 * action directly; this route exists for POSTs from anywhere else.
 */
export async function POST() {
  return logoutAction();
}
