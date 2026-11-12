/**
 * Smoke test for the authentication flow against the live Supabase project.
 *
 * Verifies, with the real project:
 *   1. a user can be created (confirmed) through the admin API
 *   2. the profile row is created automatically by the database trigger
 *   3. the user can sign in with the anon key and get a session
 *   4. the anon key cannot read other users' profiles (Row Level Security)
 *   5. a signed-in user cannot change their own role
 *
 * Usage: node scripts/smoke-auth.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const file = resolve(".env.local");
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}

const stamp = Date.now();
const email = `smoke-${stamp}@nuvakara.test`;
const password = "SmokeTest123";

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function api(path, { method = "GET", key, body, token } = {}) {
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token ?? key}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: response.status, json };
}

let userId = null;

try {
  // 1. create a confirmed user through the admin API
  const created = await api("/auth/v1/admin/users", {
    method: "POST",
    key: serviceKey,
    body: {
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Smoke Test" },
    },
  });

  const createdUser = Array.isArray(created.json?.users)
    ? created.json.users[0]
    : created.json;
  userId = createdUser?.id ?? null;

  check("user dibuat lewat admin API", created.status === 200 && Boolean(userId), `status ${created.status}`);

  // 2. the profile row is created by the trigger
  const profile = await api(`/rest/v1/profiles?id=eq.${userId}&select=id,email,role,status`, {
    key: serviceKey,
  });
  const row = Array.isArray(profile.json) ? profile.json[0] : null;

  check(
    "profil dibuat otomatis oleh trigger",
    Boolean(row) && row.role === "user" && row.status === "active",
    row ? `role=${row.role} status=${row.status}` : "tidak ada baris",
  );

  // 3. sign in with the anon key
  const signedIn = await api("/auth/v1/token?grant_type=password", {
    method: "POST",
    key: anonKey,
    body: { email, password },
  });
  const accessToken = signedIn.json?.access_token;

  check(
    "login menghasilkan session",
    signedIn.status === 200 && Boolean(accessToken),
    `status ${signedIn.status}`,
  );

  // 4. the anon key cannot read profiles it does not own
  const anonProfiles = await api("/rest/v1/profiles?select=id,email", { key: anonKey });
  const anonRows = Array.isArray(anonProfiles.json) ? anonProfiles.json : [];

  check(
    "anon tidak bisa membaca profil milik orang lain (RLS)",
    anonRows.length === 0,
    `${anonRows.length} baris terbaca`,
  );

  // 5. a signed-in user cannot escalate their own role
  const escalation = await api(`/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    key: anonKey,
    token: accessToken,
    body: { role: "admin" },
  });

  const after = await api(`/rest/v1/profiles?id=eq.${userId}&select=role`, {
    key: serviceKey,
  });
  const roleAfter = Array.isArray(after.json) ? after.json[0]?.role : undefined;

  check(
    "pengguna tidak bisa menaikkan role-nya sendiri",
    roleAfter === "user",
    `role setelah percobaan: ${roleAfter} (http ${escalation.status})`,
  );
} finally {
  // cleanup: remove the test user
  if (userId) {
    await api(`/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      key: serviceKey,
    });
  }
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} pemeriksaan lolos.`);
process.exit(failed.length === 0 ? 0 : 1);
