import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Navbar } from "@/components/marketing/Navbar";
import { Pricing } from "@/components/marketing/Pricing";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { getActivePlans } from "@/lib/dal/pricing";
import { templatePreviews } from "@/lib/templates-preview";
import type { Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NUVAKARA — Every Moment Deserves a Beautiful Invitation.",
  description:
    "Buat undangan digital premium untuk pernikahan, ulang tahun, wisuda, dan baby shower. RSVP, guestbook, galeri, musik, dan countdown dalam satu tautan.",
};

function toPlan(record: Awaited<ReturnType<typeof getActivePlans>>[number]): Plan {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    price: record.price,
    currency: record.currency,
    features: record.features,
    maxInvitations: record.max_invitations,
    isPremium: record.is_premium,
  };
}

export default async function HomePage() {
  const plans = (await getActivePlans()).map(toPlan);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TemplateShowcase templates={templatePreviews} limit={6} />
        <HowItWorks />
        <Pricing plans={plans} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
