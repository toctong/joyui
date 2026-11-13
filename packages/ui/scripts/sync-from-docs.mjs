/**
 * Sync shippable JoyUI components from apps/docs → packages/ui/src,
 * rewrite @/ aliases to package-relative imports, and strip Next.js hard deps.
 *
 * Run: node ./scripts/sync-from-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(pkgRoot, "../..");
const docsRoot = path.join(repoRoot, "apps/docs");

const APPLICATION_INCLUDE = new Set([
  "admin",
  "agent-log",
  "agent-thinking",
  "auth",
  "composer",
  "composer-loader",
  "composer-panel",
  "dashboard",
  "data-grid",
  "data-table",
  "medical",
  "notification-center",
  "settings",
  "theme",
  "web-search",
  // partial app-shell: notification bell only (handled via file filter)
  "app-shell",
]);

const APP_SHELL_KEEP = new Set([
  "notification-bell.tsx",
  "starter-notifications.ts",
]);

const SKIP_FILE_NAMES = new Set([
  "app-shell.tsx",
  "pro-offer-card.tsx",
  "components-catalog.tsx",
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function relativeImport(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  // drop extension for TS/TSX imports
  rel = rel.replace(/\.(tsx|ts|jsx|js)$/, "");
  return rel;
}

function resolveAlias(aliasPath) {
  // aliasPath like "utils/cx" or "components/base/buttons/button"
  const candidates = [
    path.join(pkgRoot, "src", aliasPath),
    path.join(pkgRoot, "src", `${aliasPath}.ts`),
    path.join(pkgRoot, "src", `${aliasPath}.tsx`),
    path.join(pkgRoot, "src", aliasPath, "index.ts"),
    path.join(pkgRoot, "src", aliasPath, "index.tsx"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  // Prefer .tsx then .ts when only the stem exists after sync
  for (const ext of [".tsx", ".ts", ".jsx", ".js"]) {
    const p = path.join(pkgRoot, "src", `${aliasPath}${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return path.join(pkgRoot, "src", aliasPath);
}

function rewriteContent(filePath, source) {
  let s = source;

  // next/link → plain anchor helper (inline replacement for breadcrumb)
  if (s.includes('from "next/link"') || s.includes("from 'next/link'")) {
    s = s.replace(
      /import\s+Link\s+from\s+["']next\/link["'];?\n?/,
      "",
    );
    // Replace <Link href=...> with <a href=...>
    s = s.replace(/<Link\b/g, "<a").replace(/<\/Link>/g, "</a>");
  }

  // next/image → img
  if (s.includes('from "next/image"') || s.includes("from 'next/image'")) {
    s = s.replace(/import\s+Image\s+from\s+["']next\/image["'];?\n?/, "");
    // Convert <Image ... /> / <Image ...></Image> to <img ... />
    s = s.replace(/<Image\b/g, "<img").replace(/<\/Image>/g, "");
    // Strip Next-only JSX attrs (keep destructuring params like `priority = false`)
    s = s.replace(/\n[ \t]*priority=\{[^}]+\}/g, "");
    s = s.replace(/\n[ \t]*priority\n/g, "\n");
    s = s.replace(/\n[ \t]*fill=\{[^}]+\}/g, "");
    s = s.replace(/\n[ \t]*fill\n/g, "\n");
  }

  // next/navigation — should not appear in included files; stub if any slip through
  if (s.includes("next/navigation")) {
    s = s.replace(
      /import\s+\{([^}]+)\}\s+from\s+["']next\/navigation["'];?\n?/,
      (_m, names) => {
        const ids = names.split(",").map((n) => n.trim()).filter(Boolean);
        return ids
          .map((id) => {
            if (id === "usePathname") {
              return `function usePathname() { return ""; }\n`;
            }
            if (id === "useRouter") {
              return `function useRouter() { return { push() {}, replace() {}, back() {}, prefetch() {} }; }\n`;
            }
            return `function ${id}() { return null; }\n`;
          })
          .join("");
      },
    );
  }

  // Rewrite @/ aliases to relative imports
  s = s.replace(
    /from\s+["']@\/([^"']+)["']/g,
    (match, alias) => {
      const target = resolveAlias(alias);
      const rel = relativeImport(filePath, target);
      return `from "${rel}"`;
    },
  );

  return s;
}

function syncUtilsAndHooks() {
  const utilsSrc = path.join(docsRoot, "utils");
  const utilsDest = path.join(pkgRoot, "src", "utils");
  ensureDir(utilsDest);

  for (const name of [
    "scroll-direction.ts",
    "use-dismiss-on-outside-press.ts",
    "directional-icon.ts",
  ]) {
    const src = path.join(utilsSrc, name);
    if (fs.existsSync(src)) {
      let content = fs.readFileSync(src, "utf8");
      const dest = path.join(utilsDest, name);
      content = rewriteContent(dest, content);
      fs.writeFileSync(dest, content);
    }
  }
  // cx.ts is maintained in-package (typography-aware); keep existing

  const hooksSrc = path.join(docsRoot, "hooks");
  const hooksDest = path.join(pkgRoot, "src", "hooks");
  ensureDir(hooksDest);
  for (const file of walk(hooksSrc)) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    const rel = path.relative(hooksSrc, file);
    const dest = path.join(hooksDest, rel);
    let content = fs.readFileSync(file, "utf8");
    content = rewriteContent(dest, content);
    ensureDir(path.dirname(dest));
    fs.writeFileSync(dest, content);
  }
}

function syncStyles() {
  const stylesDest = path.join(pkgRoot, "src", "styles");
  ensureDir(stylesDest);
  for (const name of ["theme.css", "typography.css"]) {
    copyFile(
      path.join(docsRoot, "styles", name),
      path.join(stylesDest, name),
    );
  }
  // styles.css entry maintained in-package
}

function shouldCopyApplicationFile(relFromApplication) {
  const parts = relFromApplication.split(/[/\\]/);
  const folder = parts[0];
  if (!APPLICATION_INCLUDE.has(folder)) return false;
  if (folder === "app-shell") {
    const base = parts[parts.length - 1];
    return APP_SHELL_KEEP.has(base);
  }
  const base = parts[parts.length - 1];
  if (SKIP_FILE_NAMES.has(base)) return false;
  return true;
}

function syncTree(srcRoot, destRoot, filterFn) {
  const files = walk(srcRoot).filter((f) => /\.(ts|tsx|css)$/.test(f));
  let count = 0;
  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    if (filterFn && !filterFn(rel)) continue;
    const dest = path.join(destRoot, rel);
    let content = fs.readFileSync(file, "utf8");
    ensureDir(path.dirname(dest));
    // Write first so resolveAlias can find siblings during rewrite of later files
    fs.writeFileSync(dest, content);
    count++;
  }
  // Second pass: rewrite imports now that all files exist
  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    if (filterFn && !filterFn(rel)) continue;
    const dest = path.join(destRoot, rel);
    let content = fs.readFileSync(dest, "utf8");
    content = rewriteContent(dest, content);
    fs.writeFileSync(dest, content);
  }
  return count;
}

function collectExports(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const names = new Set();
  for (const m of src.matchAll(
    /export\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*)/g,
  )) {
    names.add(m[1]);
  }
  for (const m of src.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9]*)\s*=/g)) {
    names.add(m[1]);
  }
  for (const m of src.matchAll(
    /export\s+\{([^}]+)\}/g,
  )) {
    for (const part of m[1].split(",")) {
      const cleaned = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (cleaned && /^[A-Z]/.test(cleaned)) names.add(cleaned);
    }
  }
  for (const m of src.matchAll(
    /export\s+type\s+\{([^}]+)\}/g,
  )) {
    // skip types in value barrel; types go via export type separately if needed
    void m;
  }
  for (const m of src.matchAll(/export\s+type\s+([A-Z][A-Za-z0-9]*)/g)) {
    names.add(`type:${m[1]}`);
  }
  for (const m of src.matchAll(
    /export\s+interface\s+([A-Z][A-Za-z0-9]*)/g,
  )) {
    names.add(`type:${m[1]}`);
  }
  return [...names];
}

/** TipTap-backed composer surfaces — shipped via `@joyui/react/composer`. */
const COMPOSER_DIR_RE = /[/\\]components[/\\]application[/\\]composer(?:-loader|-panel)?[/\\]/;

