import { cn } from "@/lib/cn";

export type OrnamentVariant =
  | "floral"
  | "deco"
  | "arabesque"
  | "batik"
  | "pixel"
  | "hairline";

export interface OrnamentProps {
  variant?: OrnamentVariant;
  className?: string;
}

/**
 * Decorative divider. Pure SVG in `currentColor` so it picks up the template
 * accent through the surrounding text colour.
 */
export function Ornament({ variant = "hairline", className }: OrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={cn("h-6 w-40 text-[var(--inv-accent)]", className)}
    >
      {variant === "floral" ? (
        <>
          <path d="M2 16h52M146 16h52" strokeLinecap="round" />
          <path d="M100 5c-8 5-13 8-13 11s5 6 13 11c8-5 13-8 13-11S108 10 100 5Z" />
          <path d="M78 16c-6-6-14-6-18 0 4 6 12 6 18 0ZM122 16c6-6 14-6 18 0-4 6-12 6-18 0Z" />
          <path d="M70 11c-2-4-1-6 2-7M130 11c2-4 1-6-2-7" strokeLinecap="round" />
        </>
      ) : null}

      {variant === "deco" ? (
        <>
          <path d="M2 16h56M142 16h56" strokeLinecap="round" />
          <path d="M100 3 90 16l10 13 10-13L100 3Z" />
          <path d="M76 8l-8 8 8 8M124 8l8 8-8 8" />
          <path d="M88 16h24" strokeLinecap="round" />
        </>
      ) : null}

      {variant === "arabesque" ? (
        <>
          <path d="M2 16h44M154 16h44" strokeLinecap="round" />
          <path d="M100 3c-11 6-18 9-18 13s7 8 18 13c11-5 18-9 18-13S111 9 100 3Z" />
          <path d="M82 16c6-3 12-3 18 0 6-3 12-3 18 0" strokeLinecap="round" />
          <circle cx="100" cy="16" r="2" fill="currentColor" stroke="none" />
          <path d="M58 13c-4 2-4 4 0 6M142 13c4 2 4 4 0 6" strokeLinecap="round" />
        </>
      ) : null}

      {variant === "batik" ? (
        <>
          <path d="M2 16h50M148 16h50" strokeLinecap="round" />
          <circle cx="72" cy="16" r="7" />
          <circle cx="100" cy="16" r="7" />
          <circle cx="128" cy="16" r="7" />
          <circle cx="86" cy="9" r="4" />
          <circle cx="114" cy="23" r="4" />
        </>
      ) : null}

      {variant === "pixel" ? (
        <>
          <path d="M2 15h48M150 15h48" strokeLinecap="butt" strokeWidth="2" />
          <path d="M86 15h-6v-6h-6v-6h6v6h6M114 15h6v-6h6v-6h-6v6h-6" strokeWidth="2" />
          <path d="M94 21h12M100 15v12" strokeWidth="2" />
        </>
      ) : null}

      {variant === "hairline" ? (
        <>
          <path d="M2 16h78M120 16h78" strokeLinecap="round" />
          <circle cx="100" cy="16" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </svg>
  );
}
