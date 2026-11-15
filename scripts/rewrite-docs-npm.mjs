/**
 * Rewrite docs MDX to npm-first install + @joyui/react imports in examples.
 * Run: node ./scripts/rewrite-docs-npm.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, "../apps/docs/content/docs");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

/** Map local demo paths → public npm export name (best-effort). */
function rewriteImportPath(importPath) {
  // Keep docs-internal demo / docs helpers
  if (
    importPath.startsWith("@/components/demos") ||
    importPath.startsWith("@/components/docs") ||
    importPath.startsWith("@/components/home") ||
    importPath.startsWith("@/lib/") ||
    importPath.startsWith("@/utils/") ||
    importPath.startsWith("@/hooks/")
  ) {
    return null;
  }

  // Only rewrite example code that points at component sources
  if (
    importPath.startsWith("@/components/base/") ||
    importPath.startsWith("@/components/application/") ||
    importPath.startsWith("@/components/foundations/")
  ) {
    return "@joyui/react";
  }
  return null;
}

function rewriteInstallSection(src, slug) {
  // Replace CLI-only install blocks with npm-first
  const installRe =
    /## 安装\n\n(?:模板由下列组件组装，可按需安装源码：\n\n)?```bash\nnpx @joyui\/cli add[^\n]*\n```\n\n(?:或通过 JoyUI MCP \/ CLI 安装。\n)?/;

  const npmBlock = `## 安装

\`\`\`bash
pnpm add @joyui/react
\`\`\`

\`\`\`tsx
import { /* … */ } from "@joyui/react";
\`\`\`

主题与组件 CSS 已内置：\`@import "@joyui/react/styles.css"\`。可选源码拷贝：\`npx @joyui/cli add ${slug} --yes\`。

`;

  if (installRe.test(src)) {
    return src.replace(installRe, npmBlock);
  }

  // Variant without trailing note
  const installRe2 =
    /## 安装\n\n```bash\nnpx @joyui\/cli add[^\n]*\n```\n/;
  if (installRe2.test(src)) {
    return src.replace(installRe2, npmBlock);
  }

  return src;
}

function rewriteCodeImports(src) {
  // Inside fenced code / code={`...`} strings: @/components/{base|application|foundations}/...
  return src.replace(
    /from\s+["'](@\/components\/(?:base|application|foundations)\/[^"']+)["']/g,
    (match, importPath) => {
      const next = rewriteImportPath(importPath);
      if (!next) return match;
      return `from "${next}"`;
    },
  );
}

function main() {
  const files = walk(docsDir);
  let changed = 0;
  for (const file of files) {
    const slug = path.basename(file, ".mdx");
    // Skip overview / meta pages that aren't single-component install pages
    const skipSlugs = new Set([
      "index",
      "installation",
      "i18n",
      "mcp",
      "skill",
      "rtl",
      "color",
      "typography",
      "components",
      "icons",
      "base",
      "compounds",
      "charts",
      "templates",
      "plugins",
      "formatters",
    ]);

    let src = fs.readFileSync(file, "utf8");
    const before = src;

    if (!skipSlugs.has(slug)) {
      src = rewriteInstallSection(src, slug);
    }
    src = rewriteCodeImports(src);

    if (src !== before) {
      fs.writeFileSync(file, src);
      changed++;
      console.log("updated", path.relative(docsDir, file));
    }
  }
  console.log(`Done. ${changed}/${files.length} files updated.`);
}

main();
