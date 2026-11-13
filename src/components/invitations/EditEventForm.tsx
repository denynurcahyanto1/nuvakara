"use client";

import { useActionState, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { updateEventAction } from "@/lib/actions/events";
import { Database } from "@/types/database";
import { AuthActionState } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export function EditEventForm({ event }: { event: Event }) {
  const [published, setPublished] = useState(event.is_published ?? false);

  return (
    <AuthForm 
        action={async (prev: AuthActionState | null, formData: FormData): Promise<AuthActionState> => {
            const result = await updateEventAction(event.id, formData);
            if (result.ok) {
                return { ok: true };
            }
            return { ok: false, error: result.error || "Unknown error" };
        }} 
        submitLabel="Simpan Perubahan"
    >
      {() => (
        <>
          <Input
            name="name"
            label="Nama Undangan"
            defaultValue={event.name}
            required
          />
          <Input
            name="slug"
            label="Slug URL"
            defaultValue={event.slug}
            required
          />
          <Input
            name="description"
            label="Deskripsi Singkat"
            defaultValue={event.description || ""}
          />
          <input type="hidden" name="is_published" value={published ? "on" : "off"} />
          <Switch
            label="Publikasikan Undangan"
            checked={published}
            onChange={setPublished}
          />
        </>
      )}
    </AuthForm>
  );
}
