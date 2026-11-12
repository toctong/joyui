/**
 * Generate per-component MDX docs + sidebar meta from the JoyUI catalogue.
 * Run: node scripts/generate-joyui-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "apps/docs/content/docs");

/** @typedef {{ slug: string, title: string, description: string, install?: string, tier?: 'free'|'pro', isNew?: boolean, sections?: string[] }} DocEntry */

/** @type {DocEntry[]} */
const quickStart = [
  {
    slug: "index",
    title: "开始使用",
    description: "JoyUI 文档站：React + Tailwind v4 高保真组件与模板。",
  },
  {
    slug: "installation",
    title: "安装",
    description: "用 JoyUI CLI / MCP 把组件源码安装进项目。",
  },
  {
    slug: "mcp",
    title: "MCP 服务器",
    description: "连接 Cursor / VS Code，让智能体浏览并安装组件。",
  },
  {
    slug: "skill",
    title: "智能体技能",
    description: "安装 JoyUI Agent Skill，让编码智能体始终加载设计规则。",
    isNew: true,
  },
  {
    slug: "rtl",
    title: "RTL 支持",
    description: "DirectionProvider、逻辑样式与从右向左布局。",
    isNew: true,
  },
];

/** @type {DocEntry[]} */
const foundations = [
  {
    slug: "color",
    title: "颜色",
    description: "语义色 token：文字、表面、边框、状态与图表色。",
  },
  {
    slug: "typography",
    title: "字体排版",
    description: "JoyUI 字阶：复合 text-{family}-{weight} 工具类。",
  },
  {
    slug: "components",
    title: "组件",
    description: "基础 · 组合 · 图表 · 模板分区总览。",
  },
  {
    slug: "icons",
    title: "图标",
    description: "使用 @remixicon/react 组件引用，配合语义图标色。",
  },
];

