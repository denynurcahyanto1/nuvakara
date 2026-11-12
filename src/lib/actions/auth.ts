"use server";

import { redirect } from "next/navigation";
import { getProfile, ensureAdminRole } from "@/lib/dal/auth";
import { createClient } from "@/lib/supabase/server";
import {
  fieldErrors,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import type { AuthActionState } from "@/lib/types";
import { safeNextPath } from "@/lib/utils";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function registerAction(
  _previous: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali data yang Anda masukkan.",
      fields: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { fullName, email, password } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // No session means the project requires email confirmation: tell the
  // visitor to check their inbox instead of pretending they are signed in.
  if (!data.session) {
    return { ok: true, checkEmail: true };
  }

  const profile = await getProfile();
  if (profile) {
    await ensureAdminRole(profile);
  }

  redirect(safeNextPath(formData.get("next") as string | null) ?? "/dashboard");
}

export async function loginAction(
  _previous: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Masukkan email dan kata sandi yang valid.",
      fields: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // The same message for an unknown email and a wrong password, so the
    // form cannot be used to find out which addresses are registered.
    return { ok: false, error: "Email atau kata sandi salah." };
  }

  const profile = await getProfile();
  if (profile) {
    await ensureAdminRole(profile);
    if (profile.role === "admin") {
      redirect("/admin");
    }
  }

  redirect(safeNextPath(formData.get("next") as string | null) ?? "/dashboard");
}

export async function forgotPasswordAction(
  _previous: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Masukkan alamat email yang valid.",
      fields: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/reset-password`,
  });

  // Always the same answer: whether the address exists is not disclosed.
  return { ok: true };
}

export async function resetPasswordAction(
  _previous: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali kata sandi baru Anda.",
      fields: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  redirect("/login?reset=1");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
