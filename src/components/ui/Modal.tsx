"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, motionQueries, useGSAP } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: Escape closes, backdrop click closes, focus moves into
 * the dialog on open and Tab is trapped inside it. Body scroll is locked
 * while open. Rendered inline (not in a portal) so it never depends on a
 * client-only mount flag.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);

  // A tween that outlives the component would keep animating a detached node.
  useEffect(() => {
    return () => {
      exitTweenRef.current?.kill();
      exitTweenRef.current = null;
    };
  }, []);

  /**
   * Closing is event-driven: the exit animation runs, and only when it
   * finishes does the dialog unmount. `closing` keeps it mounted while the
   * parent has already flipped `open` to false.
   */
  const requestClose = useCallback(() => {
    const panel = dialogRef.current;
    const backdrop = backdropRef.current;

    if (!panel || !backdrop) {
      onClose();
      return;
    }

    setClosing(true);
    const tween = gsap.to([panel, backdrop], {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setClosing(false),
    });
    // The backdrop must stop catching clicks while the dialog fades out.
    gsap.set(backdrop, { pointerEvents: "none" });
    exitTweenRef.current = tween;
    onClose();
  }, [onClose]);

  const rendered = open || closing;

  useGSAP(
    () => {
      if (!rendered) return;
      const panel = dialogRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) return;

      const mm = gsap.matchMedia();
      mm.add(motionQueries.animate, () => {
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.96, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.22,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.22,
            ease: "none",
            clearProps: "visibility",
          },
        );
      });

      return () => mm.revert();
    },
    { dependencies: [rendered], scope: dialogRef },
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(
        (element) =>
          element.offsetParent !== null || element === document.activeElement,
      );

      if (focusables.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, requestClose]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        ref={backdropRef}
        data-testid="modal-backdrop"
        onClick={requestClose}
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden",
          "rounded-t-3xl bg-white shadow-[var(--shadow-soft)] sm:max-w-lg sm:rounded-3xl",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl text-navy">{title}</h2>
            {description ? (
              <p className="text-sm text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={requestClose}
            className="tap-target -mr-2 -mt-1 rounded-full text-xl leading-none text-navy/60 transition-colors hover:bg-navy/5 hover:text-navy"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer ? (
          <div className="border-t border-navy/10 p-5">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
