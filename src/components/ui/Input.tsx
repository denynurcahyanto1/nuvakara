import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Text input with an always-visible label (never a placeholder-as-label),
 * optional hint, and an error message wired through aria-describedby.
 */
export function Input({
  label,
  error,
  hint,
  id,
  name,
  className,
  ...props
}: InputProps) {
  const inputId = id ?? name ?? "input";
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-navy">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-base text-ink",
          "placeholder:text-muted/70",
          "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
          error ? "border-red-500" : "border-navy/15",
          className,
        )}
        {...props}
      />
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
