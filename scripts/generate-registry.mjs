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
const srcRoot = path.join(pkgRoot, "src");
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

/** First path segment under components/{layer}/ → catalog name */
const FOLDER_TO_NAME = {
  buttons: "button",
  badges: "badge",
  admin: "admin-dashboard",
  theme: "theme-toggle",
  auth: "auth-card",
  settings: "settings-modal",
  "app-shell": "notification-bell",
  "data-table": "data-table",
  "data-grid": "data-grid",
  composer: "composer",
  "composer-loader": "composer",
  "composer-panel": "composer",
};

const NPM_DEP_RULES = [
  [/@tanstack\/react-table/, "@tanstack/react-table"],
  [/from\s+["']recharts["']/, "recharts"],
  [/from\s+["']motion\/react["']/, "motion"],
  [/from\s+["']jsbarcode["']/, "jsbarcode"],
  [/from\s+["']qrcode["']/, "qrcode"],
  [/from\s+["']tippy\.js["']/, "tippy.js"],
  [/from\s+["']@tiptap\/react["']/, "@tiptap/react"],
  [/from\s+["']@tiptap\/starter-kit["']/, "@tiptap/starter-kit"],
  [/from\s+["']@tiptap\/extension-mention["']/, "@tiptap/extension-mention"],
  [/from\s+["']@tiptap\/extension-placeholder["']/, "@tiptap/extension-placeholder"],
  [/from\s+["']@tiptap\/suggestion["']/, "@tiptap/suggestion"],
  [/from\s+["']@tiptap\/pm/, "@tiptap/pm"],
  [/from\s+["']dayjs/, "dayjs"],
  [/from\s+["']@remixicon\/react["']/, "@remixicon/react"],
  [/from\s+["']react-aria-components["']/, "react-aria-components"],
  [/from\s+["']@internationalized\/date["']/, "@internationalized/date"],
  [/from\s+["']clsx["']/, "clsx"],
  [/from\s+["']tailwind-merge["']/, "tailwind-merge"],
];

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
  const rel = path.relative(srcRoot, absFile).replace(/\\/g, "/");
  if (rel.startsWith("components/")) {
    return rel.replace(
      /^components\/(base|application|foundations)\//,
      "components/ui/",
    );
  }
  if (rel.startsWith("lib/")) return rel;
  if (rel.startsWith("utils/")) return `lib/${path.basename(rel)}`;
  if (rel.startsWith("hooks/")) return rel;
  return `components/ui/${path.basename(rel)}`;
}

function toAliasFromSrcRel(relToSrc) {
  const rel = relToSrc.replace(/\.(tsx|ts)$/, "");
  if (rel.startsWith("utils/")) {
    const base = path.basename(rel);
    if (base === "cx") return "@/lib/utils";
    return `@/lib/${base}`;
  }
  if (rel.startsWith("lib/")) return `@/lib/${path.basename(rel)}`;
  if (rel.startsWith("hooks/")) return `@/hooks/${path.basename(rel)}`;
  if (rel.startsWith("components/")) {
    const cleaned = rel.replace(
      /^components\/(base|application|foundations)\//,
      "",
    );
    return `@/components/ui/${cleaned}`;
  }
  return null;
}

function rewriteForConsumer(source, absFile) {
  return source.replace(
    /from\s+["']([^"']+)["']/g,
    (match, spec) => {
      if (spec.startsWith("@/")) {
        // Normalize docs-style aliases that may appear if sources ever use them
        if (spec.startsWith("@/components/base/")) {
          return `from "${spec.replace("@/components/base/", "@/components/ui/")}"`;
        }
        if (spec.startsWith("@/components/application/")) {
          return `from "${spec.replace("@/components/application/", "@/components/ui/")}"`;
        }
        if (spec.startsWith("@/components/foundations/")) {
          return `from "${spec.replace("@/components/foundations/", "@/components/ui/")}"`;
        }
        if (spec.startsWith("@/utils/")) {
          const base = spec.slice("@/utils/".length);
          return `from "${base === "cx" ? "@/lib/utils" : `@/lib/${base}`}"`;
        }
        return match;
      }
      if (!spec.startsWith(".")) return match;

      const resolved = path.resolve(path.dirname(absFile), spec);
      const relToSrc = path.relative(srcRoot, resolved).replace(/\\/g, "/");
      if (relToSrc.startsWith("..")) return match;
      const alias = toAliasFromSrcRel(relToSrc);
      return alias ? `from "${alias}"` : match;
    },
  );
}

function inferNpmDeps(files) {
  const deps = new Set();
  for (const f of files) {
    for (const [re, pkg] of NPM_DEP_RULES) {
      if (re.test(f.content)) deps.add(pkg);
    }
  }
  return [...deps].sort();
}

function catalogNameFromUiImport(importPath) {
  // @/components/ui/buttons/button → buttons
  const rest = importPath.replace(/^@\/components\/ui\//, "");
  const folder = rest.split("/")[0];
  return FOLDER_TO_NAME[folder] ?? folder;
}

function inferRegistryDeps(files, selfName) {
  const deps = new Set();
  for (const f of files) {
    for (const m of f.content.matchAll(
      /from\s+["'](@\/(?:components\/ui|lib|hooks)\/[^"']+)["']/g,
    )) {
      const spec = m[1];
      if (spec.startsWith("@/lib/utils")) deps.add("utils");
      else if (spec.startsWith("@/lib/format")) deps.add("format");
      else if (spec.startsWith("@/components/ui/")) {
        const name = catalogNameFromUiImport(spec);
        if (name && name !== selfName) deps.add(name);
      }
    }
  }
  return [...deps].sort();
}

function collectFiles(item) {
  if (item.name === "utils") {
    const abs = path.join(pkgRoot, "src/lib/utils.ts");
    const cxAbs = path.join(pkgRoot, "src/utils/cx.ts");
    return [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        content: fs.readFileSync(abs, "utf8"),
      },
      {
        path: "lib/cx.ts",
        type: "registry:lib",
        content: fs.readFileSync(cxAbs, "utf8"),
      },
    ].map((f) =>
      f.path === "lib/utils.ts"
        ? {
            ...f,
            content: f.content.replace(
              /from\s+["']\.\.\/utils\/cx["']/,
              'from "./cx"',
            ),
          }
        : f,
    );
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
        content: rewriteForConsumer(fs.readFileSync(abs, "utf8"), abs),
      });
    }
  }
  return files;
}

const items = catalog.map((c) => {
  const files = collectFiles(c);
  const catalogDeps = Array.isArray(c.dependencies) ? c.dependencies : [];
  const npmDeps = [
    ...new Set([...catalogDeps, ...inferNpmDeps(files)]),
  ].sort();
  const regDeps = [
    ...new Set([
      ...(Array.isArray(c.registryDependencies) ? c.registryDependencies : []),
      ...inferRegistryDeps(files, c.name),
    ]),
  ].sort();

  return {
    name: c.name,
    type: c.type === "lib" ? "registry:lib" : "registry:ui",
    title: c.title,
    description: `${c.description} Prefer npm: pnpm add @joyui/react`,
    dependencies: npmDeps,
    registryDependencies: regDeps,
    files,
    meta: {
      importFrom: c.importFrom,
      exports: c.exports,
      npm: "@joyui/react",
      styles: "@joyui/react/styles.css",
    },
  };
});

const contentRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "joyui",
  homepage: "https://joyui.dev",
  items,
};

const out = path.join(pkgRoot, "registry.json");
fs.writeFileSync(out, JSON.stringify(contentRegistry, null, 2));

const withFiles = contentRegistry.items.filter((i) => i.files.length > 0).length;
const stillRelative = contentRegistry.items.filter((i) =>
  i.files.some((f) => /from\s+["']\.\.\//.test(f.content ?? "")),
).length;

console.log(
  `Wrote ${contentRegistry.items.length} registry items (${withFiles} with source files, ${stillRelative} still have ../ imports) → ${out}`,
);
