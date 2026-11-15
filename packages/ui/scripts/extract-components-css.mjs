/**
 * One-shot / reusable helper: build apps/docs/styles/components.css from
 * globals.css by stripping docs-only chrome (landing glass, showcase, app shell).
 *
 * Prefer editing components.css directly going forward; this script is for
 * bootstrap and recovery. sync-from-docs copies components.css into the package.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const globalsPath = path.join(repoRoot, "apps/docs/styles/globals.css");
const outPath = path.join(repoRoot, "apps/docs/styles/components.css");

const src = fs.readFileSync(globalsPath, "utf8");

let body = src;

// Drop docs entry preamble through direction variants (re-added in package entry / globals).
body = body.replace(/^[\s\S]*?@custom-variant ltr \(&:dir\(ltr\)\);\s*/m, "");

// Drop view-transition "disable native crossfade" block (docs ThemeToggle).
body = body.replace(
  /\/\* The next theme is revealed[\s\S]*?unsupported browsers simply ignore these rules\. \*\/\s*::view-transition-old\(root\),[\s\S]*?mix-blend-mode: normal;\s*\}\s*/m,
  "",
);

// Drop html/body app chrome.
body = body.replace(
  /\/\* Reset \+ base \*\/[\s\S]*?body \{[\s\S]*?color: var\(--color-text-primary\);\s*\}\s*/m,
  "",
);

// Drop liquid-glass landing styles.
body = body.replace(
  /\/\* Liquid glass[\s\S]*?\.lg-host:hover \{[\s\S]*?transform: none;\s*\}\s*\}\s*/m,
  "",
);

// Drop showcase cards (docs index / landing).
body = body.replace(
  /\/\* Showcase card[\s\S]*?box-shadow: inset 0 0 0 2px var\(--color-border-button-hover\);\s*\}\s*\}\s*/m,
  "",
);

const mustHave = [
  ".bui-table",
  ".bui-skeleton",
  ".bui-agent-thinking-label",
  ".animate-bar-rise",
  ".bui-border-beam-glow",
  ".contributions-grid",
  ".agent-progress-loading-text",
  ".bui-composer-mic-bar",
  "@utility shadow-sm",
];

const mustNot = [".landing-glass-stroke", ".landing-showcase-card", ".lg-host"];

for (const needle of mustHave) {
  if (!body.includes(needle)) {
    console.error(`extract failed: missing ${needle}`);
    process.exit(1);
  }
}
for (const bad of mustNot) {
  if (body.includes(bad)) {
    console.error(`extract failed: still contains docs-only ${bad}`);
    process.exit(1);
  }
}

const header = `/**
 * JoyUI component styles shared by docs and the npm package.
 *
 * Source of truth for Table, Skeleton, AgentThinking, charts, effects, etc.
 * Copied into @joyui/react by packages/ui/scripts/sync-from-docs.mjs.
 *
 * Docs-only chrome (landing glass, showcase cards, html/body shell) stays in
 * globals.css and is never published.
 */

`;

fs.writeFileSync(outPath, `${header}${body.trim()}\n`);
console.log(
  `wrote ${path.relative(repoRoot, outPath)} (${body.trim().split(/\n/).length} lines)`,
);
