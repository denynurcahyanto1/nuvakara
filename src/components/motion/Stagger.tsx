"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQueries, useGSAP } from "./gsap";

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
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-stagger-item]");

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.from(items, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power3.out",
        stagger: gap,
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Child wrapper for `Stagger`. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item="" className={className}>
      {children}
    </div>
  );
}
