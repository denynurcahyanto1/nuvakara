"use client";

import { useRef, type ReactNode } from "react";
import { and, gsap, motionQueries, useGSAP } from "./gsap";
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
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add(
      and(
        motionQueries.wide,
        motionQueries.pointerFine,
        motionQueries.animate,
      ),
      () => {
        // quickTo reuses a single tween instead of creating one per pointer move.
        const moveX = gsap.quickTo(target, "x", {
          duration: 0.4,
          ease: "power3",
        });
        const moveY = gsap.quickTo(target, "y", {
          duration: 0.4,
          ease: "power3",
        });

        function handlePointerMove(event: PointerEvent) {
          const bounds = target!.getBoundingClientRect();
          moveX(
            (event.clientX - bounds.left - bounds.width / 2) * strength * 0.1,
          );
          moveY(
            (event.clientY - bounds.top - bounds.height / 2) * strength * 0.1,
          );
        }

        function handlePointerLeave() {
          moveX(0);
          moveY(0);
        }

        target.addEventListener("pointermove", handlePointerMove);
        target.addEventListener("pointerleave", handlePointerLeave);

        return () => {
          target!.removeEventListener("pointermove", handlePointerMove);
          target!.removeEventListener("pointerleave", handlePointerLeave);
        };
      },
    );

    return () => mm.revert();
  }, { scope: ref });

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-full bg-gold px-8 text-lg font-medium text-navy",
        "shadow-[var(--shadow-glow)] transition-colors hover:bg-gold-light",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      {children}
    </button>
  );
}
