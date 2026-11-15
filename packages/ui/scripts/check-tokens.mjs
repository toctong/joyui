/**
 * Lightweight lint: flag raw palette / hex in shippable components.
 * Run: node ./scripts/check-tokens.mjs
 *
 * Design rule: prefer semantic tokens. Brand marks / decorative art keep a
 * narrow allowlist.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../src/components");

/** Intentional brand marks, social glyphs, decorative art only. */
const ALLOW = new Set([
  "social-button",
  "plan-art-flame",
  "web-search",
  "avatar",
  "theme-toggle",
  "color-picker",
  "effort-slider",
  "date-range-picker",
]);

const HEX_RE = /(?:className|class)=\{?[`"'][^`"']*#[0-9A-Fa-f]{3,8}/;
const RAW_PALETTE_RE =
  /\b(?:bg|text|border)-(?:red|green|blue|yellow|orange|purple|pink|indigo|emerald|rose|sky|violet|fuchsia|lime|amber|cyan|teal|neutral)-(?:[0-9]{2,3})\b/;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(full);
  }
  return out;
}

function isAllowed(file) {
  const parts = file.split(/[/\\]/);
  const base = path.basename(file).replace(/\.(tsx|ts)$/, "");
  if (ALLOW.has(base)) return true;
  return parts.some((p) => ALLOW.has(p));
}

const hits = [];
for (const file of walk(root)) {
  if (isAllowed(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/^\s*(\*|\/\/)/.test(line)) return;
    if (HEX_RE.test(line) || RAW_PALETTE_RE.test(line)) {
      hits.push(`${path.relative(root, file)}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (hits.length) {
  console.error(
    `check-tokens: ${hits.length} raw palette/hex hit(s) in components (not allowlisted):\n`,
  );
  for (const h of hits.slice(0, 40)) console.error(`  ${h}`);
  if (hits.length > 40) console.error(`  … +${hits.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log("check-tokens: ok");
}
