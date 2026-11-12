import { readFileSync, writeFileSync } from "node:fs";

const path = "docs/superpowers/qa/phase2-checklist.md";
let source = readFileSync(path, "utf8");

// Normalise any non-latin characters that slipped into the copy.
source = source.replace(/[^\x00-\x7F]/gu, (char) => {
  const code = char.codePointAt(0);
  // Keep the typographic characters we use on purpose (en/em dash, curly
  // quotes, bullet, checkmark, arrow); replace anything else.
  const keep = [
    "–", "—", "‘", "’", "“", "”", "•", "✓", "→", "×", "≈", "≤", "≥",
    "€", "£", "¥",
  ];
  if (keep.includes(char)) return char;
  return "";
});

source = source.replace(
  /\(teruji unit, [^)]*\)/g,
  "(teruji unit: redirect membawa suspended=1)",
);
source = source.replace("— lihat catatan di atas", "— lihat catatan di atas");

writeFileSync(path, source);

const suspect = source
  .split("\n")
  .filter((line) => /[^\x00-\x7F]/u.test(line))
  .map((line) => line.trim().slice(0, 120));

console.log(suspect.length ? suspect.join("\n") : "bersih: tidak ada karakter non-latin tersisa");
