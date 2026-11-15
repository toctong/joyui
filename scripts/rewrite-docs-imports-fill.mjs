/**
 * Fill import placeholders using generated catalog exports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "apps/docs/content/docs");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "packages/cli/src/catalog.json"), "utf8"),
);
const byName = new Map(catalog.map((c) => [c.name, c]));

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function main() {
  let changed = 0;
  for (const file of walk(docsDir)) {
    let src = fs.readFileSync(file, "utf8");
    const before = src;
    const fileSlug = path.basename(file, ".mdx");

    src = src.replace(
      /```tsx\nimport \{ \/\* … \*\/ \} from "(@joyui\/react(?:\/composer)?)";\n```/g,
      (match) => {
        const idx = before.indexOf(match);
        const window = before.slice(Math.max(0, idx - 240), idx);
        const addMatch = window.match(/cli add ([a-z0-9-]+)/);
        const slug = addMatch?.[1] ?? fileSlug;
        const item = byName.get(slug);
        if (!item) return match;
        const exports = item.exports.slice(0, 4).join(", ");
        return [
          "```tsx",
          `import { ${exports} } from "${item.importFrom}";`,
          "```",
        ].join("\n");
      },
    );

    if (src !== before) {
      fs.writeFileSync(file, src);
      changed++;
      console.log("filled", fileSlug);
    }
  }
  console.log(`Filled imports in ${changed} files.`);
}

main();
