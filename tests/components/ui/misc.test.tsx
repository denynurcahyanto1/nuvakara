import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";

describe("EmptyState", () => {
  it("menampilkan judul dan aksi", () => {
    render(
      <EmptyState
        title="Belum ada undangan"
        description="Buat undangan pertama Anda"
        action={{ label: "Buat", href: "/dashboard/invitations/new" }}
      />,
    );
    expect(screen.getByText("Belum ada undangan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buat" })).toHaveAttribute(
      "href",
      "/dashboard/invitations/new",
    );
  });

  it("tetap menampilkan judul tanpa aksi", () => {
    render(<EmptyState title="Kosong" description="Tidak ada data" />);
    expect(screen.getByText("Kosong")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("Logo", () => {
  it("menampilkan nama brand NUVAKARA", () => {
    render(<Logo />);
    expect(screen.getByText("NUVAKARA")).toBeInTheDocument();
  });

  it("merender tautan bila href diberikan", () => {
    render(<Logo href="/" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});

describe("Badge", () => {
  it("menampilkan teks dan varian", () => {
    render(<Badge variant="premium">Premium</Badge>);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("merender placeholder tanpa aksesibilitas membingungkan", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("SectionHeading", () => {
  it("menampilkan eyebrow, judul, dan deskripsi", () => {
    render(
      <SectionHeading
        eyebrow="Fitur"
        title="Semua yang Anda butuhkan"
        description="Dibuat untuk momen penting."
      />,
    );
    expect(screen.getByText("Fitur")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Semua yang Anda butuhkan" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dibuat untuk momen penting.")).toBeInTheDocument();
  });
});
