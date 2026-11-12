import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient }));

import {
  getEventBySlug,
  getEventsByOwner,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/dal/events";

const sampleEvent = {
  id: 1,
  owner_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "Test Event",
  slug: "test-event",
  description: "A test",
  is_published: true,
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function fakeClient(options: {
  singleData?: unknown;
  singleError?: { message: string } | null;
  listData?: unknown[];
  listError?: { message: string } | null;
  deleteError?: { message: string } | null;
}) {
  // Chain: from().select().eq().single()
  const single = vi.fn(async () => ({
    data: options.singleData ?? null,
    error: options.singleError ?? null,
  }));

  // Chain: from().select().eq().order()
  const order = vi.fn(async () => ({
    data: options.listData ?? null,
    error: options.listError ?? null,
  }));

  // Chain: from().delete().eq()
  const deleteEq = vi.fn(async () => ({
    error: options.deleteError ?? null,
  }));

  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single,
          order,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: deleteEq,
      })),
    })),
  } as never;
}

describe("events DAL", () => {
  beforeEach(() => {
    createClient.mockReset();
  });

  // --- getEventBySlug ---

  it("getEventBySlug returns event when found", async () => {
    createClient.mockResolvedValue(
      fakeClient({ singleData: sampleEvent }),
    );
    const result = await getEventBySlug("test-event");
    expect(result).toEqual(sampleEvent);
  });

  it("getEventBySlug returns null on error", async () => {
    createClient.mockResolvedValue(
      fakeClient({ singleError: { message: "not found" } }),
    );
    const result = await getEventBySlug("nope");
    expect(result).toBeNull();
  });

  // --- getEventsByOwner ---

  it("getEventsByOwner returns events", async () => {
    createClient.mockResolvedValue(
      fakeClient({ listData: [sampleEvent] }),
    );
    const result = await getEventsByOwner(sampleEvent.owner_id);
    expect(result).toEqual([sampleEvent]);
  });

  it("getEventsByOwner returns [] on error", async () => {
    createClient.mockResolvedValue(
      fakeClient({ listError: { message: "fail" } }),
    );
    const result = await getEventsByOwner(sampleEvent.owner_id);
    expect(result).toEqual([]);
  });

  // --- createEvent ---

  it("createEvent returns inserted row", async () => {
    createClient.mockResolvedValue(
      fakeClient({ singleData: sampleEvent }),
    );
    const result = await createEvent({
      owner_id: sampleEvent.owner_id,
      name: sampleEvent.name,
      slug: sampleEvent.slug,
    });
    expect(result).toEqual(sampleEvent);
  });

  it("createEvent returns null on error", async () => {
    createClient.mockResolvedValue(
      fakeClient({ singleError: { message: "duplicate" } }),
    );
    const result = await createEvent({
      owner_id: sampleEvent.owner_id,
      name: sampleEvent.name,
      slug: sampleEvent.slug,
    });
    expect(result).toBeNull();
  });

  // --- updateEvent ---

  it("updateEvent returns updated row", async () => {
    const updated = { ...sampleEvent, name: "Updated" };
    createClient.mockResolvedValue(
      fakeClient({ singleData: updated }),
    );
    const result = await updateEvent(1, { name: "Updated" });
    expect(result).toEqual(updated);
  });

  it("updateEvent returns null on error", async () => {
    createClient.mockResolvedValue(
      fakeClient({ singleError: { message: "fail" } }),
    );
    const result = await updateEvent(1, { name: "Updated" });
    expect(result).toBeNull();
  });

  // --- deleteEvent ---

  it("deleteEvent returns true on success", async () => {
    createClient.mockResolvedValue(fakeClient({}));
    const result = await deleteEvent(1);
    expect(result).toBe(true);
  });

  it("deleteEvent returns false on error", async () => {
    createClient.mockResolvedValue(
      fakeClient({ deleteError: { message: "fail" } }),
    );
    const result = await deleteEvent(1);
    expect(result).toBe(false);
  });
});
