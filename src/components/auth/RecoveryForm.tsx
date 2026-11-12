"use client";

import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordField } from "@/components/auth/PasswordField";
import { resetPasswordAction } from "@/lib/actions/auth";
import { getBrowserClient } from "@/lib/supabase/client";

/**
 * The recovery link carries the session in the URL. The browser client picks
 * it up and stores the session in a cookie; this component waits for that to
 * happen before enabling the form, so the server action is not called with a
 * stale session.
 */
export function RecoveryForm() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      const client = getBrowserClient();
      if (!client) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        await client.auth.getSession();
      } catch {
        // A missing or expired link: the form still renders, and the server
        // action reports the real error.
      }
      if (!cancelled) setReady(true);
    }

    prepare();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <p role="status" className="text-sm text-muted">
        Memproses tautan pemulihan…
      </p>
    );
  }

  return (
    <AuthForm action={resetPasswordAction} submitLabel="Simpan kata sandi baru">
      {(fields) => (
        <>
          <PasswordField
            name="password"
            label="Kata sandi baru"
            autoComplete="new-password"
            hint="Minimal 8 karakter, mengandung huruf dan angka."
            error={fields.password}
          />
          <PasswordField
            name="confirmPassword"
            label="Konfirmasi kata sandi baru"
            autoComplete="new-password"
            error={fields.confirmPassword}
          />
        </>
      )}
    </AuthForm>
  );
}
