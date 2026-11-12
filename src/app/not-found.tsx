import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GradientOrb } from "@/components/motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70dvh] items-center justify-center overflow-hidden bg-ivory px-5 py-24">
      <GradientOrb color="champagne" className="-right-20 -top-20 h-80 w-80 opacity-60" />
      <GradientOrb color="gold" className="-bottom-24 -left-16 h-72 w-72 opacity-40" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-5 text-center">
        <p className="font-display text-7xl text-gold-deep sm:text-8xl">404</p>
        <h1 className="font-display text-3xl text-navy sm:text-4xl">
          Halaman ini tidak ditemukan
        </h1>
        <p className="text-sm text-navy/70 sm:text-base">
          Tautan mungkin sudah berubah atau halamannya sudah dihapus. Kembali ke
          beranda untuk melanjutkan menjelajah.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg" className="w-full sm:w-auto">
            Kembali ke Beranda
          </Button>
          <Button href="/#template" variant="ghost" size="lg" className="w-full sm:w-auto">
            Jelajahi Template
          </Button>
        </div>
        <Link
          href="/login"
          className="mt-2 text-sm text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline"
        >
          Masuk ke akun Anda
        </Link>
      </div>
    </main>
  );
}
