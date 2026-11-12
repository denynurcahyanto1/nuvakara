/**
 * Builds src/app/favicon.ico from PNG sources (PNG-embedded ICO entries).
 * Run: node scripts/build-favicon.mjs
 * Expects 16/32/48 px PNGs of the NUVAKARA emblem in %TEMP%/nuvakara-ico.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sizes = [16, 32, 48];
const tmp = join(tmpdir(), "nuvakara-ico");

const entries = sizes.map((size) => {
  const png = readFileSync(join(tmp, `${size}.png`));
  return { size, png };
});

const headerSize = 6;
const entrySize = 16;
const dataOffset = headerSize + entrySize * entries.length;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4);

const directory = Buffer.alloc(entrySize * entries.length);
entries.forEach((entry, index) => {
  const offset = index * entrySize;
  directory.writeUInt8(entry.size === 256 ? 0 : entry.size, offset + 0); // width
  directory.writeUInt8(entry.size === 256 ? 0 : entry.size, offset + 1); // height
  directory.writeUInt8(0, offset + 2); // palette
  directory.writeUInt8(0, offset + 3); // reserved
  directory.writeUInt16LE(1, offset + 4); // color planes
  directory.writeUInt16LE(32, offset + 6); // bits per pixel
  directory.writeUInt32LE(entry.png.length, offset + 8);
  directory.writeUInt32LE(dataOffset + entries.slice(0, index).reduce((sum, e) => sum + e.png.length, 0), offset + 12);
});

const ico = Buffer.concat([header, directory, ...entries.map((entry) => entry.png)]);
writeFileSync("src/app/favicon.ico", ico);
console.log(`favicon.ico written (${ico.length} bytes, ${entries.length} sizes)`);
