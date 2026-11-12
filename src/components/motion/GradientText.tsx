import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

/** Text filled with the brand gold gradient. */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-gold via-gold-light to-champagne bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