/** @type {DocEntry[]} */
const base = [
  { slug: "accordion", title: "手风琴", description: "就地展开的分区，含分割、容器与分离样式。", isNew: true },
  { slug: "announcement", title: "公告", description: "侧边栏页脚用的可关闭公告卡片。" },
  { slug: "avatar", title: "头像", description: "图片或首字母头像，多种尺寸与色调。" },
  { slug: "badge", title: "徽标", description: "计数胶囊与键盘快捷提示。" },
  { slug: "breadcrumb", title: "面包屑导航", description: "可带图标的路径面包屑。" },
  { slug: "button", title: "按钮", description: "主按钮、次按钮、幽灵与危险操作，三档尺寸。" },
  { slug: "button-group", title: "按钮组", description: "熔合成一条边框控件的可选按钮行。" },
  { slug: "carousel", title: "轮播", description: "CSS scroll-snap 画廊：滑动、箭头与位置指示。", isNew: true },
  { slug: "checkbox", title: "复选框", description: "带动画勾选与半选状态，含卡片变体。" },
  { slug: "chip", title: "标签", description: "状态/增减标签，粗体与柔和变体。" },
  { slug: "close-button", title: "关闭按钮", description: "横幅、模态与芯片上的紧凑关闭控件。" },
  { slug: "color-picker", title: "颜色选择器", description: "饱和度、色相、透明度、hex 与预设。", isNew: true },
  { slug: "combobox", title: "组合框", description: "输入即过滤列表，支持分区与自定义值。", isNew: true },
  { slug: "command-palette", title: "命令面板", description: "⌘K 可搜索命令面板，含分区与快捷键。", isNew: true },
  { slug: "context-menu", title: "上下文菜单", description: "右键 / 长按菜单，含子菜单与可勾选项。", isNew: true },
  { slug: "date-calendar", title: "日期日历", description: "页面内月份日历，支持单日或区间。", isNew: true },
  { slug: "date-picker", title: "日期选择器", description: "带月份导航的单日弹出日历。" },
  { slug: "divider", title: "分割线", description: "单线、双线、填充与对齐分隔。", isNew: true },
  { slug: "drawer", title: "抽屉", description: "从任意边滑入的面板与底部表单。", isNew: true },
  { slug: "dropdown", title: "下拉菜单", description: "可组合弹出菜单：触发器、分组与行。" },
  { slug: "file-upload", title: "文件上传", description: "拖放上传，含校验、进度与完成回调。" },
  { slug: "icon-button", title: "图标按钮", description: "方形纯图标按钮，两档尺寸。" },
  { slug: "input", title: "输入框", description: "带标签、提示、错误态与前置图标的文本输入。" },
  { slug: "input-otp", title: "OTP 输入", description: "每位一格的验证码输入，支持粘贴与自动填充。" },
  { slug: "kbd", title: "键盘提示", description: "快捷键提示胶囊。" },
  { slug: "link-button", title: "链接按钮", description: "链接样式的行内文本操作。" },
  { slug: "meter", title: "计量条", description: "已知范围内的用量（存储、席位、配额）。", isNew: true },
  { slug: "modal", title: "模态框", description: "遮罩上的对话框与危险确认。", isNew: true },
  { slug: "notification", title: "通知", description: "带状态图标、头像、操作与倒计时的通知。" },
  { slug: "number-field", title: "数字输入", description: "步进器、货币/百分比/单位与上下限。", isNew: true },
  { slug: "pagination", title: "分页", description: "带省略折叠的数字分页。" },
  { slug: "popover", title: "气泡卡片", description: "锚定触发器的自由内容，可选箭头。", isNew: true },
  { slug: "progress", title: "进度", description: "条形与环形进度，确定或不确定。", isNew: true },
  { slug: "radio", title: "单选", description: "渐变选中点，两档尺寸，含卡片变体。" },
  { slug: "search-field", title: "搜索框", description: "可清除的搜索输入，支持加载态。", isNew: true },
  { slug: "segmented-control", title: "分段控件", description: "周/月/年等滑动胶囊切换。" },
  { slug: "select", title: "选择框", description: "样式化触发器与非模态弹出列表。" },
  { slug: "skeleton", title: "骨架屏", description: "内容形占位，加载后模糊淡入。", isNew: true },
  { slug: "slider", title: "滑块", description: "单值与区间滑块，带数值气泡。", isNew: true },
  { slug: "social-button", title: "社交按钮", description: "24 家提供商登录按钮，含品牌标志。" },
  { slug: "spinner", title: "加载指示", description: "三层轨道光环加载动画。", isNew: true },
  { slug: "switch", title: "开关", description: "拟物拨动开关，两档尺寸，含卡片变体。" },
  { slug: "table", title: "表格", description: "与仪表盘一致的静态表格原语。" },
  { slug: "tabs", title: "选项卡", description: "下划线与胶囊两种选项卡。" },
  { slug: "tag-group", title: "标签组", description: "可选或可移除标签，键盘导航。", isNew: true },
  { slug: "textarea", title: "多行输入", description: "自动增高与字数统计的多行字段。", isNew: true },
  { slug: "time-field", title: "时间输入", description: "按段输入的时间字段。", isNew: true },
  { slug: "toast", title: "轻提示", description: "任意处 toast()，堆叠为通知卡片。", isNew: true },
  { slug: "tooltip", title: "工具提示", description: "悬停与焦点时的轻表面提示。" },
  { slug: "tree-view", title: "树形视图", description: "可展开分支、选择与键盘导航的嵌套树。", isNew: true },
];

