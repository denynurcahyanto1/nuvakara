/**
 * Regenerates src/types/database.ts from the live Supabase project.
 *
 * Usage: node scripts/generate-types.mjs
 *
 * Reads SUPABASE_DB_URL from .env.local (gitignored) or the environment.
 * The output is written as UTF-8 — piping the CLI straight through a shell
 * redirect produces UTF-16 on Windows, which ESLint then reads as binary.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

function loadEnv() {
  const file = resolve(".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnv();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("SUPABASE_DB_URL is missing. Put it in .env.local.");
  process.exit(1);
}

const npx = join(
  dirname(process.execPath),
  process.platform === "win32" ? "npx.cmd" : "npx",
);

let output;
try {
  // Node refuses to spawn a .cmd directly (EINVAL), so the shell handles it.
  // The path and the URL are quoted, so neither cmd.exe nor the shell can
  // split them on spaces or special characters.
  const command = `"${npx}" supabase gen types typescript --remote="${dbUrl}" --schema public`;

  output = execFileSync(command, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
    shell: true,
  });
} catch {
  // Never echo the arguments: they contain the database password.
  console.error("supabase gen types failed.");
  process.exit(1);
}

writeFileSync("src/types/database.ts", output, "utf8");
console.log(
  `src/types/database.ts regenerated (${output.split("\n").length} lines)`,
);
