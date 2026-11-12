import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "NUVAKARA membangun undangan digital yang tampilannya setara desainer, tanpa perlu software rumit yang harus dipelajari.",
};

const values = [
  {
    title: "Kualitas tanpa ribet",
    body: "Setiap detail visual — tipografi, jarak, animasi — dikerjakan supaya hasilnya terasa seperti dikerjakan oleh desainer, bukan sekadar template bawaan.",
  },
  {
    title: "Dibuat untuk ponsel",
    body: "Mayoritas tamu membuka undangan lewat WhatsApp di ponsel. Karena itu setiap template dirancang mobile-first, ringan, dan tetap rapi di layar kecil.",
  },
  {
    title: "Data di tangan Anda",
    body: "Setiap undangan, RSVP, dan ucapan tersimpan di database milik Anda sendiri, dengan Row Level Security yang mencegah data bocor antar pengguna.",
  },
  {
    title: "Jujur soal batasan",
    body: "Kami tidak menampilkan pembayaran palsu atau statistik karangan. Fitur yang belum terhubung akan ditandai apa adanya.",
  },
];

export default function TentangPage() {
  return (
    <PageShell>
      <section className="container-page py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Tentang Kami"
            title="Undangan yang layak dikenang dimulai dari detail yang benar"
            description="NUVAKARA adalah platform undangan digital premium. Kami percaya undangan yang baik membuat tamu merasa nyaman sebelum hari-H bahkan datang."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.06}>
              <article className="h-full rounded-[var(--radius-card)] border border-navy/10 bg-white p-7 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-2xl text-navy">{value.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-navy/70">
                  {value.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner />
    </PageShell>
  );
}
