import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("merender anchor ketika href diberikan", () => {
    render(<Button href="/daftar">Buat Undangan</Button>);
    const link = screen.getByRole("link", { name: "Buat Undangan" });
    expect(link).toHaveAttribute("href", "/daftar");
  });

  it("menonaktifkan dan menandai busy saat isLoading", () => {
    render(<Button isLoading>Simpan</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("memanggil onClick saat ditekan", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Kirim</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("memiliki target sentuh minimal 44px pada semua ukuran", () => {
    const { rerender } = render(<Button size="sm">Kecil</Button>);
    expect(screen.getByRole("button").className).toMatch(/h-11|min-h-11/);
    rerender(<Button size="md">Sedang</Button>);
    expect(screen.getByRole("button").className).toMatch(/h-12|min-h-11/);
    rerender(<Button size="lg">Besar</Button>);
    expect(screen.getByRole("button").className).toMatch(/h-14|min-h-11/);
  });

  it("merender ikon kiri dan kanan", () => {
    render(
      <Button
        leftIcon={<span data-testid="left">L</span>}
        rightIcon={<span data-testid="right">R</span>}
      >
        Ikon
      </Button>,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });
});
