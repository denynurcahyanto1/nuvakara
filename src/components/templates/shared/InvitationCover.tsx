"use client";

import Image from "next/image";
import { formatEventDateCompact, formatEventTime } from "@/lib/datetime";

export type CoverVariant = "arch" | "editorial" | "cinematic" | "deco";

export interface CoverConfig {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** ISO timestamp; formatted in WIB. */
  date: string;
  image?: string | null;
  variant: CoverVariant;
  /** Closing note printed at the bottom of the cover. */
  note?: string;
}

export interface InvitationCoverProps {
  config: CoverConfig;
  mode: "live" | "preview";
  onOpen: () => void;
}

function OpenButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[var(--inv-accent)] px-7 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--inv-on-accent)] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--inv-accent)]"
    >
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 24"
      className={`h-5 w-32 text-[var(--inv-accent)] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M2 12h46M92 12h46" strokeLinecap="round" />
      <path d="M70 3c7 5 12 9 12 9s-5 4-12 9c-7-5-12-9-12-9s5-4 12-9Z" />
      <circle cx="70" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DateLine({ date, className = "" }: { date: string; className?: string }) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.32em] [text-wrap:balance] ${className}`}
    >
      {formatEventDateCompact(date)}
      {formatEventTime(date) ? <span className="opacity-60"> · {formatEventTime(date)}</span> : null}
    </p>
  );
}

