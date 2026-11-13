import { Button } from "@/components/ui/Button";
import { GradientOrb, Reveal } from "@/components/motion";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 sm:py-24">
      <GradientOrb
        color="gold"
        className="-right-16 top-0 h-72 w-72 opacity-30"
      />
      <GradientOrb
        color="champagne"
        className="-left-20 bottom-0 h-64 w-64 opacity-20"
      />

      <div className="container-page relative z-10 flex flex-col items-center gap-6 text-center">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl leading-tight text-ivory sm:text-4xl">
            Saatnya mengubah undangan Anda menjadi sesuatu yang diingat
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xl text-sm text-ivory/70 sm:text-base">
            Buat akun gratis, pilih template, dan bagikan link ke tamu â€” dalam
            hitungan menit.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/register" size="lg" className="w-full sm:w-auto">
              Buat Undangan
            </Button>
            <Button
              href="/#template"
              variant="ghost"
              size="lg"
              className="w-full border-ivory/30 text-ivory hover:bg-ivory/10 sm:w-auto"
            >
              Jelajahi Template
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
