import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/marketing/Navbar";

describe("Navbar", () => {
  it("menampilkan link navigasi utama dan CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Fitur" })).toHaveAttribute(
      "href",
      "/#fitur",
    );
    expect(screen.getByRole("link", { name: "Buat Undangan" })).toBeInTheDocument();
  });

  it("membuka dan menutup menu mobile", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    await userEvent.click(toggle);
    expect(screen.getByRole("dialog", { name: /menu navigasi/i })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("memastikan target sentuh minimal 44px pada kontrol mobile", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle.className).toMatch(/min-h-11|min-w-11|h-11|w-11/);
    await userEvent.click(toggle);
    const close = screen.getByRole("button", { name: /tutup/i });
    expect(close.className).toMatch(/min-h-11|min-w-11|h-11|w-11/);
  });

  it("memberi aria-expanded pada tombol menu", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
