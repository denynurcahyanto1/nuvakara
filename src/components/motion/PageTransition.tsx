"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface PageTransitionProps {
  children: ReactNode;
}

/** Fade + lift applied on route change. */
export function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
