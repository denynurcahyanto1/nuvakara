"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How far the button follows the cursor, in pixels. */
  strength?: number;
  onClick?: () => void;
}

/**
 * Button that drifts slightly towards the cursor on desktop.
 * Disabled for touch pointers and reduced-motion users.
 */
export function MagneticButton({
  children,
  className,
  strength = 8,
  onClick,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength * 0.1);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength * 0.1);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-full bg-gold px-8 text-lg font-medium text-navy",
        "shadow-[var(--shadow-glow)] transition-colors hover:bg-gold-light",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
