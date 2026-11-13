"use client";

import { useState } from "react";
import { SectionLabel } from "./SectionLabel";

export interface GiftInfoProps {
  gift?: { bank: string; account: string; holder: string };
  note?: string;
}

/** Digital envelope: a card with the account number and a copy action. */
export function GiftInfo({ gift, note }: GiftInfoProps) {
  const [copied, setCopied] = useState(false);

  if (!gift) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(gift.account);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="hadiah" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-md">
        <SectionLabel>Hadiah</SectionLabel>
        <p className="mt-4 text-center text-sm leading-relaxed text-[var(--inv-muted)]">
          {note ?? "Doa dan kehadiran Anda sudah lebih dari cukup. Bila ingin memberi tanda kasih, Anda dapat mengirimkannya melalui:"}
        </p>

        <div className="mt-6 rounded-[var(--inv-radius)] border border-[var(--inv-line)] bg-[var(--inv-surface)] p-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--inv-accent)]">
            {gift.bank}
          </p>
          <p className="mt-2 font-mono text-2xl tracking-[0.08em] text-[var(--inv-ink)]">
            {gift.account}
          </p>
          <p className="mt-1 text-sm text-[var(--inv-muted)]">a.n. {gift.holder}</p>
          <button
            type="button"
            onClick={copy}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--inv-accent)] px-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-accent)] transition hover:bg-[var(--inv-accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--inv-accent)]"
          >
            {copied ? "Nomor disalin" : "Salin nomor"}
          </button>
        </div>
      </div>
    </section>
  );
}