/** @type {DocEntry[]} */
const compounds = [
  { slug: "agent-creator", title: "智能体创建器", description: "动画头像、情绪与外形选择、资料与语音偏好。", tier: "pro", isNew: true, install: "agent-creator" },
  { slug: "agent-limits-card", title: "智能体额度", description: "上下文窗口用量、Token 分类与方案额度。", tier: "pro", isNew: true, install: "agent-limits-card" },
  { slug: "agent-progress", title: "智能体任务进度", description: "可折叠多步骤进度，动效状态。", tier: "pro", install: "agent-progress" },
  { slug: "agent-thinking", title: "智能体思考状态", description: "思考、搜索与写作状态指示。", isNew: true, install: "agent-thinking" },
  { slug: "auth-card", title: "身份验证卡片", description: "登录/注册与第三方登录按钮。", isNew: true, install: "auth-card" },
  { slug: "calendar", title: "日历", description: "含事件芯片与详情弹出的月历。", tier: "pro", install: "calendar" },
  { slug: "composer", title: "对话输入框", description: "附件与模型菜单、语音与发送、液态玻璃加载。", tier: "pro", isNew: true, install: "composer" },
  { slug: "composer-attachments", title: "输入框附件", description: "提示上方逐张落下的文件卡片与进度环。", tier: "pro", isNew: true, install: "composer-attachments" },
  { slug: "composer-loader", title: "输入框加载状态", description: "智能体工作时环绕输入框的虹彩光带。", isNew: true, install: "composer-loader" },
  { slug: "composer-panel", title: "对话输入面板", description: "两行输入：提示在上，控件与状态栏在下。", tier: "pro", isNew: true, install: "composer-panel" },
  {
    slug: "data-grid",
    title: "数据网格",
    description: "应用中的电子表格。编辑单元格、选择范围、筛选记录，并借助固定首列和实时汇总处理数千行数据。",
    install: "data-grid",
    sections: ["预览", "安装", "列与编辑", "搜索、筛选与导出", "键盘与剪贴板"],
  },
  { slug: "data-table", title: "数据表格", description: "筛选、排序与分页的 TanStack 数据表。", install: "data-table" },
  { slug: "notification-center", title: "通知中心", description: "分组活动收件箱，含未读与行内操作。", install: "notification-center" },
  { slug: "questionnaire", title: "问卷", description: "计划模式问答卡：逐步问题与高度动画。", tier: "pro", isNew: true, install: "questionnaire" },
  { slug: "settings-modal", title: "设置对话框", description: "多页设置对话框：通用、资料、工具与存储。", install: "settings-modal" },
  { slug: "sidebar", title: "侧边栏", description: "浮动仪表盘侧栏：团队菜单、导航与账户。", install: "sidebar" },
  { slug: "stat-cards", title: "指标卡片", description: "带增减芯片的 KPI 统计卡行。", isNew: true, install: "stat-cards" },
  { slug: "task-list", title: "任务列表", description: "逐步揭示的智能体任务流日志。", tier: "pro", isNew: true, install: "task-list" },
  { slug: "theme-toggle", title: "主题切换", description: "手动明暗切换，本地持久化。", install: "theme-toggle" },
  { slug: "web-search", title: "网页搜索", description: "展示智能体执行的搜索与访问来源。", tier: "pro", isNew: true, install: "web-search" },
];

/** @type {DocEntry[]} */
const charts = [
  { slug: "activity-rings-card", title: "活动圆环", description: "Apple Watch 风格同心目标环与统计瓷砖。", tier: "pro", install: "activity-rings-card" },
  { slug: "area-chart-card", title: "面积图", description: "堆叠/重叠/100% 面积系列与统计图块。", tier: "pro", isNew: true, install: "area-chart-card" },
  { slug: "bar-list-card", title: "条形列表", description: "带份额条的排名分解列表。", tier: "pro", isNew: true, install: "bar-list-card" },
  { slug: "combo-chart-card", title: "组合图表", description: "独立双轴上的柱+线组合图。", tier: "pro", isNew: true, install: "combo-chart-card" },
  { slug: "contributions-card", title: "贡献记录", description: "GitHub 风格贡献热力网格。", tier: "pro", install: "contributions-card" },
  { slug: "earnings-chart-card", title: "盈利图表", description: "带周期切换与悬停轮廓的柱状图卡。", tier: "pro", install: "earnings-chart-card" },
  { slug: "funnel-chart-card", title: "漏斗图", description: "锥形阶段与转换胶囊的漏斗。", tier: "pro", isNew: true, install: "funnel-chart-card" },
  { slug: "heatmap-chart-card", title: "热力图", description: "主题跟随色阶的矩阵热力图。", tier: "pro", isNew: true, install: "heatmap-chart-card" },
  { slug: "line-chart-card", title: "折线图", description: "曲线或折线区域图，带动画激活点。", tier: "pro", install: "line-chart-card" },
  { slug: "most-active-days-card", title: "最活跃日", description: "连续月历上的每日迷你活动环。", tier: "pro", install: "most-active-days-card" },
  { slug: "orders-chart-card", title: "订单图表", description: "今年与去年并列的月度订单柱图。", install: "orders-chart-card" },
  { slug: "radar-chart-card", title: "雷达图", description: "填充多边形雷达，悬停联动标题。", tier: "pro", isNew: true, install: "radar-chart-card" },
  { slug: "radial-chart-card", title: "径向图", description: "同心环、仪表与半规堆叠。", tier: "pro", isNew: true, install: "radial-chart-card" },
  { slug: "revenue-chart-card", title: "收入图表", description: "今年面积对去年虚线对照。", isNew: true, install: "revenue-chart-card" },
  { slug: "sankey-chart-card", title: "桑基图", description: "着色流与悬停隔离的桑基卡。", tier: "pro", isNew: true, install: "sankey-chart-card" },
  { slug: "scatter-chart-card", title: "散点图", description: "分组散点/气泡与统计图块。", tier: "pro", isNew: true, install: "scatter-chart-card" },
  { slug: "sleep-score-card", title: "睡眠评分", description: "分段评分环与子分项。", tier: "pro", install: "sleep-score-card" },
  { slug: "stage-bars-card", title: "阶段条", description: "漏斗阶段为圆角水平胶囊。", tier: "pro", isNew: true, install: "stage-bars-card" },
  { slug: "steps-card", title: "步数图表", description: "周步数柱图与目标标记。", tier: "pro", install: "steps-card" },
];

