/**
 * Prints every user-facing string literal in src/ so copy can be proofread
 * for spliced-in glitches. Run: node scripts/proofread-copy.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
  return files;
}

const skipPattern = /\$\{|className|href=|src=|rel=|aria-|role=|type=|id=|https?:|^\/|^[a-z-]+$/i;
const lines = [];

for (const file of walk("src")) {
  const source = readFileSync(file, "utf8");
  const pattern = /"([^"\\\n]{18,})"/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const value = match[1];
    if (skipPattern.test(value)) continue;
    if (/^[a-z0-9:/[\].#-]+$/i.test(value)) continue;
    if (!/\s/.test(value)) continue;
    const line = source.slice(0, match.index).split("\n").length;
    lines.push(`${file.replace(/\\/g, "/")}:${line}  ${value}`);
  }
}

console.log(lines.join("\n"));
