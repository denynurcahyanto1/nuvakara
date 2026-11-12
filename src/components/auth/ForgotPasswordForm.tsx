"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { forgotPasswordAction } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  return (
    <AuthForm
      action={forgotPasswordAction}
      submitLabel="Kirim tautan pemulihan"
      successMessage="Jika email tersebut terdaftar, tautan pemulihan sudah dikirim. Silakan cek kotak masuk Anda."
    >
      {(fields) => (
        <Input
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="nama@email.com"
          error={fields.email}
        />
      )}
    </AuthForm>
  );
}
