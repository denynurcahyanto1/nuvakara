"use client";

import { useEffect, useRef, useState } from "react";

export interface MusicPlayerProps {
  /** Audio URL from the event row. Nothing renders when empty. */
  url?: string;
  /** Increment after a user gesture (opening the cover) to start playback. */
  playSignal?: number;
}

/**
 * Floating music toggle. Browsers block autoplay without a gesture, so the
 * shell increments `playSignal` from the "Buka Undangan" click.
 */
export function MusicPlayer({ url, playSignal = 0 }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [url]);

  useEffect(() => {
    if (playSignal <= 0) return;
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => setPlaying(false));
  }, [playSignal]);

  if (!url) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        aria-pressed={playing}
        title={playing ? "Jeda musik" : "Putar musik"}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--inv-line)] bg-[var(--inv-bg)]/85 text-[var(--inv-accent)] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:border-[var(--inv-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--inv-accent)] sm:bottom-8 sm:right-8"
      >
        {playing ? (
          <span className="flex items-end gap-[3px]" aria-hidden="true">
            <span className="h-2.5 w-[3px] animate-[equalize_0.9s_ease-in-out_infinite] rounded-full bg-current" />
            <span className="h-4 w-[3px] animate-[equalize_0.9s_ease-in-out_0.15s_infinite] rounded-full bg-current" />
            <span className="h-3 w-[3px] animate-[equalize_0.9s_ease-in-out_0.3s_infinite] rounded-full bg-current" />
          </span>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M9 18V6l10-2v11" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="15" r="2.5" />
          </svg>
        )}
      </button>
      <style>{`@keyframes equalize{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}`}</style>
    </>
  );
}
