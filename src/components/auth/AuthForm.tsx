"use client";

import { useActionState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AuthActionState } from "@/lib/types";

export interface AuthFormProps {
  action: (
    previous: AuthActionState | null,
    formData: FormData,
  ) => Promise<AuthActionState>;
  submitLabel: string;
  children: ReactNode | ((fields: Record<string, string>) => ReactNode);
  /** Shown when the action succeeds (e.g. "check your email"). */
  successMessage?: string;
  className?: string;
}

/**
 * Form shell for the auth pages: renders the server-action state, keeps the
 * submit button in a pending state, and hands per-field errors to the
 * children so each field can show its own message.
 */
export function AuthForm({
  action,
  submitLabel,
  children,
  successMessage,
  className,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState<
    AuthActionState | null,
    FormData
  >(action, null);

  const fields = state && !state.ok ? (state.fields ?? {}) : {};
  const succeeded = state?.ok === true;

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)}>
      {state && !state.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      {succeeded ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          {state.checkEmail
            ? "Pendaftaran berhasil. Cek email Anda untuk mengonfirmasi akun, lalu masuk."
            : successMessage}
        </p>
      ) : null}

      {typeof children === "function" ? children(fields) : children}

      <Button type="submit" size="lg" isLoading={pending} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
