import type { Metadata } from "next";
import { Features } from "@/components/marketing/Features";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { PageShell } from "@/components/marketing/PageShell";

export const metadata: Metadata = {
  title: "Fitur",
  description:
    "Seluruh fitur NUVAKARA: undangan digital, template premium, RSVP, guestbook, galeri, musik, countdown, peta, statistik, dan berbagi via WhatsApp.",
};

export default function FiturPage() {
  return (
    <PageShell>
      <Features />
      <CtaBanner />
    </PageShell>
  );
}
