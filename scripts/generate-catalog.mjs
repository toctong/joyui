/**
 * Generate CLI catalog + skill references from @joyui/react barrel exports.
 * Run: node ./scripts/generate-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "packages/ui/src/index.ts");
const composerPath = path.join(root, "packages/ui/src/composer.ts");
const aiPath = path.join(root, "packages/ui/src/ai.ts");

const MANUAL = [
  {
    name: "utils",
    title: "Utils",
    description: "cn/cx class merge helpers.",
    type: "lib",
    layer: "lib",
    exports: ["cn", "cx"],
    importFrom: "@joyui/react",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  {
    name: "format",
    title: "Formatters",
    description: "dayjs-based date helpers plus Intl formatters.",
    type: "lib",
    layer: "lib",
    exports: [
      "dayjs",
      "toDayjs",
      "formatDate",
      "fromNow",
      "toNativeDate",
      "formatNumber",
      "formatPercent",
      "formatCurrency",
      "formatCompact",
      "formatBytes",
    ],
    importFrom: "@joyui/react",
    dependencies: ["dayjs"],
    registryDependencies: [],
  },
];

/** Doc slug / CLI name overrides when folder name ≠ public name. */
const NAME_ALIASES = {
  buttons: "button",
  badges: "badge",
  admin: "admin-dashboard",
  theme: "theme-toggle",
  auth: "auth-card",
  settings: "settings-modal",
  "app-shell": "notification-bell",
};

const TITLE_OVERRIDES = {
  button: "Button",
  badge: "Badge",
  "admin-dashboard": "Admin Dashboard",
  "theme-toggle": "Theme Toggle",
  "auth-card": "Auth Card",
  "settings-modal": "Settings Modal",
  "data-table": "Data Table",
  "data-grid": "Data Grid",
  "revenue-chart-card": "Revenue Chart Card",
  "profile-cards": "Profile Cards",
  "week-range-pill": "Week Range Pill",
};

function titleCase(slug) {
  if (TITLE_OVERRIDES[slug]) return TITLE_OVERRIDES[slug];
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function parseBarrel(filePath, importFrom = "@joyui/react") {
  if (!fs.existsSync(filePath)) return [];
  const src = fs.readFileSync(filePath, "utf8");
  const byName = new Map();

  for (const m of src.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g,
  )) {
    const from = m[2];
    if (!from.includes("/components/")) continue;

    const names = m[1]
      .split(",")
      .map((s) => s.trim().split(/\s+as\s+/).pop()?.trim())
      .filter((n) => n && /^[A-Z]/.test(n));
    if (!names.length) continue;

    const parts = from.replace(/\\/g, "/").split("/");
    const folder = parts[parts.length - 2];
    const layer = from.includes("/application/")
      ? "application"
      : from.includes("/foundations/")
        ? "foundation"
        : "base";
    const name = NAME_ALIASES[folder] ?? folder;

    const existing = byName.get(name) ?? {
      name,
      title: titleCase(name),
      description: `${titleCase(name)} component from @joyui/react.`,
      type: "component",
      layer,
      exports: [],
      importFrom,
      dependencies: [],
      registryDependencies: [],
    };
    for (const n of names) {
      if (!existing.exports.includes(n)) existing.exports.push(n);
    }
    // Prefer application layer if same slug appears twice
    if (layer === "application") existing.layer = "application";
    byName.set(name, existing);
  }

  return [...byName.values()];
}

function parseSubpathBarrel(filePath, meta) {
  if (!fs.existsSync(filePath)) return [];
  const src = fs.readFileSync(filePath, "utf8");
  const exports = [];
  for (const m of src.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g,
  )) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && /^[A-Z]/.test(name) && !exports.includes(name)) {
        exports.push(name);
      }
    }
  }
  if (!exports.length) return [];
  return [{ ...meta, exports }];
}

function parseComposer() {
  return parseSubpathBarrel(composerPath, {
    name: "composer",
    title: "Composer",
    description:
      "TipTap-backed composer surfaces. Import from @joyui/react/composer.",
    type: "component",
    layer: "application",
    importFrom: "@joyui/react/composer",
    dependencies: [],
    registryDependencies: [],
  });
}

function parseAi() {
  // Prefer main entry: AI SDK ships inside @joyui/react. Keep /ai as alias.
  return parseSubpathBarrel(aiPath, {
    name: "ai-kit",
    title: "AI Kit",
    description:
      "Built-in AI SDK chat kit (AiChat / AiConversation / AiMessage / useChat).",
    type: "component",
    layer: "application",
    importFrom: "@joyui/react",
    dependencies: [],
    registryDependencies: [
      "chat-message",
      "message-actions",
      "reasoning-block",
      "tool-call",
      "citation",
      "prompt-suggestions",
      "agent-thinking",
    ],
  });
}

function main() {
  const components = [
    ...MANUAL,
    ...parseAi(),
    ...parseBarrel(indexPath),
    ...parseComposer(),
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Dedupe by name (manual wins)
  const seen = new Set();
  const catalog = [];
  for (const item of components) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    catalog.push(item);
  }

  const outTs = path.join(root, "packages/cli/src/catalog.generated.ts");
  const body = `/** AUTO-GENERATED by scripts/generate-catalog.mjs — do not edit. */
export type JoyComponent = {
  name: string;
  title: string;
  description: string;
  type: "component" | "lib";
  layer: "base" | "application" | "foundation" | "lib";
  exports: string[];
  importFrom: string;
  dependencies: string[];
  registryDependencies: string[];
};

export const CATALOG: JoyComponent[] = ${JSON.stringify(catalog, null, 2)};
`;
  fs.writeFileSync(outTs, body);

  // Skill reference markdown
  const skillMd = path.join(
    root,
    "packages/cli/skill/references/components.md",
  );
  const rows = catalog
    .map(
      (c) =>
        `| \`${c.name}\` | ${c.layer} | \`${c.exports.slice(0, 4).join(", ")}${c.exports.length > 4 ? ", …" : ""}\` | \`${c.importFrom}\` |`,
    )
    .join("\n");
  fs.writeFileSync(
    skillMd,
    `# JoyUI component catalog

Prefer **npm whole-library** install. All components ship in \`@joyui/react\` with built-in CSS.

\`\`\`bash
pnpm add @joyui/react
\`\`\`

\`\`\`css
@import "tailwindcss";
@import "@joyui/react/styles.css";
\`\`\`

\`\`\`tsx
import { JoyUIProvider, Button, Input } from "@joyui/react";
\`\`\`

Optional source copy (shadcn-style): \`npx @joyui/cli add <name> --yes\`.

| Name | Layer | Exports | Import |
|------|-------|---------|--------|
${rows}
`,
  );

  // Also write JSON for registry tooling
  const jsonOut = path.join(root, "packages/cli/src/catalog.json");
  fs.writeFileSync(jsonOut, JSON.stringify(catalog, null, 2));

  console.log(`Generated ${catalog.length} catalog items → ${outTs}`);
}

main();
