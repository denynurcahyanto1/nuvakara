/**
 * One-off: extracts the design catalogue (cards + tags + filter chips) from
 * https://our-wedding.link/design through chrome-devtools-mcp.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

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
const callTool = (name, args) => send("tools/call", { name, arguments: args ?? {} });
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

const PAGE_JS = `() => {
  const clean = (s) => (s || "").replace(/\\s+/g, " ").trim();

  // Filter chips: buttons/links near the top of the catalogue.
  const chips = [...document.querySelectorAll("button, [role=tab], a")]
    .map((el) => clean(el.innerText))
    .filter((t) => t && t.length <= 24);

  // Cards: anchors pointing at /design/detail or /design/coba.
  const cards = [...document.querySelectorAll("a[href*='/design/']")]
    .map((a) => {
      const href = a.getAttribute("href") || "";
      const text = clean(a.innerText);
      const tagNodes = [...a.querySelectorAll("li, span")].map((n) => clean(n.innerText)).filter(Boolean);
      return { href, text, tagNodes: tagNodes.slice(0, 20) };
    })
    .filter((c) => c.href.includes("/design/detail/") || c.href.includes("/design/coba/"));

  // All visible text as a fallback so nothing is missed.
  return { chips: [...new Set(chips)], cards };
}`;

try {
  await send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "nuvakara-scrape", version: "1.0.0" },
  });
  child.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} }) + "\n",
  );

  await callTool("navigate_page", { url: "https://our-wedding.link/design", type: "url" });
  await sleep(4000);

  for (let i = 0; i < 8; i += 1) {
    await callTool("evaluate_script", {
      function: `async () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => setTimeout(r, 500));
        return document.querySelectorAll("a[href*='/design/detail/']").length;
      }`,
    });
  }

  const res = await callTool("evaluate_script", { function: PAGE_JS });
  const data = valueOf(res);
  writeFileSync(".audit/ourwedding-catalog.json", JSON.stringify(data, null, 1));
  console.log(
    JSON.stringify(
      {
        chips: data.chips,
        cardCount: data.cards?.length ?? 0,
        firstCards: (data.cards ?? []).slice(0, 12),
      },
      null,
      1,
    ),
  );
} catch (err) {
  console.error("[scrape] fatal:", err.message);
  process.exitCode = 1;
} finally {
  child.kill();
  setTimeout(() => process.exit(process.exitCode ?? 0), 300);
}
