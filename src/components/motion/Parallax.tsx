"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ParallaxProps {
  children: ReactNode;
  /** Higher values move the layer further. */
  speed?: number;
  className?: string;
}

/**
 * Scroll-linked vertical drift. Disabled on small screens and when the user
 * asked for reduced motion, so mobile scrolling never feels hijacked.
 */
export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const distance = speed * 120;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={reduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
