"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordField } from "@/components/auth/PasswordField";
import { Input } from "@/components/ui/Input";
import { loginAction } from "@/lib/actions/auth";

export interface LoginFormProps {
  next?: string;
}

/**
 * Client form for signing in. The page stays a Server Component (it checks
 * the session); only the interactive part lives here, because a function
 * cannot be passed from a Server Component to a Client Component.
 */
export function LoginForm({ next = "" }: LoginFormProps) {
  return (
    <AuthForm action={loginAction} submitLabel="Masuk">
      {(fields) => (
        <>
          <input type="hidden" name="next" value={next} />
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
            autoComplete="current-password"
            error={fields.password}
          />
        </>
      )}
    </AuthForm>
  );
}
