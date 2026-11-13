import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FloatingDecor, GradientOrb, Reveal, TextReveal } from "@/components/motion";

export function Hero() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-ivory pb-20 pt-28 sm:pb-28 sm:pt-36"
    >
      <GradientOrb
        color="champagne"
        className="-right-24 -top-24 h-72 w-72 opacity-70 sm:h-96 sm:w-96"
      />
      <GradientOrb
        color="gold"
        className="-left-32 top-40 h-64 w-64 opacity-40 sm:h-80 sm:w-80"
      />

      <div className="container-page relative z-10 flex flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="flex max-w-2xl flex-col items-center gap-6 lg:items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-gold-deep uppercase backdrop-blur">
              Platform undangan digital premium
            </span>
          </Reveal>

          <TextReveal
            as="h1"
            text="Create Beautiful Invitations for Your Special Moments."
            className="font-display text-4xl leading-[1.1] text-navy sm:text-5xl lg:text-6xl"
          />

          <Reveal delay={0.15}>
            <p className="max-w-xl text-base text-navy/70 sm:text-lg">
              Ubah momen spesial menjadi pengalaman digital yang tak terlupakan
              bersama Nuvakara.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="w-full">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href="/register" size="lg" className="w-full sm:w-auto">
                Mulai Sekarang
              </Button>
              <Button
                href="/#template"
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                Jelajahi Template
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative w-full max-w-md lg:max-w-sm">
          <div className="relative aspect-[4/5] w-full">
            <FloatingDecor
              className="left-0 top-6 h-24 w-24 rounded-3xl border border-gold/40 bg-white/80 p-3 shadow-[var(--shadow-soft)] backdrop-blur"
              amplitude={14}
            >
              <Image
                src="/brand/nuvakara-mark.png"
                alt=""
                width={72}
                height={63}
                className="h-auto w-auto"
              />
            </FloatingDecor>

            <div className="absolute inset-x-6 top-10 rounded-[var(--radius-card)] border border-navy/10 bg-white/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
              <p className="text-xs tracking-[0.3em] text-gold-deep uppercase">
                The Wedding Of
              </p>
              <p className="mt-2 font-display text-3xl text-navy">Rafi &amp; Aisyah</p>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="mt-4 text-sm text-navy/70">
                Sabtu, 12 Desember 2026 Â· 10:00 WIB
              </p>
              <p className="text-sm text-navy/70">Grand Ballroom, Jakarta</p>
            </div>

            <FloatingDecor
              className="-right-2 bottom-8 flex h-20 w-20 items-center justify-center rounded-full bg-navy text-gold shadow-[var(--shadow-soft)]"
              delay={0.6}
              amplitude={18}
            >
              <Image
                src="/brand/nuvakara-mark.png"
                alt=""
                width={48}
                height={42}
                className="h-auto w-auto"
              />
            </FloatingDecor>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
