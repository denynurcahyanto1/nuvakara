"use server";

import { updateRSVP, deleteRSVP } from "@/lib/dal/events";
import { revalidatePath } from "next/cache";

export async function toggleAttendance(rsvpId: number, currentStatus: boolean) {
  const result = await updateRSVP(rsvpId, { attendance: !currentStatus });
  if (result) {
    revalidatePath("/dashboard/invitations/[id]/guests", "page");
    return { ok: true };
  }
  return { ok: false, error: "Gagal memperbarui status" };
}

export async function deleteRSVPAction(rsvpId: number, eventId: number) {
  const success = await deleteRSVP(rsvpId);
  if (success) {
    revalidatePath("/dashboard/invitations/[id]/guests", "page");
    return { ok: true };
  }
  return { ok: false, error: "Gagal menghapus data tamu" };
}