/** @type {DocEntry[]} */
const templates = [
  {
    slug: "admin-dashboard",
    title: "后台管理",
    description: "侧栏导航、KPI、收入/订单图表与数据表组装的后台控制台。",
    isNew: true,
    install: "sidebar",
  },
];

const KEEP = new Set([
  "index.mdx",
  "installation.mdx",
  "mcp.mdx",
  "color.mdx",
  "typography.mdx",
  "plugins.mdx",
  "formatters.mdx",
  "meta.json",
]);

function frontmatter(entry) {
  const lines = [
    "---",
    `title: ${JSON.stringify(entry.title)}`,
    `description: ${JSON.stringify(entry.description)}`,
  ];
  if (entry.isNew) lines.push('badge: "全新"');
  lines.push("---", "");
  return lines.join("\n");
}

function componentMdx(entry) {
  const install = entry.install ?? entry.slug;
  const isPro = entry.tier === "pro";
  const sections = entry.sections ?? ["预览", "安装"];

  let body = frontmatter(entry);
  body += `import { ComponentDocPreview, ProComponentDoc } from "@/components/demos/component-doc-preview";\n\n`;
  body += `${entry.description}\n\n`;

  if (sections.includes("预览")) {
    body += `## 预览\n\n`;
    if (isPro) {
      body += `<ProComponentDoc slug="${entry.slug}" name="${entry.title}" />\n\n`;
    } else {
      body += `<ComponentDocPreview slug="${entry.slug}" />\n\n`;
    }
  }

  if (sections.includes("安装")) {
    body += `## 安装\n\n`;
    body += `\`\`\`bash\nnpx @joyui/cli@latest add ${install} --yes\n\`\`\`\n\n`;
    body += `或通过 JoyUI MCP：\`install_components\` → \`${install}\`。\n\n`;
  }

  for (const section of sections) {
    if (section === "预览" || section === "安装") continue;
    body += `## ${section}\n\n`;
    if (entry.slug === "data-grid") {
      if (section === "列与编辑") {
        body += `列可调整宽度；单元格支持就地编辑。固定首列便于横向滚动时对照账户名。\n\n`;
      } else if (section === "搜索、筛选与导出") {
        body += `工具栏提供搜索、筛选、列显隐与 CSV 导出。汇总行显示 Sum / Avg 等实时聚合。\n\n`;
      } else if (section === "键盘与剪贴板") {
        body += `方向键移动焦点，Shift 扩展选区，复制/粘贴遵循电子表格习惯。\n\n`;
      }
    } else {
      body += `详见本页预览与安装说明。\n\n`;
    }
  }

  return body;
}

function writeSkill() {
  const content = `---
title: "智能体技能"
description: "安装 JoyUI Agent Skill，让编码智能体始终加载设计规则与目录。"
badge: "全新"
---

JoyUI 提供标准 Agent Skill（\`SKILL.md\`），覆盖完整组件目录、主题与页面模式。

## 安装

\`\`\`bash
npx @joyui/cli@latest skill
\`\`\`

全局：\`npx @joyui/cli@latest skill --global\`  
其他客户端：\`--client codex\` 或 \`--path <dir>\`

也可通过 MCP：\`install_skill\`。

## 文档

- 本仓库 `packages/cli/skill`
`;
  fs.writeFileSync(path.join(docsDir, "skill.mdx"), content);
}

