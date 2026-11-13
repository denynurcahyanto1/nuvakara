import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { logoutAction } from "@/lib/actions/auth";
import { requireUser } from "@/lib/dal/auth";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola data akun NUVAKARA Anda.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const profile = await requireUser();

  if (!profile) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
          Akun
        </p>
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Profil Saya</h1>
        <p className="text-sm text-muted">
          Masuk sebagai <span className="text-navy">{profile.email}</span>
        </p>
      </header>

      <ProfileForm
        profile={{
          fullName: profile.full_name ?? "",
          phone: profile.phone ?? "",
          timezone: profile.timezone,
          avatarUrl: profile.avatar_url ?? "",
        }}
      />

      <form action={logoutAction} className="border-t border-navy/10 pt-6">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-full border border-navy/15 px-5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
        >
          Keluar dari akun
        </button>
      </form>
    </main>
  );
}
