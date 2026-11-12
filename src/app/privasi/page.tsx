import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Bagaimana NUVAKARA mengumpulkan, menggunakan, dan melindungi data Anda serta data tamu undangan Anda.",
};

const sections = [
  {
    title: "Data yang kami kumpulkan",
    body: "Kami menyimpan data akun yang Anda berikan saat pendaftaran: nama, email, nomor telepon, dan foto profil bila diunggah. Untuk undangan, kami menyimpan detail acara, daftar RSVP, ucapan guestbook, dan catatan kunjungan tamu. Kami tidak menyimpan kata sandi Anda dalam bentuk yang dapat dibaca — kata sandi ditangani oleh layanan autentikasi dan disimpan dalam bentuk hash satu arah.",
  },
  {
    title: "Penggunaan data",
    body: "Data akun digunakan untuk menjalankan fitur yang Anda minta: membuat undangan, mengelola tamu, dan menampilkan statistik. Data tamu digunakan untuk menampilkan RSVP dan ucapan pada halaman undangan Anda. Kami tidak menjual data kepada pihak ketiga dan tidak menggunakan data tamu untuk iklan pihak lain.",
  },
  {
    title: "Berbagi dan penyimpanan",
    body: "Data disimpan pada basis data PostgreSQL dengan Row Level Security, sehingga setiap pengguna hanya dapat membaca barisnya sendiri. Foto dan berkas yang Anda unggah disimpan pada penyimpanan objek milik proyek dan hanya dapat diakses melalui tautan yang bersifat publik atau daftar akun Anda sendiri.",
  },
  {
    title: "Hak Anda",
    body: "Anda dapat mengubah data akun kapan saja melalui halaman Pengaturan Akun, menonaktifkan publikasi undangan, atau menghapus undangan beserta data tamu di dalamnya. Menghapus akun akan menghapus profil dan seluruh undangan yang Anda miliki.",
  },
  {
    title: "Keamanan",
    body: "Kami menerapkan pembatasan akses berbasis peran di sisi server, validasi input pada setiap permintaan, dan pembatasan laju pada endpoint publik untuk mengurangi penyalahgunaan. Setiap tindakan penting oleh administrator tercatat dalam log aktivitas.",
  },
];

export default function PrivasiPage() {
  return (
    <PageShell>
      <section className="container-page max-w-3xl py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Legal"
            title="Kebijakan Privasi"
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
