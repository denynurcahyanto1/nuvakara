/**
 * Applies every SQL file in supabase/migrations to the project, in filename
 * order, once. Applied files are recorded in public.schema_migrations.
 *
 * Usage:
 *   node scripts/apply-migrations.mjs          # apply pending migrations
 *   node scripts/apply-migrations.mjs --check  # only report what is pending
 *
 * Reads SUPABASE_DB_URL from .env.local (gitignored) or the environment.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { Client } from "pg";

function loadEnv() {
  const file = resolve(".env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  }
}

loadEnv();

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error(
    "SUPABASE_DB_URL is missing. Put it in .env.local (see .env.example).",
  );
  process.exit(1);
}

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const files = existsSync(migrationsDir)
  ? readdirSync(migrationsDir)
      .filter((name) => name.endsWith(".sql"))
      .sort()
  : [];

const checkOnly = process.argv.includes("--check");

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  await client.query(`
    create table if not exists public.schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const { rows } = await client.query(
    "select name from public.schema_migrations order by name",
  );
  const applied = new Set(rows.map((row) => row.name));
  const pending = files.filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log(`All ${files.length} migration(s) already applied.`);
    process.exit(0);
  }

  console.log(
    `Pending: ${pending.length} of ${files.length} migration(s) -> ${pending.join(", ")}`,
  );

  if (checkOnly) {
    process.exit(0);
  }

  for (const file of pending) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`Applying ${file} ...`);
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query(
        "insert into public.schema_migrations (name) values ($1) on conflict do nothing",
        [file],
      );
      await client.query("commit");
      console.log(`  ok ${file}`);
    } catch (error) {
      await client.query("rollback");
      console.error(`  FAILED ${file}: ${error.message}`);
      process.exit(1);
    }
  }

  console.log("Done.");
} finally {
  await client.end().catch(() => {});
}
