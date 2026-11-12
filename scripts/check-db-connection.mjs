import { Client } from "pg";
import { readFileSync } from "node:fs";

const envs = {};
readFileSync(".env.local", "utf8")
  .split(/\r?\n/)
  .forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) envs[m[1]] = m[2].trim();
  });

const url = envs.SUPABASE_DB_URL;
const ref = url.match(/db\.([a-z]+)\.supabase\.co/)[1];

async function probe(label, connectionString) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });
  try {
    await client.connect();
    const v = await client.query("select version()");
    const t = await client.query(
      "select table_name from information_schema.tables where table_schema = 'public' order by 1",
    );
    const f = await client.query(
      "select table_name from information_schema.tables where table_schema = 'storage' order by 1",
    );
    console.log(`${label} OK`);
    console.log("  version:", v.rows[0].version.split(",")[0]);
    console.log("  public tables:", t.rows.map((r) => r.table_name).join(", ") || "(kosong)");
    console.log("  storage tables:", f.rows.map((r) => r.table_name).join(", ") || "(kosong)");
    await client.end();
    return true;
  } catch (error) {
    console.log(`${label} FAIL:`, error.message);
    try { await client.end(); } catch {}
    return false;
  }
}

const directOk = await probe("DIRECT", url);
if (!directOk) {
  const pooler = url
    .replace(`db.${ref}.supabase.co`, "aws-0-ap-southeast-1.pooler.supabase.com")
    .replace(":5432", ":6543")
    .replace("postgresql://postgres:", `postgresql://postgres.${ref}:`);
  await probe("POOLER", pooler);
}
