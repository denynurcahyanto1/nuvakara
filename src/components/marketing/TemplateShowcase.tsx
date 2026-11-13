import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TemplatePreview } from "@/lib/types";

const paletteStyles: Record<string, { bg: string; accent: string; text: string }> = {
  "wedding-classic": {
    bg: "bg-[#FBF7F0]",
    accent: "bg-[#C6A15B]",
    text: "text-[#141C2B]",
  },
  "birthday-celebration": {
    bg: "bg-[#FFF3E6]",
    accent: "bg-[#E4572E]",
    text: "text-[#7B2CBF]",
  },
  "baby-shower": {
    bg: "bg-[#EAF3FA]",
    accent: "bg-[#F6DCE4]",
    text: "text-[#3E6C8E]",
  },
  "graduation-modern": {
    bg: "bg-[#0B0B0F]",
    accent: "bg-[#D4AF37]",
    text: "text-[#D4AF37]",
  },
};

export interface TemplateShowcaseProps {
  templates: TemplatePreview[];
}

export function TemplateShowcase({ templates }: TemplateShowcaseProps) {
  return (
    <section id="template" className="relative bg-ivory py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Template"
            title="Empat karakter visual, satu platform"
            description="Setiap template punya layout, warna, tipografi, dan animasinya sendiri — bukan sekadar mengganti warna."
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {templates.map((template) => {
            const palette = paletteStyles[template.slug] ?? paletteStyles["wedding-classic"];

            return (
              <StaggerItem key={template.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-[var(--shadow-soft)]">
                  <div
                    className={`relative h-44 w-full overflow-hidden ${palette.bg}`}
                  >
                    <div
                      className={`absolute left-6 top-6 h-2 w-20 rounded-full ${palette.accent}`}
                    />
                    <div
                      className={`absolute left-6 top-14 h-10 w-40 rounded-xl border ${palette.text} opacity-80`}
                    />
                    <div
                      className={`absolute bottom-6 right-6 h-16 w-16 rounded-full ${palette.accent} opacity-70`}
                    />
                    <p
                      className={`absolute bottom-6 left-6 font-display text-xl ${palette.text}`}
                    >
                      {template.name}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="muted">{template.category}</Badge>
                      {template.isPremium ? (
                        <Badge variant="premium">Premium</Badge>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-display text-2xl text-navy">
                      {template.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                      {template.description}
                    </p>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <Link
                        href={`/invite/${template.slug}`}
                        className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-navy/15 px-5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/register?template=${template.slug}`}
                        className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-navy px-5 text-sm font-medium text-ivory transition-colors hover:bg-navy-soft"
                      >
                        Gunakan Template
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
