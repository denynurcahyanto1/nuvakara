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
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const emails = [
  "budi.phase2@example.com",
  "budi.phase2@nuvakara.test",
  "budi.santoso@gmail.com",
  "budi+phase2@gmail.com",
];

for (const email of emails) {
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: "Rahasia123" }),
  });
  const json = await response.json();
  console.log(
    email.padEnd(30),
    response.status,
    json?.error_description ?? json?.msg ?? json?.user?.id ?? JSON.stringify(json).slice(0, 120),
  );
}
