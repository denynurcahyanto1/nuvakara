import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  for (const line of readFileSync(resolve(".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];

if (!email) {
  console.error("usage: node scripts/delete-test-user.mjs <email>");
  process.exit(1);
}

// find the user
const list = await fetch(
  `${url}/auth/v1/admin/users?page=1&per_page=200`,
  { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
);
const json = await list.json();
const users = json?.users ?? [];
const target = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (!target) {
  console.log(`tidak ada user dengan email ${email}`);
  process.exit(0);
}

const deleted = await fetch(`${url}/auth/v1/admin/users/${target.id}`, {
  method: "DELETE",
  headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
});

console.log(`hapus ${email}: ${deleted.status}`);
