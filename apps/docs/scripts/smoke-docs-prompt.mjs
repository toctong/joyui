import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");

// Lightweight smoke without TS path aliases: re-implement extract + sanitize checks.
const md = fs.readFileSync(
  path.join(docsRoot, "content/docs/composer.mdx"),
  "utf8",
);

function sanitizeDocsMarkdown(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/^import\s+.+;?\s*$/gm, "")
    .replace(/<ComponentDocPreview\b[^>]*\/>/g, "")
    .replace(/<DocApiSection\b[^>]*\/>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const cleaned = sanitizeDocsMarkdown(md);
const slugs = new Set();
for (const match of md.matchAll(/\bslug=["']([a-z0-9-]+)["']/g)) {
  slugs.add(match[1]);
}
for (const match of md.matchAll(/@joyui\/cli add ([a-z0-9-]+)/g)) {
  slugs.add(match[1]);
}

const required = [
  "composer",
  "composer-attachments",
  "composer-loader",
  "composer-panel",
];
for (const slug of required) {
  if (!slugs.has(slug)) {
    console.error("missing slug", slug);
    process.exit(1);
  }
}
if (cleaned.includes("ComponentDocPreview") || cleaned.includes("import {")) {
  console.error("sanitize failed");
  process.exit(1);
}
if (!cleaned.includes("对话输入面板") || !cleaned.includes("胶囊输入框")) {
  console.error("lost prose");
  process.exit(1);
}

console.log("ok slugs=", [...slugs].join(","));
console.log("cleaned chars=", cleaned.length);

// Ensure the TS module exists for the app build.
const promptModule = path.join(docsRoot, "lib/build-docs-prompt.ts");
if (!fs.existsSync(promptModule)) {
  console.error("missing build-docs-prompt.ts");
  process.exit(1);
}
console.log("module present");
