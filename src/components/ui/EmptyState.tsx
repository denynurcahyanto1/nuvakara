import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; href: string };
  className?: string;
}

/**
 * Honest empty state: says what is missing instead of faking content.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-navy/15 bg-white/60 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? <div className="text-gold">{icon}</div> : null}
      <h3 className="font-display text-xl text-navy">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-medium text-navy transition-colors hover:bg-gold-light"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
