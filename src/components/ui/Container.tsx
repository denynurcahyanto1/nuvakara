import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Page-width wrapper with the mobile-first horizontal padding. */
export function Container({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children?: ReactNode }) {
  return (
    <div className={cn("container-page", className)} {...props}>
      {children}
    </div>
  );
}
