"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** Distance in pixels the element travels upward while entering. */
  y?: number;
  as?: "div" | "section" | "span" | "li";
  className?: string;
}

/**
 * Scroll reveal: fades and lifts its children into view once.
 * With reduced motion the content is rendered visible immediately.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component =
    as === "section"
      ? motion.section
      : as === "span"
        ? motion.span
        : as === "li"
          ? motion.li
          : motion.div;

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
