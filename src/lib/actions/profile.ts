"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal/auth";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/lib/types";
import { profileSchema, fieldErrors } from "@/lib/validation/auth";

export async function updateProfileAction(
  _previous: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  // requireUser() also rejects suspended accounts.
  const profile = await requireUser();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    timezone: formData.get("timezone"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali data profil Anda.",
      fields: fieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      timezone: parsed.data.timezone,
      avatar_url: parsed.data.avatarUrl || null,
    })
    .eq("id", profile.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/profile");

  return { ok: true };
}
