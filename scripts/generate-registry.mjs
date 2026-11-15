/**
 * Build packages/ui/registry.json with real source file payloads for CLI add.
 * Run after catalog:gen.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pkgRoot = path.join(root, "packages/ui");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "packages/cli/src/catalog.json"), "utf8"),
);

/** Map catalog name → source folders under packages/ui/src/components */
const FOLDER_MAP = {
  button: ["base/buttons"],
  badge: ["base/badges"],
  chip: ["base/badges"],
  "admin-dashboard": ["application/admin"],
  "theme-toggle": ["application/theme"],
  "auth-card": ["application/auth"],
  "settings-modal": ["application/settings"],
  "notification-bell": ["application/app-shell"],
  "data-table": ["application/data-table"],
  "data-grid": ["application/data-grid"],
  composer: [
    "application/composer",
    "application/composer-loader",
    "application/composer-panel",
  ],
  format: null,
  utils: null,
  brand: ["foundations/brand"],
  direction: ["foundations/direction"],
  i18n: ["foundations/i18n"],
  icons: ["foundations/icons"],
  "scroll-fade": ["foundations/scroll-fade"],
  "template-copy": ["foundations/template-copy"],
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(full);
  }
  return out;
}

function resolveFolders(item) {
  if (FOLDER_MAP[item.name] !== undefined) return FOLDER_MAP[item.name];
  if (item.layer === "base") return [`base/${item.name}`];
  if (item.layer === "application") return [`application/${item.name}`];
  if (item.layer === "foundation") return [`foundations/${item.name}`];
  return [];
}

function toConsumerPath(absFile) {
  const rel = path
    .relative(path.join(pkgRoot, "src"), absFile)
    .replace(/\\/g, "/");
  // components/base/buttons/button.tsx → components/ui/button/button.tsx
  // Keep structure under components/ui for shadcn-like installs
  if (rel.startsWith("components/")) {
    return rel.replace(/^components\/(base|application|foundations)\//, "components/ui/");
  }
  if (rel.startsWith("lib/")) return rel;
  if (rel.startsWith("utils/")) return `lib/${path.basename(rel)}`;
  if (rel.startsWith("hooks/")) return rel;
  return `components/ui/${path.basename(rel)}`;
}

function rewriteForConsumer(source) {
  return source
    .replaceAll(/from\s+["'](\.\.\/)+utils\/cx["']/g, 'from "@/lib/utils"')
    .replaceAll(
      /from\s+["'](\.\.\/)+utils\/directional-icon["']/g,
      'from "@/lib/directional-icon"',
    )
    .replaceAll(
      /from\s+["'](\.\.\/)+utils\/scroll-direction["']/g,
      'from "@/lib/scroll-direction"',
    )
    .replaceAll(
      /from\s+["'](\.\.\/)+utils\/use-dismiss-on-outside-press["']/g,
      'from "@/lib/use-dismiss-on-outside-press"',
    )
    .replaceAll(/from\s+["'](\.\.\/)+lib\/utils["']/g, 'from "@/lib/utils"')
    .replaceAll(/from\s+["'](\.\.\/)+lib\/format["']/g, 'from "@/lib/format"')
    .replaceAll(
      /from\s+["'](\.\.\/)+hooks\/([^"']+)["']/g,
      'from "@/hooks/$2"',
    )
    // Sibling / relative component imports → @/components/ui/...
    .replace(
      /from\s+["']((?:\.\.\/)+components\/(?:base|application|foundations)\/[^"']+)["']/g,
      (_m, p) => {
        const cleaned = p
          .replace(/^(\.\.\/)+components\/(base|application|foundations)\//, "")
          .replace(/\.(tsx|ts)$/, "");
        return `from "@/components/ui/${cleaned}"`;
      },
    );
}

function collectFiles(item) {
  if (item.name === "utils") {
    const abs = path.join(pkgRoot, "src/lib/utils.ts");
    return [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        content: fs.readFileSync(abs, "utf8"),
      },
    ];
  }
  if (item.name === "format") {
    const abs = path.join(pkgRoot, "src/lib/format.ts");
    return [
      {
        path: "lib/format.ts",
        type: "registry:lib",
        content: fs.readFileSync(abs, "utf8"),
      },
    ];
  }

  const folders = resolveFolders(item);
  if (!folders?.length) return [];

  const files = [];
  const seen = new Set();
  for (const folder of folders) {
    const absDir = path.join(pkgRoot, "src/components", folder);
    for (const abs of walk(absDir)) {
      const consumerPath = toConsumerPath(abs);
      if (seen.has(consumerPath)) continue;
      seen.add(consumerPath);
      files.push({
        path: consumerPath,
        type: "registry:ui",
        content: rewriteForConsumer(fs.readFileSync(abs, "utf8")),
      });
    }
  }
  return files;
}

const items = catalog.map((c) => {
  const files = collectFiles(c);
  return {
    name: c.name,
    type: c.type === "lib" ? "registry:lib" : "registry:ui",
    title: c.title,
    description: `${c.description} Prefer npm: pnpm add @joyui/react`,
    dependencies: c.dependencies,
    registryDependencies: c.registryDependencies,
    files: files.map(({ path: p, type }) => ({ path: p, type })),
    // stash content for build-registry — written next to registry as .content map
    _contents: files,
    meta: {
      importFrom: c.importFrom,
      exports: c.exports,
      npm: "@joyui/react",
      styles: "@joyui/react/styles.css",
    },
  };
});

// Write registry without _contents (schema clean)
const registryItems = items.map(({ _contents, ...rest }) => ({
  ...rest,
  files: (_contents ?? []).map((f) => ({
    path: f.path.replace(/^components\/ui\//, `src/components/`).replace(/^lib\//, "src/lib/"),
    type: f.type,
  })),
}));

// Simpler: store content-ready registry for build-registry
const contentRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "joyui",
  homepage: "https://joyui.dev",
  items: items.map(({ _contents, ...rest }) => ({
    ...rest,
    files: _contents ?? [],
  })),
};

const out = path.join(pkgRoot, "registry.json");
fs.writeFileSync(out, JSON.stringify(contentRegistry, null, 2));

const withFiles = contentRegistry.items.filter((i) => i.files.length > 0).length;
console.log(
  `Wrote ${contentRegistry.items.length} registry items (${withFiles} with source files) → ${out}`,
);
