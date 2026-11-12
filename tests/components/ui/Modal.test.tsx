import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("menutup dengan tombol Escape", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Hapus Undangan">
        Isi
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("tidak merender saat open=false", () => {
    render(
      <Modal open={false} onClose={() => {}} title="X">
        Isi
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("menutup saat backdrop diklik", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Hapus Undangan">
        Isi
      </Modal>,
    );
    const backdrop = screen.getByTestId("modal-backdrop");
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan judul, deskripsi, dan footer", () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="Hapus Undangan"
        description="Tindakan ini tidak bisa dibatalkan."
        footer={<button type="button">Hapus</button>}
      >
        Isi
      </Modal>,
    );
    expect(screen.getByRole("heading", { name: "Hapus Undangan" })).toBeInTheDocument();
    expect(screen.getByText("Tindakan ini tidak bisa dibatalkan.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hapus" })).toBeInTheDocument();
  });

  it("memindahkan fokus ke dialog saat dibuka", () => {
    render(
      <Modal open onClose={() => {}} title="Fokus">
        <button type="button">Dalam</button>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveFocus();
  });
});
