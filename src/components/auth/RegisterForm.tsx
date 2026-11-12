"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordField } from "@/components/auth/PasswordField";
import { Input } from "@/components/ui/Input";
import { registerAction } from "@/lib/actions/auth";

export interface RegisterFormProps {
  next?: string;
}

export function RegisterForm({ next = "" }: RegisterFormProps) {
  return (
    <AuthForm action={registerAction} submitLabel="Daftar">
      {(fields) => (
        <>
          <input type="hidden" name="next" value={next} />
          <Input
            name="fullName"
            label="Nama lengkap"
            autoComplete="name"
            placeholder="Nama Anda"
            error={fields.fullName}
          />
          <Input
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="nama@email.com"
            error={fields.email}
          />
          <PasswordField
            name="password"
            label="Kata sandi"
            autoComplete="new-password"
            hint="Minimal 8 karakter, mengandung huruf dan angka."
            error={fields.password}
          />
          <PasswordField
            name="confirmPassword"
            label="Konfirmasi kata sandi"
            autoComplete="new-password"
            error={fields.confirmPassword}
          />
        </>
      )}
    </AuthForm>
  );
}
