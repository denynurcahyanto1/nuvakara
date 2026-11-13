/**
 * Audits NUVAKARA routes through chrome-devtools-mcp (MCP over stdio).
 *
 * Usage:
 *   node scripts/mcp-audit.mjs <url...>
 *   AUDIT_EMAIL=a@b.c AUDIT_PASSWORD=secret node scripts/mcp-audit.mjs <url...>
 *
 * When AUDIT_EMAIL/AUDIT_PASSWORD are present it logs in first so that
 * protected routes are audited as an authenticated user.
 *
 * For every URL: navigate -> scroll through the page (so scroll-triggered
 * reveals run) -> full-page screenshot -> console errors -> failed requests.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: node scripts/mcp-audit.mjs <url> [url...]");
  process.exit(1);
}

const OUT_DIR = ".audit";
const LABEL = process.env.AUDIT_LABEL?.trim();
const VIEWPORT = process.env.AUDIT_VIEWPORT?.trim() || "1280x900";
const FULL_PAGE = process.env.AUDIT_FULL_PAGE !== "0";
const SCROLL_Y = Number(process.env.AUDIT_SCROLL_Y || 0);
const OPEN_COVER = process.env.AUDIT_OPEN === "1";
mkdirSync(OUT_DIR, { recursive: true });

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "-y",
    "chrome-devtools-mcp@latest",
    "--headless",
    "--isolated",
    `--viewport=${VIEWPORT}`,
    "--screenshotMaxWidth=1100",
    "--no-page-id-routing",
  ],
  { stdio: ["pipe", "pipe", "pipe"], shell: process.platform === "win32" },
);

let nextId = 1;
const pending = new Map();
let buffer = "";
let stderrLog = "";

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
child.stderr.on("data", (c) => (stderrLog += c.toString()));

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
function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}
const callTool = (name, args) =>
  send("tools/call", { name, arguments: args ?? {} });

const textOf = (r) =>
  Array.isArray(r?.content)
    ? r.content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
    : "";

/** Extract the value returned by evaluate_script (wrapped in markdown fences). */
function valueOf(result) {
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
}
const imageOf = (r) =>
  Array.isArray(r?.content)
    ? r.content.find((c) => c.type === "image" && `${c.mimeType}`.startsWith("image/"))?.data ?? null
    : null;

const slugify = (u) =>
  u.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scroll the page in steps so GSAP ScrollTrigger reveals fire. */
async function scrollThrough() {
  await callTool("evaluate_script", {
    function: `async () => {
      const step = Math.round(window.innerHeight * 0.6);
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      return document.documentElement.scrollHeight;
    }`,
  });
}

/** Report sections whose computed opacity is ~0 (invisible content). */
async function invisibleSections() {
  const res = await callTool("evaluate_script", {
    function: `() => {
      const out = [];
      document.querySelectorAll("main section, main > div").forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const o = parseFloat(cs.opacity);
        if (o < 0.05 && rect.height > 40) {
          out.push({ id: el.id || null, cls: (el.className || "").toString().slice(0, 60), opacity: o, h: Math.round(rect.height) });
        }
      });
      return JSON.stringify(out);
    }`,
  });
  const txt = textOf(res);
  const m = txt.match(/\[.*\]/s);
  try {
    return m ? JSON.parse(m[0]) : [];
  } catch {
    return [];
  }
}

const report = [];

