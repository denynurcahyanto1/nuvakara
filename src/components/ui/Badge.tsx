import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "premium" | "success" | "danger" | "muted";

const variantClasses: Record<Variant, string> = {
  default: "bg-navy/8 text-navy",
  premium: "bg-gold/20 text-gold",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-red-100 text-red-800",
  muted: "bg-navy/5 text-muted",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
