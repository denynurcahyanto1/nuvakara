"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, motionQueries, useGSAP } from "@/components/motion/gsap";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

/**
 * Sticky navigation: transparent over the hero, solid once the page is
 * scrolled. On phones the links move into a full-height drawer sheet.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.fromTo(
        drawer,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    });

    return () => mm.revert();
  }, { dependencies: [open], scope: drawerRef });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-navy/10 bg-ivory/85 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Navigasi utama"
        className="container-page flex h-16 items-center justify-between gap-4 sm:h-20"
      >
        <Logo size={32} />

        <div className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-navy/75 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-11 items-center px-4 text-sm font-medium text-navy/80 transition-colors hover:text-navy"
          >
            Login
          </Link>
          <Button href="/register" size="sm">
            Buat Undangan
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label="Menu navigasi"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="tap-target -mr-2 min-h-11 min-w-11 rounded-full text-navy transition-colors hover:bg-navy/5 lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </nav>

      {open ? (
        <div
          ref={drawerRef}
          role="dialog"
          aria-label="Menu navigasi"
          className="h-dvh overflow-y-auto border-t border-navy/10 bg-ivory px-5 pb-8 pt-6 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo size={30} />
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="tap-target -mr-2 min-h-11 min-w-11 rounded-full text-navy transition-colors hover:bg-navy/5"
            >
              <Icon name="close" size={24} />
            </button>
          </div>

          <ul className="mt-6 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center border-b border-navy/8 font-display text-2xl text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Button href="/register" size="lg" className="w-full">
              Buat Undangan
            </Button>
            <Button href="/login" variant="ghost" size="lg" className="w-full">
              Login
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
