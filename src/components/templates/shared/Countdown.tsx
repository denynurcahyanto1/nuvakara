"use client";

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  /** Seconds left at server render, so guests never see a fake "0 days". */
  initialSeconds?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: 'days', label: 'Hari' },
  { key: 'hours', label: 'Jam' },
  { key: 'minutes', label: 'Menit' },
  { key: 'seconds', label: 'Detik' },
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

export const Countdown: React.FC<CountdownProps> = ({ targetDate, initialSeconds }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    split(initialSeconds ?? secondsUntil(targetDate)),
  );

  useEffect(() => {
    const update = () => setTimeLeft(split(secondsUntil(targetDate)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4" role="timer" aria-label="Hitung mundur acara">
      {UNITS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">
            {String(timeLeft[key]).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
};