function isComposerFile(filePath) {
  return COMPOSER_DIR_RE.test(filePath);
}

function generateExportsForFiles(files, barrelFile, reservedValues = []) {
  const valueExports = [];
  const typeExports = [];
  const seenValues = new Set(reservedValues);
  const seenTypes = new Set();

  for (const file of files.sort()) {
    const names = collectExports(file);
    if (!names.length) continue;
    const rel = relativeImport(barrelFile, file);
    const values = names
      .filter((n) => !n.startsWith("type:"))
      .filter((n) => {
        if (seenValues.has(n)) return false;
        seenValues.add(n);
        return true;
      });
    const types = names
      .filter((n) => n.startsWith("type:"))
      .map((n) => n.slice(5))
      .filter((n) => {
        if (seenTypes.has(n) || seenValues.has(n)) return false;
        seenTypes.add(n);
        return true;
      });

    if (values.length) {
      valueExports.push(`export { ${values.join(", ")} } from "${rel}";`);
    }
    if (types.length) {
      typeExports.push(`export type { ${types.join(", ")} } from "${rel}";`);
    }
  }

  return { valueExports, typeExports, seenValues };
}

function generateBarrel() {
  const componentsRoot = path.join(pkgRoot, "src", "components");
  const allFiles = walk(componentsRoot).filter((f) => /\.(tsx|ts)$/.test(f));
  const mainFiles = allFiles.filter((f) => !isComposerFile(f));
  const composerFiles = allFiles.filter((f) => isComposerFile(f));

  const indexPath = path.join(pkgRoot, "src", "index.ts");
  const { valueExports, typeExports, seenValues } = generateExportsForFiles(
    mainFiles,
    indexPath,
    ["cn", "cx", "mergeCx", "sortCx"],
  );

  const content = `/** AUTO-GENERATED by scripts/sync-from-docs.mjs — do not edit by hand. */
export { cn, cx } from "./lib/utils";
export {
  dayjs,
  toDayjs,
  formatDate,
  fromNow,
  toNativeDate,
  formatNumber,
  formatPercent,
  formatCurrency,
  formatCompact,
  formatBytes,
} from "./lib/format";
export { cx as mergeCx, sortCx } from "./utils/cx";

/**
 * TipTap-backed Composer lives at \`@joyui/react/composer\` so apps that only
 * need Button/Input/etc. do not pull optional @tiptap/* peers into the bundle.
 */
${valueExports.join("\n")}
${typeExports.join("\n")}
`;

  fs.writeFileSync(indexPath, content);
  console.log(
    `barrel: ${valueExports.length} value modules, ${typeExports.length} type modules (${seenValues.size} unique values)`,
  );

  const composerPath = path.join(pkgRoot, "src", "composer.ts");
  const composer = generateExportsForFiles(composerFiles, composerPath, []);
  const composerContent = `/** AUTO-GENERATED by scripts/sync-from-docs.mjs — do not edit by hand.
 * Import TipTap Composer surfaces from \`@joyui/react/composer\`.
 * Requires optional peers: @tiptap/*, tippy.js (and motion for attachment strip).
 */
${composer.valueExports.join("\n")}
${composer.typeExports.join("\n")}
`;
  fs.writeFileSync(composerPath, composerContent);
  console.log(
    `composer barrel: ${composer.valueExports.length} value modules, ${composer.typeExports.length} type modules`,
  );
}

