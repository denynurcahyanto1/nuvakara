import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";

export interface LogoProps {
  href?: string;
  /** Rendered height of the monogram in pixels. */
  size?: number;
  /** "light" for dark backgrounds, "dark" for light backgrounds. */
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Brand lockup used across the app: the gold N monogram plus the wordmark.
 * The monogram is gold on transparent so it stays legible on both light
 * and dark surfaces (the full lockup image is reserved for light sections).
 */
export function Logo({
  href = "/",
  size = 36,
  variant = "dark",
  className,
}: LogoProps) {
  const height = Math.round(size * (450 / 512));

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/nuvakara-mark.png"
        alt=""
        width={size}
        height={height}
        className="h-auto w-auto shrink-0"
      />
      <span
        className={cn(
          "font-display text-lg leading-none tracking-[0.2em]",
          variant === "light" ? "text-ivory" : "text-navy",
        )}
      >
        {siteConfig.name}
      </span>
    </span>
  );

  return (
    <Link href={href} className="inline-flex min-h-11 items-center rounded-md">
      {content}
    </Link>
  );
}
