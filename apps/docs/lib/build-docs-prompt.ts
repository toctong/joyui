import { COMPONENT_DOC_CODES } from "@/components/demos/component-doc-codes";
import { DOCS_API } from "@/lib/docs-api/registry";

const MAX_MARKDOWN_CHARS = 10_000;

function toPascalCase(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function extractSlugs(markdown: string, primary?: string) {
  const found = new Set<string>();
  if (primary) found.add(primary);
  for (const match of markdown.matchAll(/\bslug=["']([a-z0-9-]+)["']/g)) {
    found.add(match[1]!);
  }
  for (const match of markdown.matchAll(/@joyui\/cli add ([a-z0-9-]+)/g)) {
    found.add(match[1]!);
  }
  return [...found];
}

/** Strip MDX imports / preview tags so the LLM sees prose + real code. */
export function sanitizeDocsMarkdown(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/^import\s+.+;?\s*$/gm, "")
    .replace(/<ComponentDocPreview\b[^>]*\/>/g, "")
    .replace(/<\/?ComponentDocPreview\b[^>]*>/g, "")
    .replace(/<DocApiSection\b[^>]*\/>/g, "")
    .replace(/<\/?DocApiSection\b[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatApiBlock(slug: string) {
  const entry = DOCS_API[slug];
  if (!entry) return null;
  const lines = [
    `### ${entry.caption} (\`${slug}\`)`,
    ...entry.props.map((prop) => {
      const bits = [
        `\`${prop.name}\``,
        prop.type ? `\`${prop.type}\`` : null,
        prop.defaultValue && prop.defaultValue !== "—"
          ? `默认 \`${prop.defaultValue}\``
          : null,
      ].filter(Boolean);
      return `- ${bits.join(" · ")} — ${prop.description}`;
    }),
  ];
  if (entry.data) {
    lines.push(`#### 数据：${entry.data.caption}`);
    for (const field of entry.data.fields) {
      lines.push(
        `- \`${field.name}\`${field.required ? "（必填）" : ""} \`${field.type}\` — ${field.description}${
          field.example ? ` 例：\`${field.example}\`` : ""
        }`,
      );
    }
  }
  return lines.join("\n");
}

function formatExamples(slugs: string[]) {
  const blocks: string[] = [];
  for (const slug of slugs) {
    const code = COMPONENT_DOC_CODES[slug];
    if (!code) continue;
    const exportName = DOCS_API[slug]?.caption ?? toPascalCase(slug);
    blocks.push(
      `### ${exportName} (\`${slug}\`)\n\`\`\`tsx\n${code.trim()}\n\`\`\``,
    );
  }
  return blocks.join("\n\n");
}

function formatInstall(slugs: string[]) {
  if (!slugs.length) {
    return "pnpm add @joyui/react\n# 应用样式：@import \"@joyui/react/styles.css\";";
  }
  return slugs
    .map((slug) => `npx @joyui/cli add ${slug} --yes`)
    .join("\n");
}

export type BuildDocsPromptInput = {
  pageUrl: string;
  title: string;
  description?: string;
  component?: string;
  markdown: string;
};

/**
 * Agent-ready prompt for a JoyUI docs page: concrete install, demos, API, and
 * the sanitized page markdown — not a vague “help me understand this page”.
 */
export function buildDocsPrompt({
  pageUrl,
  title,
  description,
  component,
  markdown,
}: BuildDocsPromptInput) {
  const cleaned = sanitizeDocsMarkdown(markdown);
  const slugs = extractSlugs(cleaned + "\n" + markdown, component);
  const apiBlocks = slugs
    .map(formatApiBlock)
    .filter((block): block is string => Boolean(block));
  const examples = formatExamples(slugs);
  const install = formatInstall(slugs);
  const docBody =
    cleaned.length > MAX_MARKDOWN_CHARS
      ? `${cleaned.slice(0, MAX_MARKDOWN_CHARS)}\n\n…（文档已截断，完整页：${pageUrl}）`
      : cleaned;

  const primaryLabel = component
    ? `${DOCS_API[component]?.caption ?? toPascalCase(component)} (\`${component}\`)`
    : title;

  return `你是熟悉 JoyUI（npm：@joyui/react）的前端实现助手。请按下方官方资料，在用户的 React + Tailwind CSS v4 项目里落地「${title}」。

## 目标组件
- 页面：${title}${description ? ` — ${description}` : ""}
- 文档：${pageUrl}
- 主组件：${primaryLabel}
${slugs.length ? `- 相关 slug：${slugs.map((s) => `\`${s}\``).join("、")}` : ""}

## 实现约束（必须遵守）
1. 优先 \`import { … } from "@joyui/react"\`；Composer 家族用 \`@joyui/react/composer\`（见安装文档 TipTap peers）。
2. 应用必须已有：\`@import "tailwindcss";\` + \`@import "@joyui/react/styles.css";\`（含 Table / Skeleton 等组件 CSS，勿在业务里手写 \`.bui-*\`）。
3. 只用 JoyUI 语义 token（\`text-text-*\` / \`bg-background-*\` / \`border-border-*\` / 字阶如 \`text-body-medium\`），禁止 raw hex / 随意 \`text-sm font-medium\`。
4. 类名合并用 \`cx\`（\`@joyui/react\`）；图标传 \`@remixicon/react\` 组件引用。
5. 输出可运行的 JSX/TSX；改 props 时对照下列 API，不要臆造不存在的 API。

## 安装
\`\`\`bash
${install}
\`\`\`

## 官方示例
${examples || "（本页未匹配到 COMPONENT_DOC_CODES，请以下方文档代码块为准）"}

## API 要点
${apiBlocks.length ? apiBlocks.join("\n\n") : "（见下方文档正文中的 props 说明）"}

## 文档正文（已去掉 MDX 预览标签）
${docBody || "（未能加载文档正文，请打开上方文档 URL）"}

请先确认用户要整库引用还是 CLI 拷贝源码，再给出最小可运行示例，并说明关键 props / 常见坑。`;
}
