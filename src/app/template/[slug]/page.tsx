import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { registry, TemplateDispatcher } from "@/components/templates/registry";
import { demoTemplateData } from "@/lib/templates-demo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = registry[slug];
  if (!template) return { title: "Template tidak ditemukan" };

  return {
    title: `Pratinjau ${template.name}`,
    description: `Lihat contoh undangan digital dengan template ${template.name} dari NUVAKARA.`,
  };
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { slug } = await params;
  const template = registry[slug];
  const data = demoTemplateData[slug];

  if (!template || !data) {
    notFound();
  }

  return (
    <div>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-[#C6A15B]/30 bg-[#141C2B] px-4 py-2.5 text-[#FBF7F0]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#E3C68D]">
          Pratinjau &middot; {template.name}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/template"
            className="rounded-full border border-[#E3C68D]/40 px-3 py-1 text-xs hover:bg-white/10"
          >
            Semua template
          </Link>
          <Link
            href={`/register?template=${template.slug}`}
            className="rounded-full bg-[#C6A15B] px-4 py-1 text-xs font-semibold text-[#141C2B] hover:bg-[#E3C68D]"
          >
            Gunakan template
          </Link>
        </div>
      </div>

      <TemplateDispatcher
        slug={template.slug}
        data={data as unknown as Record<string, unknown>}
      />

      <div className="border-t border-[#C6A15B]/20 bg-[#FBF7F0] px-4 py-10 text-center">
        <p className="font-display text-2xl text-[#141C2B]">
          Siap membuat undangan Anda?
        </p>
        <p className="mt-2 text-sm text-[#141C2B]/60">
          Mulai gratis, pilih template ini, lalu bagikan satu tautan ke tamu Anda.
        </p>
        <Link
          href={`/register?template=${template.slug}`}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#141C2B] px-6 text-sm font-medium text-[#FBF7F0] transition hover:bg-[#1F2A3D]"
        >
          Buat undangan dengan {template.name}
        </Link>
      </div>
    </div>
  );
}
