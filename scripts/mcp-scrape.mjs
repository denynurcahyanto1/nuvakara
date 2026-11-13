/**
 * Loads a URL in headless Chrome via chrome-devtools-mcp and evaluates a
 * snippet of JS in the page, printing the JSON result.
 *
 * Usage:
 *   node scripts/mcp-scrape.mjs <url> "<js expression returning JSON>"
 */
import { spawn } from "node:child_process";

const [url, expression] = process.argv.slice(2);
if (!url || !expression) {
  console.error('usage: node scripts/mcp-scrape.mjs <url> "<expression>"');
  process.exit(1);
}

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "-y",
    "chrome-devtools-mcp@latest",
    "--headless",
    "--isolated",
    "--viewport=1280x900",
    "--no-page-id-routing",
  ],
  { stdio: ["pipe", "pipe", "pipe"], shell: process.platform === "win32" },
);

let nextId = 1;
const pending = new Map();
let buffer = "";

child.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  }
});

function send(method, params) {
  const id = nextId++;
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout: ${method}`)), 120_000);
    pending.set(id, {
      resolve: (v) => (clearTimeout(timer), resolve(v)),
      reject: (e) => (clearTimeout(timer), reject(e)),
    });
  });
}
const callTool = (name, args) =>
  send("tools/call", { name, arguments: args ?? {} });
const textOf = (r) =>
  Array.isArray(r?.content)
    ? r.content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
    : "";
const valueOf = (result) => {
  const txt = textOf(result);
  const blocks = [...txt.matchAll(/```(?:json|javascript|js)?\n([\s\S]*?)```/g)].map(
    (m) => m[1].trim(),
  );
  const raw = (blocks.length ? blocks[blocks.length - 1] : txt).trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "nuvakara-scrape", version: "1.0.0" },
  });
  child.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} }) + "\n",
  );

  await callTool("navigate_page", { url, type: "url" });
  await sleep(3500);
  await callTool("evaluate_script", {
    function: `async () => {
      const step = Math.round(window.innerHeight * 0.8);
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 800));
      return document.documentElement.scrollHeight;
    }`,
  });

  const res = await callTool("evaluate_script", {
    function: `() => { const out = (() => (${expression}))(); return JSON.stringify(out); }`,
  });
  console.log(JSON.stringify(valueOf(res), null, 1));
} catch (err) {
  console.error("[scrape] fatal:", err.message);
  process.exitCode = 1;
} finally {
  child.kill();
  setTimeout(() => process.exit(process.exitCode ?? 0), 300);
}
