import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const packageRoot = path.resolve(here, "../..");
export const srcRoot = path.join(packageRoot, "src");
export const stylesRoot = path.join(srcRoot, "styles");

export function readStyle(name: string) {
  return fs.readFileSync(path.join(stylesRoot, name), "utf8");
}

export function walkTsx(dir = path.join(srcRoot, "components")): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(full));
    else if (/\.(tsx|ts)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Collect `border-border-*` / `text-text-*` / `bg-background-*` style utilities from source. */
export function collectSemanticUtilities(files: string[]) {
  const border = new Set<string>();
  const text = new Set<string>();
  const background = new Set<string>();
  const bui = new Set<string>();

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(
      /\b(?:border|divide|ring|outline)-border-([a-z0-9-]+)\b/g,
    )) {
      border.add(match[1]!);
    }
    for (const match of source.matchAll(/\btext-text-([a-z0-9-]+)\b/g)) {
      text.add(match[1]!);
    }
    for (const match of source.matchAll(/\bbg-background-([a-z0-9-]+)\b/g)) {
      background.add(match[1]!);
    }
    // Class names only — skip CSS custom properties like `--bui-reveal-fade`.
    for (const match of source.matchAll(/(?<![-])\bbui-([a-z0-9-]+)\b/g)) {
      bui.add(`bui-${match[1]}`);
    }
  }

  return { border, text, background, bui };
}

export function themeDefinesColor(themeCss: string, tokenSuffix: string) {
  // e.g. secondary-default → --color-border-secondary-default
  return (
    themeCss.includes(`--color-border-${tokenSuffix}`) ||
    themeCss.includes(`--color-text-${tokenSuffix}`) ||
    themeCss.includes(`--color-background-${tokenSuffix}`)
  );
}