function writeRtl() {
  const content = `---
title: "RTL 支持"
description: "DirectionProvider、逻辑样式与阿拉伯语/希伯来语布局。"
badge: "全新"
---

JoyUI 免费与 Pro 源码均支持 RTL。

## 安装 direction

\`\`\`bash
npx @joyui/cli@latest add direction --yes
\`\`\`

## 用法

\`\`\`tsx
import { DirectionProvider } from "@/components/foundations/direction/direction";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DirectionProvider locale="ar">{children}</DirectionProvider>
      </body>
    </html>
  );
}
\`\`\`

使用逻辑样式（\`ps\`/\`pe\`、\`ms\`/\`me\`、\`start\`/\`end\`）。邮箱、URL、OTP 保持 LTR。

完整指南见本仓库 [RTL](/docs/rtl) 文档。
`;
  fs.writeFileSync(path.join(docsDir, "rtl.mdx"), content);
}

function writeIcons() {
  const content = `---
title: "图标"
description: "使用 @remixicon/react 组件引用，配合语义图标色。"
---

JoyUI 文档站使用 [@remixicon/react](https://remixicon.com/)（3000+ 图标）。

## 规则

- 传**组件引用**，不要渲染元素：\`leadingIcon={RiAddLine}\`
- 颜色用语义 token：\`text-foreground-icon-primary\` … \`text-foreground-icon-quaternary\`
- RTL 下导航箭头用 \`directional-icon\` 工具镜像

## 示例

\`\`\`tsx
import { RiAddLine, RiArrowRightLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";

<Button leadingIcon={RiAddLine} trailingIcon={RiArrowRightLine}>
  New project
</Button>
\`\`\`
`;
  fs.writeFileSync(path.join(docsDir, "icons.mdx"), content);
}

function writeMeta() {
  const pages = [
    "---快速入门---",
    "index",
    "installation",
    "mcp",
    "skill",
    "rtl",
    "---基础规范---",
    "color",
    "typography",
    "components",
    "icons",
    "---基础组件---",
    ...base.map((e) => e.slug),
    "---组合组件---",
    ...compounds.map((e) => e.slug),
    "---图表---",
    ...charts.map((e) => e.slug),
    "---模板---",
    ...templates.map((e) => e.slug),
  ];

  fs.writeFileSync(
    path.join(docsDir, "meta.json"),
    `${JSON.stringify({ title: "文档", pages }, null, 2)}\n`,
  );
}

function main() {
  fs.mkdirSync(docsDir, { recursive: true });

  // Remove old overview-only pages that are replaced by per-component docs
  for (const file of fs.readdirSync(docsDir)) {
    if (!file.endsWith(".mdx")) continue;
    if (KEEP.has(file)) continue;
    // Keep plugins/formatters; wipe everything else that we'll regenerate or obsolete
    const slug = file.replace(/\.mdx$/, "");
    const obsolete = ["base", "compounds", "charts", "templates"];
    if (obsolete.includes(slug)) {
      fs.unlinkSync(path.join(docsDir, file));
    }
  }

  writeSkill();
  writeRtl();
  writeIcons();

  for (const entry of [...base, ...compounds, ...charts, ...templates]) {
    fs.writeFileSync(path.join(docsDir, `${entry.slug}.mdx`), componentMdx(entry));
  }

  // Refresh components overview
  const overview = `---
title: "组件"
description: "基础 · 组合 · 图表 · 模板分区总览。"
---

按基础 / 组合 / 图表 / 模板分区组织，侧栏已展开全部条目。

| 分区 | 数量 |
|------|------|
| 基础组件 | ${base.length} |
| 组合组件 | ${compounds.length} |
| 图表 | ${charts.length} |
| 模板 | ${templates.length} |

安装一律使用精确名称：\`npx @joyui/cli@latest add <name> --yes\`，或通过 JoyUI MCP。
`;
  fs.writeFileSync(path.join(docsDir, "components.mdx"), overview);

  writeMeta();

  const total =
    base.length + compounds.length + charts.length + templates.length;
  console.log(
    `Generated ${total} component pages + foundations/quick-start meta (${base.length} base, ${compounds.length} compounds, ${charts.length} charts, ${templates.length} templates).`,
  );
}

main();
