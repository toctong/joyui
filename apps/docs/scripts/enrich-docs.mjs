/**
 * Enrich thin component MDX pages with 应用场景 + API sections.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, "../content/docs");

const skip = new Set([
  "index.mdx",
  "installation.mdx",
  "mcp.mdx",
  "skill.mdx",
  "rtl.mdx",
  "color.mdx",
  "typography.mdx",
  "components.mdx",
  "icons.mdx",
  "plugins.mdx",
  "formatters.mdx",
  "close-button.mdx",
  "button.mdx",
  "input.mdx",
  "select.mdx",
]);

const scenarioByKind = {
  chart:
    "用于仪表盘 KPI 区：传入业务 series 即可替换演示数据，详见下方数据项 / API。",
  template:
    "完整页面模板：安装后按业务替换文案、路由与数据源；组成块见预览。",
  block:
    "组合块可直接嵌入应用壳：通过 props / data 接入业务状态，勿写死文案。",
  base: "将上方预览中的 props 换成业务文案与状态即可用于表单、工具栏或设置页。",
};

const chartSlugs = new Set([
  "activity-rings-card",
  "area-chart-card",
  "bar-list-card",
  "combo-chart-card",
  "contributions-card",
  "earnings-chart-card",
  "funnel-chart-card",
  "heatmap-chart-card",
  "line-chart-card",
  "most-active-days-card",
  "orders-chart-card",
  "radar-chart-card",
  "radial-chart-card",
  "revenue-chart-card",
  "sankey-chart-card",
  "scatter-chart-card",
  "sleep-score-card",
  "stage-bars-card",
  "steps-card",
  "stat-cards",
]);

const templateSlugs = new Set(["admin-dashboard"]);

const blockSlugs = new Set([
  "auth-card",
  "calendar",
  "composer",
  "composer-attachments",
  "composer-loader",
  "composer-panel",
  "data-grid",
  "data-table",
  "notification-center",
  "questionnaire",
  "settings-modal",
  "sidebar",
  "task-list",
  "theme-toggle",
  "web-search",
]);

function kindFor(slug) {
  if (chartSlugs.has(slug) || slug.endsWith("-card")) return "chart";
  if (templateSlugs.has(slug)) return "template";
  if (blockSlugs.has(slug)) return "block";
  return "base";
}

let updated = 0;
for (const file of fs.readdirSync(docsDir)) {
  if (!file.endsWith(".mdx") || skip.has(file)) continue;
  const full = path.join(docsDir, file);
  let src = fs.readFileSync(full, "utf8");
  if (src.includes("DocApiSection") || src.includes("## API")) continue;

  const slug = file.replace(/\.mdx$/, "");
  const kind = kindFor(slug);

  if (!src.includes("@/components/docs-api-section")) {
    const marker = 'from "@/components/demos/component-doc-preview";';
    const idx = src.indexOf(marker);
    if (idx !== -1) {
      const insertAt = idx + marker.length;
      src =
        src.slice(0, insertAt) +
        '\nimport { DocApiSection } from "@/components/docs-api-section";' +
        src.slice(insertAt);
    } else {
      src = src.replace(
        /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
        (fm) =>
          `${fm}import { DocApiSection } from "@/components/docs-api-section";\n`,
      );
    }
  }

  const append = `

## 应用场景

${scenarioByKind[kind]}

上方预览中的文案、选项与数据均可替换为业务配置；不要复制写死的演示常量到生产。

## API

<DocApiSection slug="${slug}" />
`;

  src = src.trimEnd() + "\n" + append + "\n";
  fs.writeFileSync(full, src, "utf8");
  updated += 1;
  console.log("enriched", slug, kind);
}

console.log("done, updated", updated);
