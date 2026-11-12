import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { PageShell } from "@/components/marketing/PageShell";
import { Pricing } from "@/components/marketing/Pricing";
import { getActivePlans } from "@/lib/dal/pricing";
import type { Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Harga",
  description:
    "Paket harga NUVAKARA. Payment gateway belum terhubung, paket yang dipilih langsung aktif tanpa transaksi apa pun.",
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

export default async function HargaPage() {
  const plans = (await getActivePlans()).map(toPlan);

  return (
    <PageShell>
      <Pricing plans={plans} />
      <CtaBanner />
    </PageShell>
  );
}
