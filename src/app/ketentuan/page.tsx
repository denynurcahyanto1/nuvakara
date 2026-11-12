import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Ketentuan Layanan",
  description:
    "Ketentuan penggunaan platform NUVAKARA, termasuk hak pengguna, kewajiban tata kelola konten, dan batasan layanan.",
};

const sections = [
  {
    title: "Penggunaan layanan",
    body: "Dengan membuat akun, Anda menyatakan bahwa Anda berhak menggunakan platform ini. Anda bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi pada akun Anda.",
  },
  {
    title: "Konten Anda",
    body: "Anda tetap memiliki seluruh hak atas foto, teks, dan musik yang Anda unggah ke undangan. Anda memberi kami lisensi terbatas untuk memproses konten tersebut semata-mata untuk menampilkan, mendistribusikan, dan menampilkannya kembali pada halaman undangan Anda.",
  },
  {
    title: "Moderasi",
    body: "Administrator dapat menonaktifkan atau menghapus undangan yang melanggar ketentuan, memuat konten ilegal atau menipu, atau melanggar hak pihak lain. Setiap tindakan moderasi tercatat dalam log aktivitas beserta alasan dan penanggung jawabnya.",
  },
  {
    title: "Ketersediaan layanan",
    body: "Kami berusaha menjaga platform tetap tersedia, namun tidak menjamin layanan bebas gangguan. Pemeliharaan terjadwal dapat dilakukan sewaktu-waktu dan akan diumumkan sebelumnya bila memerlukan.",
  },
  {
    title: "Pembayaran",
    body: "Saat ini NUVAKARA belum terhubung ke payment gateway, sehingga tidak ada transaksi yang diproses dan tidak ada nominal yang pernah ditagihkan. Paket yang dipilih berlaku sebagai hak akses fitur di dalam platform.",
  },
  {
    title: "Perubahan ketentuan",
    body: "Ketentuan ini dapat diperbarui. Perubahan penting diumumkan lewat halaman ini dan, bila berdampak besar, melalui email kepada pengguna yang terdaftar.",
  },
];

export default function KetentuanPage() {
  return (
    <PageShell>
      <section className="container-page max-w-3xl py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Legal"
            title="Ketentuan Layanan"
            description="Terakhir diperbarui: 12 November 2026"
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.04}>
              <article>
                <h2 className="font-display text-2xl text-navy">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-navy/75">
                  {section.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
