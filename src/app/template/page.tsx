import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { PageShell } from "@/components/marketing/PageShell";
import { TemplateCatalogue } from "@/components/marketing/TemplateCatalogue";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { templatePreviews } from "@/lib/templates-preview";

export const metadata: Metadata = {
  title: "Template",
  description:
    "Sepuluh desain undangan NUVAKARA — floral, elegan, adat, minimalis, islami, vintage, animasi, game, dark, dan fleksibel — dengan filter gaya, paket, dan jenis acara.",
};

export default function TemplatePage() {
  return (
    <PageShell>
      <section className="bg-ivory py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Katalog desain"
            title="Temukan undangan yang terasa seperti Anda"
            description="Sepuluh kategori desain, empat tingkatan paket. Setiap template bisa dipakai untuk pernikahan maupun acara lain — saring sesuai kebutuhan Anda."
          />
          <div className="mt-10">
            <TemplateCatalogue templates={templatePreviews} />
          </div>
        </div>
      </section>
      <CtaBanner />
    </PageShell>
  );
}
