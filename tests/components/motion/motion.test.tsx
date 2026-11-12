import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Counter } from "@/components/motion/Counter";
import { Parallax } from "@/components/motion/Parallax";
import { FloatingDecor } from "@/components/motion/FloatingDecor";
import { GradientOrb } from "@/components/motion/GradientOrb";
import { Stagger } from "@/components/motion/Stagger";
import { GradientText } from "@/components/motion/GradientText";
import { MagneticButton } from "@/components/motion/MagneticButton";

const stubReducedMotion = (enabled: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: enabled && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

// Reduced-motion behaviour lives in its own file: Motion caches the media
// query result on first use, so the stub must be installed before any
// component mounts — and per-file module isolation gives it a fresh cache.
void stubReducedMotion;

describe("Reveal", () => {
  it("merender children secara utuh (konten tidak boleh hilang)", async () => {
    render(<Reveal>Judul Undangan</Reveal>);
    await waitFor(
      () => expect(screen.getByText("Judul Undangan")).toBeVisible(),
      { timeout: 3000 },
    );
  });

  it("menerima delay dan className", () => {
    const { container } = render(
      <Reveal delay={0.2} className="kelas-uji">
        Isi
      </Reveal>,
    );
    expect(container.firstElementChild).toHaveClass("kelas-uji");
  });
});

describe("TextReveal", () => {
  it("menyediakan teks utuh untuk screen reader", () => {
    render(<TextReveal text="Every Moment Deserves" />);
    expect(
      screen.getByText("Every Moment Deserves", { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });

  it("memecah teks menjadi kata-kata yang terlihat", () => {
    const { container } = render(<TextReveal text="Halo Dunia" />);
    const words = container.querySelectorAll(".inline-block");
    expect(words.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Counter", () => {
  it("menghitung naik menuju nilai target", async () => {
    render(<Counter to={1250} />);
    await waitFor(
      () => expect(screen.getByText("1.250")).toBeInTheDocument(),
      { timeout: 5000 },
    );
  });

  it("mendukung prefix dan suffix", async () => {
    render(<Counter to={3} prefix="Rp " suffix=" jt" />);
    await waitFor(() => expect(screen.getByText("Rp 3 jt")).toBeInTheDocument(), {
      timeout: 5000,
    });
  });
});

describe("Parallax", () => {
  it("merender children", () => {
    render(<Parallax>Latar parallax</Parallax>);
    expect(screen.getByText("Latar parallax")).toBeVisible();
  });
});

describe("FloatingDecor", () => {
  it("disembunyikan dari accessibility tree sebagai ornamen", () => {
    const { container } = render(<FloatingDecor />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("GradientOrb", () => {
  it("disembunyikan dari accessibility tree", () => {
    const { container } = render(<GradientOrb />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Stagger", () => {
  it("merender children", () => {
    render(
      <Stagger>
        <div>Satu</div>
        <div>Dua</div>
      </Stagger>,
    );
    expect(screen.getByText("Satu")).toBeVisible();
    expect(screen.getByText("Dua")).toBeVisible();
  });
});

describe("GradientText", () => {
  it("merender teks dengan gradient", () => {
    render(<GradientText>NUVAKARA</GradientText>);
    expect(screen.getByText("NUVAKARA")).toBeVisible();
  });
});

describe("MagneticButton", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("merender tombol yang bisa diklik", async () => {
    const onClick = vi.fn();
    render(
      <MagneticButton onClick={onClick}>
        Mulai Sekarang
      </MagneticButton>,
    );
    screen.getByRole("button", { name: "Mulai Sekarang" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
