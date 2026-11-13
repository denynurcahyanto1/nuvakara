"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface CountdownProps {
  targetDate: string;
  /** Seconds left at server render, so guests never see a fake "0 days". */
  initialSeconds?: number;
  className?: string;
  /** Use on solid accent panels: values inherit the on-accent colour. */
  tone?: "default" | "on-accent";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
];

function split(totalSeconds: number): TimeLeft {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return {
    days: Math.floor(safe / 86_400),
    hours: Math.floor((safe / 3_600) % 24),
    minutes: Math.floor((safe / 60) % 60),
    seconds: safe % 60,
  };
}

function secondsUntil(targetDate: string): number {
  return Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 1000));
}

export function Countdown({
  targetDate,
  initialSeconds,
  className,
  tone = "default",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    split(initialSeconds ?? secondsUntil(targetDate)),
  );

  useEffect(() => {
    const update = () => setTimeLeft(split(secondsUntil(targetDate)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const onAccent = tone === "on-accent";

  return (
    <div
      className={cn(
        "grid grid-cols-4 text-[var(--inv-ink)]",
        onAccent
          ? "text-[var(--inv-on-accent)]"
          : "divide-x divide-[var(--inv-line)]",
        className,
      )}
      role="timer"
      aria-label="Hitung mundur acara"
    >
      {UNITS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center px-1 first:pl-0 last:pr-0">
          <span className="font-inv-display text-3xl leading-none tabular-nums sm:text-4xl">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "mt-2 text-[9px] font-medium uppercase tracking-[0.22em]",
              onAccent ? "opacity-70" : "text-[var(--inv-muted)]",
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
