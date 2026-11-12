import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /**
   * "light" for light surfaces (navy title, deep gold eyebrow).
   * "dark" for dark surfaces such as the navy sections (ivory title, gold eyebrow).
   */
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  children,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.25em]",
            isDark ? "text-gold" : "text-gold-deep",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "max-w-2xl font-display text-3xl leading-tight sm:text-4xl",
          isDark ? "text-ivory" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-xl text-base",
            isDark ? "text-ivory/70" : "text-navy/70",
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
