"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export interface PasswordFieldProps {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
}

/**
 * Password input with a visibility toggle. The toggle is a real button with
 * `aria-pressed`, so it is usable with a keyboard and announced correctly.
 */
export function PasswordField({
  name,
  label,
  error,
  hint,
  autoComplete = "current-password",
  placeholder,
  defaultValue,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full rounded-xl border bg-white px-4 pr-14 text-base text-ink",
            "placeholder:text-muted/70",
            "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
            error ? "border-red-500" : "border-navy/15",
          )}
        />
        <button
          type="button"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-r-xl text-navy/50 transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
        >
          <Icon name={visible ? "eye-off" : "eye"} size={20} />
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
