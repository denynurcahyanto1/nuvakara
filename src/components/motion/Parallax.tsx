"use client";

import { useRef, type ReactNode } from "react";
import { and, gsap, motionQueries, useGSAP } from "./gsap";

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
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const mm = gsap.matchMedia();
    mm.add(and(motionQueries.desktop, motionQueries.animate), () => {
      gsap.to(inner, {
        y: -speed * 120,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={className ? `relative ${className}` : "relative"}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
