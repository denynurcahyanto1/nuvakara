"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { updateEventAction } from "@/lib/actions/events";
import { templateCatalog } from "@/components/templates/catalog";
import { toEventInputValue } from "@/lib/datetime";
import { Database } from "@/types/database";
import { AuthActionState } from "@/lib/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

const EVENT_TYPES = [
  { value: "wedding", label: "Pernikahan" },
  { value: "birthday", label: "Ulang Tahun" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "graduation", label: "Wisuda" },
  { value: "other", label: "Lainnya" },
];

const TEMPLATES = templateCatalog.map((template) => ({
  value: template.slug,
  label: `${template.category} — ${template.name} (${template.tier})`,
}));

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-navy/10 bg-white/70 p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-display text-xl text-navy">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function EditEventForm({ event }: { event: Event }) {
  const [published, setPublished] = useState(event.is_published ?? false);

  return (
    <AuthForm
      action={async (
        prev: AuthActionState | null,
        formData: FormData,
      ): Promise<AuthActionState> => {
        const result = await updateEventAction(event.id, formData);
        if (result.ok) {
          return { ok: true };
        }
        return { ok: false, error: result.error || "Terjadi kesalahan" };
      }}
      submitLabel="Simpan Perubahan"
    >
      {() => (
        <>
          <Section eyebrow="Dasar" title="Informasi Undangan">
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
              hint={`Tautan publik: /invite/${event.slug}`}
              required
            />
            <Select
              name="event_type"
              label="Jenis Acara"
              options={EVENT_TYPES}
              defaultValue={event.event_type || "wedding"}
            />
            <Select
              name="template_slug"
              label="Template"
              options={TEMPLATES}
              defaultValue={event.template_slug || "wedding-classic"}
            />
            <Input
              name="description"
              label="Deskripsi Singkat"
              defaultValue={event.description || ""}
              placeholder="Satu atau dua kalimat tentang acara Anda"
            />
          </Section>

          <Section eyebrow="Momen" title="Detail Acara">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="host_name"
                label="Nama Penyelenggara"
                defaultValue={event.host_name || ""}
                placeholder="Contoh: Deny"
              />
              <Input
                name="partner_name"
                label="Nama Pasangan (opsional)"
                defaultValue={event.partner_name || ""}
                placeholder="Contoh: Sonya"
              />
            </div>
            <Input
              name="event_date"
              type="datetime-local"
              label="Tanggal & Waktu"
              defaultValue={toEventInputValue(event.event_date)}
            />
          </Section>

          <Section eyebrow="Lokasi" title="Tempat Acara">
            <Input
              name="venue_name"
              label="Nama Tempat"
              defaultValue={event.venue_name || ""}
              placeholder="Contoh: Grand Ballroom"
            />
            <Input
              name="venue_address"
              label="Alamat"
              defaultValue={event.venue_address || ""}
              placeholder="Alamat lengkap"
            />
            <Input
              name="city"
              label="Kota"
              defaultValue={event.city || ""}
            />
            <Input
              name="maps_url"
              type="url"
              label="URL Google Maps (opsional)"
              defaultValue={event.maps_url || ""}
              hint="Kosongkan untuk memakai peta otomatis dari alamat"
            />
          </Section>

          <Section eyebrow="Tampilan" title="Media">
            <Input
              name="cover_image"
              type="url"
              label="URL Gambar Sampul"
              defaultValue={event.cover_image || ""}
              placeholder="https://…"
            />
            <Input
              name="music_url"
              type="url"
              label="URL Musik Latar (opsional)"
              defaultValue={event.music_url || ""}
              placeholder="https://…/lagu.mp3"
            />
          </Section>

          <section className="rounded-2xl border border-navy/10 bg-white/70 p-5 sm:p-6">
            <input
              type="hidden"
              name="is_published"
              value={published ? "on" : "off"}
            />
            <Switch
              label="Publikasikan Undangan"
              checked={published}
              onChange={setPublished}
            />
            <p className="mt-2 text-xs text-muted">
              Undangan hanya dapat diakses tamu setelah dipublikasikan.
            </p>
          </section>
        </>
      )}
    </AuthForm>
  );
}
