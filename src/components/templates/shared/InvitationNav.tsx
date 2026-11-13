"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
}

export interface InvitationNavProps {
  items: NavItem[];
  /** Hidden until the guest opens the cover. */
  visible: boolean;
}

/**
 * Bottom pill navigation inside the invitation. Active state follows the
 * section crossing the middle of the viewport.
 */
export function InvitationNav({ items, visible }: InvitationNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) setActive(visibleEntry.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Navigasi undangan"
      className={`safe-bottom fixed inset-x-0 bottom-0 z-[65] flex justify-center px-3 pb-3 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[var(--inv-line)] bg-[var(--inv-bg)]/92 p-1.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`flex min-h-11 shrink-0 items-center rounded-full px-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "bg-[var(--inv-accent)] text-[var(--inv-on-accent)]"
                  : "text-[var(--inv-muted)] hover:text-[var(--inv-ink)]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
