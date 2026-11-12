import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { PageShell } from "@/components/marketing/PageShell";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { templatePreviews } from "@/lib/templates-preview";

export const metadata: Metadata = {
  title: "Template",
  description:
    "Empat template NUVAKARA dengan karakter visual berbeda: Wedding Classic, Birthday Celebration, Baby Shower, dan Graduation Modern.",
};

export default function TemplatePage() {
  return (
    <PageShell>
      <TemplateShowcase templates={templatePreviews} />
      <CtaBanner />
    </PageShell>
  );
}
