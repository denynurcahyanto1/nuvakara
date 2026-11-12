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
const password = process.argv[3] ?? "Rahasia123";

if (!email) {
  console.error("usage: node scripts/create-test-user.mjs <email> [password]");
  process.exit(1);
}

const response = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Budi Santoso" },
  }),
});

const json = await response.json();
const user = Array.isArray(json?.users) ? json.users[0] : json;

if (!user?.id) {
  console.error("gagal membuat user:", JSON.stringify(json).slice(0, 300));
  process.exit(1);
}

console.log(JSON.stringify({ id: user.id, email: user.email }));
