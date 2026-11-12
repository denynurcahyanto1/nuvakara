"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateProfileAction } from "@/lib/actions/profile";

const TIMEZONES = [
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
  { value: "Asia/Makassar", label: "Asia/Makassar (WITA)" },
  { value: "Asia/Jayapura", label: "Asia/Jayapura (WIT)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
];

export interface ProfileFormProps {
  profile: {
    fullName: string;
    phone: string;
    timezone: string;
    avatarUrl: string;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <AuthForm
      action={updateProfileAction}
      submitLabel="Simpan perubahan"
      successMessage="Profil berhasil disimpan."
    >
      {(fields) => (
        <>
          <Input
            name="fullName"
            label="Nama lengkap"
            autoComplete="name"
            defaultValue={profile.fullName}
            error={fields.fullName}
          />
          <Input
            name="phone"
            type="tel"
            label="Nomor telepon"
            autoComplete="tel"
            placeholder="0812 0000 0000"
            defaultValue={profile.phone}
            error={fields.phone}
          />
          <Select
            name="timezone"
            label="Zona waktu"
            options={TIMEZONES}
            defaultValue={profile.timezone || "Asia/Jakarta"}
            error={fields.timezone}
          />
          <Input
            name="avatarUrl"
            type="url"
            label="URL foto profil"
            hint="Tempel URL foto yang sudah diunggah ke penyimpanan proyek."
            placeholder="https://…"
            defaultValue={profile.avatarUrl}
            error={fields.avatarUrl}
          />
        </>
      )}
    </AuthForm>
  );
}
