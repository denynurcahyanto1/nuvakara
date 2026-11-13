import { Ornament } from "./Ornament";

export interface InvitationFooterProps {
  /** Optional host signature, e.g. "Rafi & Aisyah". */
  signature?: string;
  note?: string;
}

export function InvitationFooter({ signature, note }: InvitationFooterProps) {
  return (
    <footer className="px-6 pb-28 pt-14 text-center">
      <Ornament variant="hairline" className="mx-auto opacity-70" />
      <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
        {note ?? "Terima kasih atas doa dan perhatian Anda"}
      </p>
      {signature ? (
        <p className="mt-3 font-inv-display text-2xl text-[var(--inv-ink)]">
          {signature}
        </p>
      ) : null}
      <p className="mt-8 text-[9px] uppercase tracking-[0.4em] text-[var(--inv-muted)] opacity-60">
        Dibuat dengan NUVAKARA
      </p>
    </footer>
  );
}
