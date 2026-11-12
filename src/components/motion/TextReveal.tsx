"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  className?: string;
}

/**
 * Word-by-word reveal. The full text is exposed once to screen readers
 * (`.sr-only`) while the animated words are hidden from them.
 */
export function TextReveal({
  text,
  as = "span",
  delay = 0,
  className,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.65,
                delay: delay + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
