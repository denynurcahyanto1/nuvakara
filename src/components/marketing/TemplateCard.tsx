import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { themes } from "@/components/templates/shared/theme";
import type { TemplatePreview } from "@/lib/types";

const tierVariant: Record<string, "muted" | "premium"> = {
  Basic: "muted",
  Premium: "muted",
  Eksklusif: "premium",
  Luxury: "premium",
};

export function TemplateCard({ template }: { template: TemplatePreview }) {
  const theme = themes[template.slug];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)]">
      <div
        className="relative h-48 w-full overflow-hidden"
        style={{ backgroundColor: theme?.background ?? "#FBF7F0" }}
      >
        {/* Arch motif, tinted with the template palette. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 top-8 mx-auto w-[62%] rounded-t-full border p-1.5"
          style={{ borderColor: theme?.line ?? "rgba(20,28,43,0.15)" }}
        >
          <div
            className="h-full w-full rounded-t-full"
            style={{
              background: `linear-gradient(160deg, ${theme?.accentSoft ?? "#E8D9C0"}, ${
                theme?.background ?? "#FBF7F0"
              })`,
            }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute left-5 top-5 h-1.5 w-14 rounded-full"
          style={{ backgroundColor: theme?.accent ?? "#C6A15B" }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-5 right-5 h-8 w-8 rounded-full opacity-70"
          style={{ backgroundColor: theme?.accent ?? "#C6A15B" }}
        />
        <p
          className="absolute bottom-5 left-5 max-w-[70%] font-display text-xl leading-tight"
          style={{ color: theme?.ink ?? "#141C2B" }}
        >
          {template.name}
        </p>
        <span
          className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
          style={{
            backgroundColor: theme?.accent ?? "#C6A15B",
            color: theme?.onAccent ?? "#141C2B",
          }}
        >
          {template.tier}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{template.category}</Badge>
          <Badge variant={tierVariant[template.tier] ?? "muted"}>{template.palette}</Badge>
        </div>

        <h3 className="mt-3 font-display text-2xl text-navy">{template.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
          {template.description}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/template/${template.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-navy/15 px-5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
          >
            Preview
          </Link>
          <Link
            href={`/register?template=${template.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-navy px-5 text-sm font-medium text-ivory transition-colors hover:bg-navy-soft"
          >
            Gunakan
          </Link>
        </div>
      </div>
    </article>
  );
}
