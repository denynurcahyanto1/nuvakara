import { cn } from "@/lib/cn";

export interface SectionLabelProps {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Small-caps eyebrow with a hairline, used above every invitation section. */
export function SectionLabel({ children, align = "center", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-[var(--inv-accent)]",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-7 bg-current opacity-60" />
      <span>{children}</span>
      {align === "center" ? (
        <span aria-hidden="true" className="h-px w-7 bg-current opacity-60" />
      ) : null}
    </p>
  );
}
