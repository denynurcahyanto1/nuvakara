"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70dvh] items-center justify-center bg-ivory px-5 py-24">
      <div className="flex max-w-lg flex-col items-center gap-5 text-center">
        <p className="font-display text-6xl text-gold-deep">Oops</p>
        <h1 className="font-display text-3xl text-navy">
          Ada yang tidak beres di sisi kami
        </h1>
        <p className="text-sm text-navy/70 sm:text-base">
          Halaman ini gagal dimuat. Silakan coba lagi — jika masalahnya terus
          berulang, hubungi kami lewat halaman kontak.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted">Kode: {error.digest}</p>
        ) : null}
        <Button size="lg" onClick={reset} className="mt-2">
          Coba Lagi
        </Button>
      </div>
    </main>
  );
}
