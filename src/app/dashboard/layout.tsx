import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { requireUser } from "@/lib/dal/auth";

export const metadata: Metadata = {
  title: { default: "Dasbor", template: "%s | NUVAKARA" },
  robots: { index: false, follow: false },
};

/**
 * Every dashboard route passes through here, so the guard is written once.
 * `requireUser()` reads the profile from the database and redirects when the
 * visitor is signed out or suspended.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireUser();

  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <header className="border-b border-navy/10 bg-white/70 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo size={30} href="/dashboard" />
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center text-navy/75 transition-colors hover:text-navy"
            >
              {profile.full_name || profile.email}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
