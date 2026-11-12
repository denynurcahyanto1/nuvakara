"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQueries, useGSAP } from "./gsap";

export interface FloatingDecorProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in pixels. */
  amplitude?: number;
}

/** Decorative ornament that gently floats. Hidden from assistive technology. */
export function FloatingDecor({
  children,
  className,
  delay = 0,
  amplitude = 12,
}: FloatingDecorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.to(target, {
        y: -amplitude,
        rotation: 1.5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay,
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
