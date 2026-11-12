"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface StaggerProps {
  children: ReactNode;
  /** Delay between children in seconds. */
  gap?: number;
  className?: string;
}

/** Container that reveals its children one after another. */
export function Stagger({
  children,
  gap = 0.08,
  className,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduceMotion ? 0 : gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child variant used inside `Stagger`. */
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
