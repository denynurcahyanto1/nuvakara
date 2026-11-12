import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export function Features() {
  return (
    <section id="fitur" className="relative bg-cream/60 py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Fitur"
            title="Semua yang dibutuhkan untuk undangan digital"
            description="Dari desain hingga statistik, Nuvakara menangani detail teknisnya agar Anda fokus pada momennya."
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.features.map((feature) => (
            <StaggerItem key={feature.id}>
              <article className="glass h-full rounded-[var(--radius-card)] p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                  <Icon name={feature.icon as IconName} size={22} />
                </span>
                <h3 className="mt-4 font-display text-xl text-navy">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
