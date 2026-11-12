import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient, requireUser } = vi.hoisted(() => ({
  createClient: vi.fn(),
  requireUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient }));
vi.mock("@/lib/dal/auth", () => ({ requireUser }));
// revalidatePath only works inside a Next request context.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { updateProfileAction } from "@/lib/actions/profile";

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.append(key, value);
  return data;
}

describe("updateProfileAction", () => {
  beforeEach(() => {
    createClient.mockReset();
    requireUser.mockReset();
    requireUser.mockResolvedValue({
      id: "11111111-1111-1111-1111-111111111111",
      email: "guest@example.com",
      role: "user",
      status: "active",
    });
  });

  it("menolak nama yang terlalu pendek sebelum menyentuh database", async () => {
    const update = vi.fn();
    createClient.mockResolvedValue({ from: () => ({ update }) } as never);

    const result = await updateProfileAction(
      null,
      formData({ fullName: "A", phone: "", timezone: "Asia/Jakarta", avatarUrl: "" }),
    );

    expect(result.ok).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });

  it("menyimpan profil yang valid", async () => {
    const eq = vi.fn(async () => ({ error: null }));
    const update = vi.fn(() => ({ eq }));
    createClient.mockResolvedValue({ from: () => ({ update }) } as never);

    const result = await updateProfileAction(
      null,
      formData({
        fullName: "Tamu Undangan",
        phone: "081200000000",
        timezone: "Asia/Jakarta",
        avatarUrl: "",
      }),
    );

    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledOnce();
    expect(eq).toHaveBeenCalledWith("id", "11111111-1111-1111-1111-111111111111");
  });
});
