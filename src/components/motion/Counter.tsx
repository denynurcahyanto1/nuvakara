"use client";

import { useRef } from "react";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "./gsap";
import { formatNumber } from "@/lib/utils";

export interface CounterProps {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts up to `to` when it scrolls into view.
 * The value is written straight to the DOM (no React state per frame), so
 * the animation never triggers a re-render.
 * Reduced motion renders the final value straight away.
 */
export function Counter({
  to,
  durationMs = 1200,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const write = (value: number) => {
      target.textContent = `${prefix}${formatNumber(value)}${suffix}`;
    };

    const mm = gsap.matchMedia();

    mm.add(motionQueries.reduce, () => {
      write(to);
    });

    mm.add(motionQueries.animate, () => {
      const counter = { value: 0 };
      write(0);

      const tween = gsap.to(counter, {
        value: to,
        duration: durationMs / 1000,
        ease: "power2.out",
        paused: true,
        onUpdate: () => write(Math.round(counter.value)),
        // Guarantee the final value even if the tween is interrupted.
        onComplete: () => write(to),
      });

      const trigger = ScrollTrigger.create({
        trigger: target,
        start: "top 92%",
        once: true,
        onEnter: () => tween.play(),
      });

      return () => {
        trigger.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`.trim()}>
      {/* The final value is the server-rendered content, so the number is
          correct without JavaScript and survives a React re-render. GSAP
          animates from 0 to the same value when it scrolls into view. */}
      {prefix}
      {formatNumber(to)}
      {suffix}
    </span>
  );
}
