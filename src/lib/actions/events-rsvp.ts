"use server";

import { z } from "zod";
import { createRSVP, createGuestbookMessage } from "@/lib/dal/events";

export const RSVPFormSchema = z.object({
  event_id: z.number(),
  name: z.string().min(1),
  attendance: z.boolean(),
  message: z.string().optional(),
});

export async function createRSVPAction(prevState: unknown, formData: FormData) {
  const result = RSVPFormSchema.safeParse({
    event_id: Number(formData.get("event_id")),
    name: formData.get("name"),
    attendance: formData.get("attendance") === "true",
    message: formData.get("message"),
  });

  if (!result.success) return { ok: false, error: result.error.message };

  const rsvp = await createRSVP(result.data);
  if (!rsvp) return { ok: false, error: "Gagal menyimpan RSVP" };
  
  return { ok: true };
}

export const GuestbookSchema = z.object({
  event_id: z.number(),
  name: z.string().min(1),
  content: z.string().min(1),
});

export async function createGuestbookMessageAction(prevState: unknown, formData: FormData) {
  const result = GuestbookSchema.safeParse({
    event_id: Number(formData.get("event_id")),
    name: formData.get("name"),
    content: formData.get("content"),
  });

  if (!result.success) return { ok: false, error: result.error.message };

  const message = await createGuestbookMessage(result.data);
  if (!message) return { ok: false, error: "Gagal menyimpan pesan" };

  return { ok: true };
}
