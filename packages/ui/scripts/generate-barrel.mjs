/**
 * Generate packages/ui barrel exports from src/components (no docs sync).
 * Replaces the barrel portion of the old sync-from-docs.mjs.
 *
 * Run: node ./scripts/generate-barrel.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");

const VALUE_EXPORT_ALLOW = new Set([
  "useJoyI18n",
  "useT",
  "useTemplateCopy",
  "useTemplateLanguageSelector",
  "useDirection",
  "useScrollFade",
  "useLogMotion",
  "useRevealTicker",
  "useRevealMask",
  "createMessageTranslator",
  "resolveMessages",
  "builtInLocales",
  "en",
  "zhCN",
  "translateTemplateCopy",
  "scorePassword",
  "formatRelativeTime",
  "toast",
  "toastPromise",
]);

/** Demos / internals — keep out of the public @joyui/react barrel. */
const VALUE_EXPORT_DENY = new Set([
  "DataTableExample",
  "NotificationCenterDemo",
  "PlanArtFlame",
  "DayCell",
  "MonthPanel",
  "DateChipInput",
  "ChevronLeft16",
  "ChevronRight16",
]);

function isDeniedExport(name) {
  if (VALUE_EXPORT_DENY.has(name)) return true;
  if (/Example$|Demo$/.test(name)) return true;
  return false;
}

const COMPOSER_DIR_RE =
  /[/\\]components[/\\]application[/\\]composer(?:-loader|-panel)?[/\\]/;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function relativeImport(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel.replace(/\.(tsx|ts|jsx|js)$/, "");
}

function collectExports(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const names = new Set();
  for (const m of src.matchAll(
    /export\s+(?:async\s+)?function\s+([A-Za-z][A-Za-z0-9]*)/g,
  )) {
    const name = m[1];
    if (/^[A-Z]/.test(name) || VALUE_EXPORT_ALLOW.has(name)) names.add(name);
  }
  for (const m of src.matchAll(/export\s+const\s+([A-Za-z][A-Za-z0-9]*)\s*=/g)) {
    const name = m[1];
    if (/^[A-Z]/.test(name) || VALUE_EXPORT_ALLOW.has(name)) names.add(name);
  }
  for (const m of src.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const cleaned = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (
        cleaned &&
        (/^[A-Z]/.test(cleaned) || VALUE_EXPORT_ALLOW.has(cleaned))
      ) {
        names.add(cleaned);
      }
    }
  }
  for (const m of src.matchAll(/export\s+type\s+([A-Z][A-Za-z0-9]*)/g)) {
    names.add(`type:${m[1]}`);
  }
  for (const m of src.matchAll(/export\s+interface\s+([A-Z][A-Za-z0-9]*)/g)) {
    names.add(`type:${m[1]}`);
  }
  return [...names];
}

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
      .filter((n) => !isDeniedExport(n))
      .filter((n) => {
        if (seenValues.has(n)) return false;
        seenValues.add(n);
        return true;
      });
    const types = names
      .filter((n) => n.startsWith("type:"))
      .map((n) => n.slice(5))
      .filter((n) => !isDeniedExport(n))
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

function writeStylesEntry() {
  const stylesDest = path.join(pkgRoot, "src/styles");
  const entry = `/**
 * JoyUI — built-in design tokens + component CSS (Tailwind CSS v4).
 *
 * Consumer apps (recommended):
 *
 *   @import "tailwindcss";
 *   @import "@joyui/react/styles.css";
 *
 * This single entry includes theme tokens, composite typography, component
 * rules, and dark/rtl variants. Tailwind @source scans published dist/.
 *
 * Source of truth: packages/ui/src/styles/{theme,typography,components}.css
 */
@source "../../dist";

@import "./theme.css";
@import "./typography.css";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant rtl (&:dir(rtl));
@custom-variant ltr (&:dir(ltr));

@import "./components.css";
`;
  fs.writeFileSync(path.join(stylesDest, "styles.css"), entry);
}

function main() {
  writeStylesEntry();

  const componentsRoot = path.join(pkgRoot, "src/components");
  const allFiles = walk(componentsRoot).filter((f) => /\.(tsx|ts)$/.test(f));
  const mainFiles = allFiles.filter((f) => !isComposerFile(f));
  const composerFiles = allFiles.filter((f) => isComposerFile(f));

  const indexPath = path.join(pkgRoot, "src/index.ts");
  const { valueExports, typeExports, seenValues } = generateExportsForFiles(
    mainFiles,
    indexPath,
    ["cn", "cx", "mergeCx", "sortCx"],
  );

  fs.writeFileSync(
    indexPath,
    `/** AUTO-GENERATED by scripts/generate-barrel.mjs — do not edit by hand. */
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
 * TipTap-backed Composer lives at \`@joyui/react/composer\`.
 */
${valueExports.join("\n")}
${typeExports.join("\n")}
`,
  );
  console.log(
    `barrel: ${valueExports.length} value modules, ${typeExports.length} type modules (${seenValues.size} unique values)`,
  );

  const composerPath = path.join(pkgRoot, "src/composer.ts");
  const composer = generateExportsForFiles(composerFiles, composerPath, []);
  fs.writeFileSync(
    composerPath,
    `/** AUTO-GENERATED by scripts/generate-barrel.mjs.
 * Import from \`@joyui/react/composer\`.
 */
${composer.valueExports.join("\n")}
${composer.typeExports.join("\n")}
`,
  );
  console.log(
    `composer barrel: ${composer.valueExports.length} value / ${composer.typeExports.length} type modules`,
  );
}

main();
