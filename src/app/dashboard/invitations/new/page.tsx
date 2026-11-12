"use client";

import { useActionState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { createEventAction } from "@/lib/actions/events";

export default function CreateEventPage() {
  const [state] = useActionState(createEventAction, null);

  return (
    <div className="container-page py-12 sm:py-16 max-w-xl">
      <h1 className="font-display text-3xl text-navy mb-6">Buat Undangan Baru</h1>
      <AuthForm action={createEventAction} submitLabel="Buat Undangan">
        {() => (
          <>
            <Input
              name="name"
              label="Nama Undangan"
              placeholder="Contoh: Pernikahan Budi & Santi"
              required
            />
            <Input
              name="slug"
              label="Slug URL"
              placeholder="contoh: wedding-budi-santi"
              hint="Hanya huruf, angka, dan tanda hubung"
              required
            />
            <Input
              name="description"
              label="Deskripsi Singkat"
              placeholder="Deskripsi undangan..."
            />
            {state?.ok && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Undangan berhasil dibuat!
              </p>
            )}
            {state?.error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {state.error}
              </p>
            )}
          </>
        )}
      </AuthForm>
    </div>
  );
}