function main() {
  console.log("Syncing JoyUI package from apps/docs…");

  rimraf(path.join(pkgRoot, "src", "components"));
  // keep utils/cx.ts; refresh other utils/hooks/styles
  syncStyles();
  syncUtilsAndHooks();

  const baseCount = syncTree(
    path.join(docsRoot, "components", "base"),
    path.join(pkgRoot, "src", "components", "base"),
  );
  const foundCount = syncTree(
    path.join(docsRoot, "components", "foundations"),
    path.join(pkgRoot, "src", "components", "foundations"),
  );
  const appCount = syncTree(
    path.join(docsRoot, "components", "application"),
    path.join(pkgRoot, "src", "components", "application"),
    shouldCopyApplicationFile,
  );

  // Second full rewrite pass across all package components (aliases may resolve better)
  for (const file of walk(path.join(pkgRoot, "src", "components"))) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    let content = fs.readFileSync(file, "utf8");
    content = rewriteContent(file, content);
    fs.writeFileSync(file, content);
  }
  for (const file of walk(path.join(pkgRoot, "src", "utils"))) {
    if (!/\.(ts|tsx)$/.test(file) || file.endsWith(`${path.sep}cx.ts`)) continue;
    let content = fs.readFileSync(file, "utf8");
    content = rewriteContent(file, content);
    fs.writeFileSync(file, content);
  }
  for (const file of walk(path.join(pkgRoot, "src", "hooks"))) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    let content = fs.readFileSync(file, "utf8");
    content = rewriteContent(file, content);
    fs.writeFileSync(file, content);
  }

  generateBarrel();

  console.log(
    `synced base=${baseCount} foundations=${foundCount} application=${appCount}`,
  );
}

main();
