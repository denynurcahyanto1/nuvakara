import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TemplateCard } from "./TemplateCard";
import type { TemplatePreview } from "@/lib/types";

export interface TemplateShowcaseProps {
  templates: TemplatePreview[];
  /** Show only the first N designs (the home page does this). */
  limit?: number;
  heading?: boolean;
}

export function TemplateShowcase({
  templates,
  limit,
  heading = true,
}: TemplateShowcaseProps) {
  const visible = typeof limit === "number" ? templates.slice(0, limit) : templates;

  return (
    <section id="template" className="relative bg-ivory py-20 sm:py-28">
      <div className="container-page">
        {heading ? (
          <Reveal>
            <SectionHeading
              eyebrow="Template"
              title="Sepuluh karakter visual, satu platform"
              description="Setiap desain punya tata letak, palet, tipografi, dan gerakannya sendiri — dari floral yang tenang sampai game yang playful."
            />
          </Reveal>
        ) : null}

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <StaggerItem key={template.slug} className="h-full">
              <TemplateCard template={template} />
            </StaggerItem>
          ))}
        </Stagger>

        {typeof limit === "number" ? (
          <div className="mt-10 text-center">
            <Link
              href="/template"
              className="inline-flex h-12 items-center justify-center rounded-full border border-navy/20 px-7 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
            >
              Lihat semua {templates.length} desain
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
