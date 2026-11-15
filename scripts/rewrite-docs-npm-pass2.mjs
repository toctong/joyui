/**
 * Second pass: replace remaining bare `npx @joyui/cli add …` fences with npm-first.
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

function main() {
  let changed = 0;
  for (const file of walk(docsDir)) {
    const slug = path.basename(file, ".mdx");
    if (slug === "installation") continue;

    let src = fs.readFileSync(file, "utf8");
    const before = src;

    // Bare fence: ```bash\nnpx @joyui/cli add foo --yes\n```
    src = src.replace(
      /```bash\nnpx @joyui\/cli add ([^\n]+)\n```/g,
      (_m, args) => {
        const names = String(args)
          .replace(/\s*--yes\s*$/, "")
          .trim();
        const primary = names.split(/\s+/)[0] || slug;
        return [
          "```bash",
          "pnpm add @joyui/react",
          "```",
          "",
          "```tsx",
          primary === "composer" || primary.startsWith("composer-")
            ? `import { /* … */ } from "@joyui/react/composer";`
            : `import { /* … */ } from "@joyui/react";`,
          "```",
          "",
          `主题 CSS 已内置：\`@import "@joyui/react/styles.css"\`。可选：\`npx @joyui/cli add ${names} --yes\`。`,
        ].join("\n");
      },
    );

    // Improve placeholder install imports when we know a common export
    const known = {
      button: "Button",
      input: "Input",
      select: "Select, SelectItem",
      modal: "Modal, ModalTrigger, Button",
      card: "Card",
      "data-table": "DataTable",
      "data-grid": "DataGrid",
      composer: "Composer",
      "admin-dashboard": "AdminDashboard",
      "revenue-chart-card": "RevenueChartCard",
      "stat-cards": "StatCards",
    };
    if (known[slug]) {
      const imp =
        slug === "composer"
          ? `import { ${known[slug]} } from "@joyui/react/composer";`
          : `import { ${known[slug]} } from "@joyui/react";`;
      src = src.replace(
        /```tsx\nimport \{ \/\* … \*\/ \} from "@joyui\/react(?:\/composer)?";\n```/,
        `\`\`\`tsx\n${imp}\n\`\`\``,
      );
    }

    if (src !== before) {
      fs.writeFileSync(file, src);
      changed++;
      console.log("updated", slug);
    }
  }
  console.log(`Pass2 done. ${changed} files.`);
}

main();
