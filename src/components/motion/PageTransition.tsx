"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQueries, useGSAP } from "./gsap";

export interface PageTransitionProps {
  children: ReactNode;
}

/** Fade + lift applied on route change. */
export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.from(target, {
        opacity: 0,
        y: 8,
        duration: 0.25,
        ease: "power2.out",
        clearProps: "transform",
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