try {
  await send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "nuvakara-audit", version: "1.0.0" },
  });
  notify("notifications/initialized", {});

  const email = process.env.AUDIT_EMAIL;
  const password = process.env.AUDIT_PASSWORD;
  let login = null;

  if (email && password) {
    const base = new URL(urls[0]).origin;
    await callTool("navigate_page", { url: `${base}/login`, type: "url" });
    await sleep(1500);
    const fillRes = await callTool("evaluate_script", {
      function: `() => {
        const set = (el, value) => {
          if (!el) return false;
          const proto = Object.getPrototypeOf(el);
          const desc = Object.getOwnPropertyDescriptor(proto, "value");
          desc.set.call(el, value);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          return true;
        };
        const okEmail = set(document.querySelector('input[name="email"]'), ${JSON.stringify(email)});
        const okPass = set(document.querySelector('input[name="password"]'), ${JSON.stringify(password)});
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
        return JSON.stringify({ okEmail, okPass, form: !!form });
      }`,
    });
    console.error(`[mcp] login fill: ${textOf(fillRes).trim()}`);
    await sleep(4000);
    const urlRes = await callTool("evaluate_script", {
      function: `() => location.pathname`,
    });
    login = valueOf(urlRes);
    console.error(`[mcp] login result path: ${login}`);
  }

  for (const url of urls) {
    const entry = { url, problems: [] };
    await callTool("navigate_page", { url, type: "url" });
    await sleep(2200);

    if (OPEN_COVER) {
      const opened = await callTool("evaluate_script", {
        function: `() => {
          const button = [...document.querySelectorAll("button")].find((el) =>
            /buka undangan|lihat pratinjau/i.test(el.textContent || ""),
          );
          if (!button) return false;
          button.click();
          return true;
        }`,
      });
      entry.coverOpened = valueOf(opened) === true;
      await sleep(1400);
    }

    try {
      await scrollThrough();
    } catch (e) {
      entry.problems.push(`scroll: ${e.message}`);
    }

    const pathRes = await callTool("evaluate_script", { function: "() => location.pathname" });
    entry.finalPath = valueOf(pathRes);

    const titleRes = await callTool("evaluate_script", { function: "() => document.title" });
    entry.title = valueOf(titleRes);

    const notFound = await callTool("evaluate_script", {
      function: `() => /404|tidak ditemukan|not found/i.test(document.body.innerText.slice(0, 4000))`,
    });
    entry.notFoundText = valueOf(notFound) === true;

    try {
      entry.invisibleSections = await invisibleSections();
      if (entry.invisibleSections.length) {
        entry.problems.push(`${entry.invisibleSections.length} invisible section(s)`);
      }
    } catch (e) {
      entry.problems.push(`opacity: ${e.message}`);
    }

    try {
      if (SCROLL_Y > 0) {
        await callTool("evaluate_script", {
          function: `() => { window.scrollTo(0, ${SCROLL_Y}); return window.scrollY; }`,
        });
        await sleep(600);
      }
      const shot = await callTool("take_screenshot", { fullPage: FULL_PAGE });
      const b64 = imageOf(shot);
      if (b64) {
        const file = `${OUT_DIR}/${LABEL ? `${LABEL}-` : ""}${slugify(url)}.png`;
        writeFileSync(file, Buffer.from(b64, "base64"));
        entry.screenshot = file;
      }
    } catch (e) {
      entry.problems.push(`screenshot: ${e.message}`);
    }

    try {
      entry.console = textOf(await callTool("list_console_messages", { types: ["error"] })).slice(0, 2500);
      if (/\[error\]/.test(entry.console)) entry.problems.push("console errors");
    } catch (e) {
      entry.problems.push(`console: ${e.message}`);
    }

    try {
      const net = textOf(await callTool("list_network_requests", {}));
      const bad = net.split("\n").filter((l) => /\s(4\d\d|5\d\d)\b/.test(l) && !/favicon/.test(l)).slice(0, 20);
      entry.failedRequests = bad;
      if (bad.length) entry.problems.push(`${bad.length} failed request(s)`);
    } catch (e) {
      entry.problems.push(`network: ${e.message}`);
    }

    report.push(entry);
    console.error(`[mcp] ${url} -> ${entry.problems.join(", ") || "clean"}`);
  }

  writeFileSync(`${OUT_DIR}/report.json`, JSON.stringify({ login, report }, null, 2));
  console.log(JSON.stringify({ login, report }, null, 2));
} catch (err) {
  console.error("[mcp] fatal:", err.message);
  console.error(stderrLog.slice(-2000));
  process.exitCode = 1;
} finally {
  child.kill();
  setTimeout(() => process.exit(process.exitCode ?? 0), 500);
}

