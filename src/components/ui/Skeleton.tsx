import { cn } from "@/lib/cn";

/** Loading placeholder. Hidden from assistive technology on purpose. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-navy/8", className)}
    />
  );
}
