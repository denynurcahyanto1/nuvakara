import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  join(process.cwd(), "supabase/migrations/0001_profiles.sql"),
  "utf8",
);

describe("migration 0001_profiles", () => {
  it("membuat tabel profiles dan admin_activity_logs", () => {
    expect(sql).toMatch(/create table[^;]*profiles/i);
    expect(sql).toMatch(/create table[^;]*admin_activity_logs/i);
  });

  it("membuat trigger profile otomatis saat user dibuat", () => {
    expect(sql).toMatch(/create\s+(or replace\s+)?function\s+public\.handle_new_user/i);
    expect(sql).toMatch(/trigger[\s\S]*auth\.users/i);
  });

  it("membuat helper is_admin yang dikunci ke search_path", () => {
    expect(sql).toMatch(/create\s+(or replace\s+)?function\s+public\.is_admin/i);
    expect(sql).toMatch(/security\s+definer/i);
    expect(sql).toMatch(/set\s+search_path\s*=\s*public/i);
  });

  it("menyalakan RLS pada kedua tabel", () => {
    expect(sql).toMatch(/alter table[^;]*profiles[\s\S]*enable row level security/i);
    expect(sql).toMatch(
      /alter table[^;]*admin_activity_logs[\s\S]*enable row level security/i,
    );
  });

  it("melarang pengguna menaikkan role atau statusnya sendiri", () => {
    expect(sql).toMatch(/prevent_role_escalation/i);
    expect(sql).toMatch(/service_role/i);
  });

  it("tidak memuat kunci service role di dalam SQL", () => {
    expect(sql).not.toMatch(/eyJhbGciOi/i);
  });
});
