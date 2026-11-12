import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

describe("Input", () => {
  it("mengaitkan label, error, dan aria-invalid", () => {
    render(<Input name="email" label="Email" error="Format email tidak valid" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Format email tidak valid");
  });

  it("meny Describes input dengan hint yang benar", () => {
    render(<Input name="slug" label="Slug" hint="Dipakai pada URL" />);
    const input = screen.getByLabelText("Slug");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "Dipakai pada URL",
    );
  });
});

describe("Textarea", () => {
  it("mengaitkan label dan error", () => {
    render(<Textarea name="pesan" label="Pesan" error="Wajib diisi" />);
    expect(screen.getByLabelText("Pesan")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Wajib diisi");
  });
});

describe("Select", () => {
  it("merender opsi dan melaporkan nilai terpilih", () => {
    render(
      <Select
        name="kehadiran"
        label="Kehadiran"
        value="hadir"
        options={[
          { value: "hadir", label: "Hadir" },
          { value: "tidak", label: "Tidak hadir" },
        ]}
      />,
    );
    expect(screen.getByLabelText("Kehadiran")).toHaveValue("hadir");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });
});
