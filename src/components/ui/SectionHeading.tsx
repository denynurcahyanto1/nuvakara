import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-2xl font-display text-3xl leading-tight text-navy sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-base text-muted">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
