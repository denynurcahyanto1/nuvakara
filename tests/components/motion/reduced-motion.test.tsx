import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * Motion reads the `prefers-reduced-motion` media query once and caches it
 * for the lifetime of the module. The stub is installed at module scope —
 * before any component mounts — so this file gets a fresh Motion cache with
 * reduced motion enabled (Vitest isolates modules per test file).
 */
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: query.includes("prefers-reduced-motion: reduce"),
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("prefers-reduced-motion", () => {
  it("Counter menampilkan nilai akhir tanpa animasi", () => {
    render(<Counter to={1250} suffix="+" />);
    expect(screen.getByText("1.250+")).toBeInTheDocument();
  });

  it("Reveal tetap menampilkan konten secara utuh", () => {
    render(<Reveal>Isi penting</Reveal>);
    expect(screen.getByText("Isi penting")).toBeVisible();
  });

  it("TextReveal tetap membacakan teks utuh dan tidak menggeser kata", () => {
    const { container } = render(<TextReveal text="Halo Dunia" />);
    expect(
      screen.getByText("Halo Dunia", { selector: ".sr-only" }),
    ).toBeInTheDocument();
    const words = container.querySelectorAll<HTMLElement>("[data-word]");
    expect(words.length).toBe(2);
    words.forEach((word) => {
      expect(word.style.transform).toBe("");
      expect(word.style.opacity).toBe("");
    });
  });
});
