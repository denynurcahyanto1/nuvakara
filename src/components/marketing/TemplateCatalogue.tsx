"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { TemplatePreview } from "@/lib/types";
import { TemplateCard } from "./TemplateCard";

const TIERS = ["Basic", "Premium", "Eksklusif", "Luxury"] as const;

const EVENT_FILTERS = [
  { value: "all", label: "Semua acara" },
  { value: "wedding", label: "Pernikahan" },
  { value: "other", label: "Acara lain" },
] as const;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-xs font-medium transition-colors",
        active
          ? "border-navy bg-navy text-ivory"
          : "border-navy/15 bg-white/60 text-navy/70 hover:border-navy/30 hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

export function TemplateCatalogue({ templates }: { templates: TemplatePreview[] }) {
  const [event, setEvent] = useState<(typeof EVENT_FILTERS)[number]["value"]>("all");
  const [category, setCategory] = useState("Semua");
  const [tier, setTier] = useState("Semua");

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(templates.map((template) => template.category)))],
    [templates],
  );

  const visible = templates.filter((template) => {
    const eventMatch = event === "all" || template.eventFit.includes(event);
    const categoryMatch = category === "Semua" || template.category === category;
    const tierMatch = tier === "Semua" || template.tier === tier;
    return eventMatch && categoryMatch && tierMatch;
  });

  return (
    <div>
      <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white/70 p-4 backdrop-blur sm:p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-navy/40">
              Acara
            </span>
            {EVENT_FILTERS.map((filter) => (
              <Chip
                key={filter.value}
                active={event === filter.value}
                onClick={() => setEvent(filter.value)}
              >
                {filter.label}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-navy/40">
              Gaya
            </span>
            {categories.map((item) => (
              <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
                {item}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-navy/40">
              Paket
            </span>
            <Chip active={tier === "Semua"} onClick={() => setTier("Semua")}>
              Semua
            </Chip>
            {TIERS.map((item) => (
              <Chip key={item} active={tier === item} onClick={() => setTier(item)}>
                {item}
              </Chip>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-navy/50">
          Menampilkan {visible.length} dari {templates.length} desain.
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-navy/20 bg-white/50 px-6 py-16 text-center">
          <p className="font-display text-2xl text-navy">Belum ada desain untuk filter ini</p>
          <p className="mt-2 text-sm text-navy/60">
            Coba kombinasi lain, atau konsultasikan desain custom dengan tim kami.
          </p>
          <button
            type="button"
            onClick={() => {
              setEvent("all");
              setCategory("Semua");
              setTier("Semua");
            }}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-navy px-6 text-sm font-medium text-ivory"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
