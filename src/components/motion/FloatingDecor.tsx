"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export interface FloatingDecorProps {
  className?: string;
  delay?: number;
  /** Vertical travel in pixels. */
  amplitude?: number;
}

/** Decorative ornament that gently floats. Hidden from assistive technology. */
export function FloatingDecor({
  className,
  delay = 0,
  amplitude = 12,
}: FloatingDecorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      animate={
        reduceMotion
          ? undefined
          : { y: [0, -amplitude, 0], rotate: [0, 1.5, 0] }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 7, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}
