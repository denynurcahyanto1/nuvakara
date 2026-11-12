"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQueries, useGSAP } from "./gsap";

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
 * With reduced motion the content is rendered visible immediately — GSAP
 * never applies the start state, so nothing can stay stuck at opacity 0.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.from(target, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: target,
          start: "top 85%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  const props = { ref: setRef, className, "data-reveal": "" } as const;

  if (as === "section") return <section {...props}>{children}</section>;
  if (as === "span") return <span {...props}>{children}</span>;
  if (as === "li") return <li {...props}>{children}</li>;
  return <div {...props}>{children}</div>;
}
