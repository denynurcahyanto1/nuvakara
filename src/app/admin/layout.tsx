import { requireAdmin } from "@/lib/dal/auth";

/**
 * Admin area. `requireAdmin()` verifies the role on the server — the browser
 * never decides who is an administrator.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <main className="flex-1">{children}</main>
    </div>
  );
}
