"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, motionQueries, useGSAP } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 12, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div
      ref={ref}
      role={item.variant === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-[var(--shadow-soft)]",
        item.variant === "error"
          ? "border-red-200 bg-red-50 text-red-900"
          : item.variant === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-navy/10 bg-white text-navy",
      )}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description ? (
          <p className="text-xs opacity-80">{item.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Tutup notifikasi"
        onClick={() => onDismiss(item.id)}
        className="tap-target -mr-1 -mt-1 rounded-full px-2 opacity-60 transition-opacity hover:opacity-100"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Date.now() + Math.random();
      setItems((current) => [...current, { ...options, id }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 safe-bottom sm:items-end"
        aria-live="polite"
      >
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
