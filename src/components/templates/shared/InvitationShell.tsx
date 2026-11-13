"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { InvitationCover, type CoverConfig } from "./InvitationCover";
import { InvitationNav, type NavItem } from "./InvitationNav";
import { MusicPlayer } from "./MusicPlayer";
import { themeStyle, type TemplateTheme } from "./theme";

export interface InvitationShellProps {
  theme: TemplateTheme;
  cover: CoverConfig;
  nav: NavItem[];
  musicUrl?: string;
  mode?: "live" | "preview";
  children: ReactNode;
}

/**
 * Cinematic wrapper shared by every template: cover gate, scroll lock, music,
 * bottom navigation, and a hairline reading-progress bar.
 */
export function InvitationShell({
  theme,
  cover,
  nav,
  musicUrl,
  mode = "live",
  children,
}: InvitationShellProps) {
  const [opened, setOpened] = useState(false);
  const [coverMounted, setCoverMounted] = useState(true);
  const [playSignal, setPlaySignal] = useState(0);
  const coverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Only a real invitation hides the page behind the cover. The preview page
  // must stay scrollable for people who landed there from the catalogue.
  useEffect(() => {
    if (mode !== "live" || opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mode, opened]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    setPlaySignal((value) => value + 1);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = coverRef.current;

    if (!node || reduce) {
      setCoverMounted(false);
    } else {
      gsap.to(node, {
        opacity: 0,
        scale: 1.03,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => setCoverMounted(false),
      });
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(() => contentRef.current?.focus?.(), 80);
  }, []);

  return (
    <div
      style={themeStyle(theme)}
      data-template={theme.slug}
      data-tone={theme.tone}
      className="relative min-h-dvh bg-[var(--inv-bg)] font-inv-body text-[var(--inv-ink)] selection:bg-[var(--inv-accent)] selection:text-[var(--inv-on-accent)]"
    >
      <div
        ref={progressRef}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[75] h-[2px] origin-left scale-x-0 bg-[var(--inv-accent)]"
      />

      {coverMounted ? (
        <div ref={coverRef} className="fixed inset-0 z-[80]">
          <InvitationCover config={cover} mode={mode} onOpen={open} />
        </div>
      ) : null}

      <div
        ref={contentRef}
        tabIndex={-1}
        aria-hidden={!opened}
        className={`outline-none transition-opacity duration-500 ${
          opened ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>

      <MusicPlayer url={musicUrl} playSignal={playSignal} />
      <InvitationNav items={nav} visible={opened} />
    </div>
  );
}
