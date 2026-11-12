import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const files = [];
function walk(dir, filter) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter);
    else if (filter.test(entry.name)) files.push(full);
  }
}
walk("src", /\.(ts|tsx|css|mjs)$/);
walk("docs", /\.(md|mjs)$/);
walk("scripts", /\.(mjs|md)$/);

const allowed = "–—‘’“”•✓→×≈≤≥€£¥°®©…«»‹›";
let found = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const bad = [...new Set([...source].filter((c) => c.codePointAt(0) > 0x2fff && !allowed.includes(c)))];
  if (bad.length) {
    found += 1;
    console.log(`${file}: ${bad.join(" ")}`);
  }
}

console.log(found ? `${found} file(s) dengan karakter asing` : "bersih: tidak ada karakter asing tersisa");
