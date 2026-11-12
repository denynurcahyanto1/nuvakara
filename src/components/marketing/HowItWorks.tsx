import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export function HowItWorks() {
  return (
    <section id="cara" className="relative bg-navy py-20 text-ivory sm:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Cara Kerja"
            title="Lima langkah, siap dalam lima menit"
            description="Tanpa tooling desain, tanpa installment aplikasi yang rumit."
          />
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {siteConfig.howItWorks.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08}>
              <li className="flex h-full flex-col gap-3 border-t border-gold/40 pt-5">
                <span className="font-display text-3xl text-gold">
                  {item.step}
                </span>
                <h3 className="font-display text-xl text-ivory">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ivory/70">
                  {item.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
