import { z } from "zod";

/** Email is trimmed and lowercased before validation. */
export const emailSchema = z
  .string({ error: "Email wajib diisi." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Format email tidak valid."));

/**
 * Password rules for accounts: at least 8 characters, with a letter and a
 * digit. Length alone is not enough to survive a credential-stuffing list.
 */
export const passwordSchema = z
  .string({ error: "Kata sandi wajib diisi." })
  .min(8, "Kata sandi minimal 8 karakter.")
  .regex(/[A-Za-z]/, "Kata sandi harus mengandung huruf.")
  .regex(/[0-9]/, "Kata sandi harus mengandung angka.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Kata sandi wajib diisi." }).min(1, "Kata sandi wajib diisi."),
});

export const registerSchema = z
  .object({
    fullName: z
      .string({ error: "Nama wajib diisi." })
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(80, "Nama terlalu panjang."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string({ error: "Konfirmasi kata sandi wajib diisi." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string({ error: "Konfirmasi kata sandi wajib diisi." }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

/** Flattens a Zod error into `{ field: message }` for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) {
      fields[key] = issue.message;
    }
  }

  return fields;
}
