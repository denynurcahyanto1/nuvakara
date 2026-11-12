import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  name,
  className,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name ?? "textarea";
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={textareaId} className="text-sm font-medium text-navy">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full resize-y rounded-xl border bg-white px-4 py-3 text-base text-ink",
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
