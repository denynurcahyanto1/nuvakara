"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
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
 * Reduced motion renders the final value straight away.
 */
export function Counter({
  to,
  durationMs = 1200,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    let frame = 0;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, durationMs, reduceMotion]);

  const displayed = reduceMotion ? to : value;

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatNumber(displayed)}
      {suffix}
    </span>
  );
}