export function InvitationCover({ config, mode, onOpen }: InvitationCoverProps) {
  const label = mode === "preview" ? "Lihat Pratinjau" : "Buka Undangan";
  const { image, title, eyebrow, subtitle, note } = config;

  const button = <OpenButton label={label} onClick={onOpen} />;

  if (config.variant === "cinematic") {
    return (
      <section
        aria-label="Sampul undangan"
        className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-[#08090C] px-6 py-10 text-[#F6F2E9] sm:px-12 sm:py-14"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,var(--inv-accent),transparent_58%)] opacity-30"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85"
        />

        <header className="relative z-10 flex items-start justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--inv-accent)]">
            {eyebrow}
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            {formatEventDateCompact(config.date)}
          </p>
        </header>

        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 h-px w-16 bg-[var(--inv-accent)]" />
          <h1 className="font-inv-display text-[clamp(2.6rem,9vw,5.6rem)] font-light leading-[0.95] tracking-[-0.02em] text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
            {button}
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              {formatEventTime(config.date)}
            </p>
          </div>
        </div>

        <footer className="relative z-10 flex items-end justify-between gap-6">
          <p className="max-w-xs text-[10px] leading-relaxed tracking-[0.12em] text-white/40">
            {note ?? "Mohon maaf apabila ada kesalahan penulisan nama dan gelar."}
          </p>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">NUVAKARA</span>
        </footer>
      </section>
    );
  }

  if (config.variant === "editorial") {
    return (
      <section
        aria-label="Sampul undangan"
        className="grid h-dvh w-full grid-rows-[1fr_38%] overflow-hidden bg-[var(--inv-bg)] text-[var(--inv-ink)] lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1"
      >
        <div className="relative z-10 flex flex-col justify-between px-6 pb-8 pt-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--inv-accent)]">
              {eyebrow}
            </p>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
              No. 01
            </span>
          </div>

          <div className="py-8">
            <h1 className="max-w-[13ch] font-inv-display text-[clamp(2.5rem,7vw,4.8rem)] font-light leading-[0.98] tracking-[-0.02em] text-balance">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--inv-muted)] sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-6 h-px w-full bg-[var(--inv-line)]" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <DateLine date={config.date} className="text-[var(--inv-ink)]" />
              </div>
              {button}
            </div>
            {note ? (
              <p className="mt-6 max-w-md text-[10px] leading-relaxed tracking-[0.1em] text-[var(--inv-muted)]">
                {note}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative order-first overflow-hidden lg:order-last">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,var(--inv-accent-soft),var(--inv-bg)_55%,var(--inv-accent-soft))]"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[var(--inv-bg)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[var(--inv-bg)] lg:via-transparent"
          />
        </div>
      </section>
    );
  }

  if (config.variant === "deco") {
    return (
      <section
        aria-label="Sampul undangan"
        className="relative flex h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-[var(--inv-bg)] px-8 py-12 text-center text-[var(--inv-ink)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-4 border border-[var(--inv-line)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-6 border border-[var(--inv-line)] opacity-60"
        />
        {["left-4 top-4", "right-4 top-4", "bottom-4 left-4", "bottom-4 right-4"].map(
          (position) => (
            <span
              key={position}
              aria-hidden="true"
              className={`absolute ${position} h-2.5 w-2.5 rotate-45 bg-[var(--inv-accent)]`}
            />
          ),
        )}

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--inv-accent)]">
            {eyebrow}
          </p>

          <div className="relative mt-7 w-[58%] max-w-[220px]">
            <div className="relative aspect-[3/4] overflow-hidden border border-[var(--inv-line)] p-1.5">
              <div className="relative h-full w-full overflow-hidden bg-[var(--inv-accent-soft)]">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    priority
                    sizes="240px"
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-2 -right-2 h-14 w-14 border-b border-r border-[var(--inv-accent)]"
            />
            <span
              aria-hidden="true"
              className="absolute -left-2 -top-2 h-14 w-14 border-l border-t border-[var(--inv-accent)]"
            />
          </div>

          <h1 className="mt-7 font-inv-display text-[clamp(2.2rem,7vw,3.6rem)] font-light leading-[1] text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--inv-muted)]">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-5 flex items-center gap-3 text-[var(--inv-accent)]">
            <span className="h-px w-8 bg-current" />
            <span className="h-1 w-1 rotate-45 bg-current" />
            <span className="h-px w-8 bg-current" />
          </div>

          <DateLine date={config.date} className="mt-4 text-[var(--inv-ink)]" />

          <div className="mt-7">{button}</div>

          <p className="mt-7 max-w-xs text-[10px] leading-relaxed tracking-[0.1em] text-[var(--inv-muted)]">
            {note ?? "Merupakan suatu kehormatan apabila Anda berkenan hadir."}
          </p>
        </div>
      </section>
    );
  }

  // arch — the floral / adat / islami cover.
  return (
    <section
      aria-label="Sampul undangan"
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-[var(--inv-bg)] px-6 py-10 text-center text-[var(--inv-ink)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,var(--inv-accent-soft),transparent_45%),radial-gradient(circle_at_88%_92%,var(--inv-accent-soft),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-5 inset-y-5 rounded-[calc(var(--inv-radius)+1rem)] border border-[var(--inv-line)]"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--inv-accent)]">
          {eyebrow}
        </p>
        <Flourish className="mt-4" />

        <div className="relative mt-6 w-[62%] max-w-[230px]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-[var(--inv-line)] p-2">
            <div className="relative h-full w-full overflow-hidden rounded-t-full bg-[var(--inv-accent-soft)]">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  priority
                  sizes="260px"
                  className="object-cover"
                />
              ) : null}
            </div>
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-3 left-1/2 h-6 w-px -translate-x-1/2 bg-[var(--inv-accent)]"
          />
        </div>

        <h1 className="mt-7 font-inv-display text-[clamp(2.3rem,7.5vw,3.7rem)] font-light leading-[1] tracking-[-0.01em] text-balance">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--inv-muted)]">
            {subtitle}
          </p>
        ) : null}

        <DateLine date={config.date} className="mt-5 text-[var(--inv-ink)]" />

        <div className="mt-7">{button}</div>

        <p className="mt-6 max-w-[19rem] text-[10px] leading-relaxed tracking-[0.1em] text-[var(--inv-muted)]">
          {note ?? "Merupakan suatu kehormatan apabila Anda berkenan hadir."}
        </p>
      </div>
    </section>
  );
}
