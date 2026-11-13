import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "@/components/marketing/Features";
import { Pricing } from "@/components/marketing/Pricing";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { templatePreviews } from "@/lib/templates-preview";

describe("Features", () => {
  it("merender 10 fitur dari konfigurasi brand", () => {
    render(<Features />);
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });

  it("menampilkan judul fitur sesuai spec", () => {
    render(<Features />);
    expect(screen.getByText("Berbagai template premium")).toBeInTheDocument();
    expect(screen.getByText("Bagikan undangan melalui WhatsApp")).toBeInTheDocument();
  });
});

describe("TemplateShowcase", () => {
  it("merender 4 template dengan tombol preview dan gunakan", () => {
    render(<TemplateShowcase templates={templatePreviews} />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: /preview/i })).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: /gunakan template/i })).toHaveLength(4);
  });

  it("mengarahkan ke template yang dipilih saat memakai template", () => {
    render(<TemplateShowcase templates={templatePreviews} />);
    expect(
      screen.getAllByRole("link", { name: /gunakan template/i })[0],
    ).toHaveAttribute("href", "/register?template=wedding-classic");
  });
});

describe("HowItWorks", () => {
  it("merender 5 langkah", () => {
    render(<HowItWorks />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("menaruh <li> langsung di dalam <ol> agar struktur list valid untuk screen reader", () => {
    const { container } = render(<HowItWorks />);
    expect(container.querySelectorAll("ol > li")).toHaveLength(5);
  });
});

describe("SectionHeading", () => {
  it("memakai gold-deep untuk teks di latar terang (kontras >= 4.5:1)", () => {
    render(<SectionHeading eyebrow="Fitur" title="Judul" />);
    expect(screen.getByText("Fitur").className).toContain("text-gold-deep");
  });

  it("memakai gold pada latar gelap", () => {
    render(<SectionHeading eyebrow="Cara Kerja" title="Judul" tone="dark" />);
    expect(screen.getByText("Cara Kerja").className).toContain("text-gold");
  });
});

describe("Pricing", () => {
  it("menampilkan empty state, bukan harga palsu, saat belum ada paket", () => {
    render(<Pricing plans={[]} />);
    expect(
      screen.getByText(/paket harga sedang disiapkan/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Rp\s?0/)).toBeNull();
  });

  it("menampilkan paket yang diberikan", () => {
    render(
      <Pricing
        plans={[
          {
            id: "free",
            name: "Gratis",
            price: 0,
            currency: "IDR",
            features: ["1 undangan"],
            maxInvitations: 1,
            isPremium: false,
          },
        ]}
      />,
    );
    expect(screen.getByText("Gratis")).toBeInTheDocument();
    expect(screen.getByText("1 undangan")).toBeInTheDocument();
  });

  it("menyatakan bahwa pembayaran belum tersedia", () => {
    render(
      <Pricing
        plans={[
          {
            id: "free",
            name: "Gratis",
            price: 0,
            currency: "IDR",
            features: ["1 undangan"],
            maxInvitations: 1,
            isPremium: false,
          },
        ]}
      />,
    );
    expect(screen.getByText(/pembayaran/i)).toBeInTheDocument();
  });
});
