import type { DocsApiEntry } from "./types";

const commonClass: DocsApiEntry["props"][number] = {
  name: "className",
  description: "合并到根节点的额外类名。",
  type: "string",
  options: "—",
  defaultValue: "—",
};

function entry(caption: string, props: DocsApiEntry["props"], data?: DocsApiEntry["data"]): DocsApiEntry {
  return { caption, props: [...props, commonClass], data };
}

/** Central API + data-item catalog for component docs. */
export const DOCS_API: Record<string, DocsApiEntry> = {
  button: entry("Button", [
    { name: "variant", description: "视觉语义：主操作 / 次要 / 幽灵 / 危险。", type: '"primary" | "secondary" | "ghost" | "danger"', options: "primary · secondary · ghost · danger", defaultValue: "primary" },
    { name: "size", description: "高度：36 / 32 / 24px。", type: '"medium" | "small" | "xs"', options: "medium · small · xs", defaultValue: "medium" },
    { name: "leadingIcon", description: "前置图标组件引用（传 RiXxx）。", type: "ComponentType", options: "—", defaultValue: "—" },
    { name: "trailingIcon", description: "后置图标组件引用。", type: "ComponentType", options: "—", defaultValue: "—" },
    { name: "iconOnly", description: "仅图标；需 aria-label。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "disabled", description: "禁用。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "children", description: "按钮文案。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  "close-button": entry("CloseButton", [
    { name: "size", description: "点击区域与笔画权重。", type: '"2xs" | "xs" | "sm" | "md"', options: "2xs · xs · sm · md", defaultValue: "xs" },
    { name: "aria-label", description: "无障碍名称（必填）。", type: "string", options: "—", defaultValue: "—" },
  ]),
  "color-picker": entry("ColorPicker / ColorWell", [
    { name: "value", description: "受控颜色（hex 或 React Aria Color）。", type: "string | Color", options: "—", defaultValue: "—" },
    { name: "defaultValue", description: "非受控初始色。", type: "string | Color", options: "—", defaultValue: "—" },
    { name: "onChange", description: "颜色变化回调。", type: "(color: Color) => void", options: "—", defaultValue: "—" },
    { name: "swatches", description: "预设色板（hex 数组）。", type: "string[]", options: "—", defaultValue: "—" },
    { name: "showAlpha", description: "显示不透明度轨。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "aria-label (Well)", description: "色井无障碍名称（必填）。", type: "string", options: "—", defaultValue: "—" },
    { name: "wellClassName", description: "色井圆形尺寸类名。", type: "string", options: "—", defaultValue: "—" },
  ]),
  "icon-button": entry("IconButton", [
    { name: "icon", description: "图标组件引用。", type: "ComponentType", options: "—", defaultValue: "—" },
    { name: "size", description: "尺寸。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
    { name: "aria-label", description: "无障碍名称（必填）。", type: "string", options: "—", defaultValue: "—" },
  ]),
  "link-button": entry("LinkButton", [
    { name: "variant", description: "主色 / 次要。", type: '"primary" | "secondary"', options: "primary · secondary", defaultValue: "primary" },
    { name: "size", description: "字号档位。", type: '"medium" | "small" | "xs"', options: "medium · small · xs", defaultValue: "medium" },
    { name: "href", description: "链接地址。", type: "string", options: "—", defaultValue: "—" },
  ]),
  input: entry("Input", [
    { name: "label", description: "字段标签。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "placeholder", description: "占位文案。", type: "string", options: "—", defaultValue: "—" },
    { name: "hint", description: "辅助说明。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "errorMessage", description: "校验错误文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "leadingIcon", description: "左侧图标引用。", type: "ComponentType", options: "—", defaultValue: "—" },
    { name: "isDisabled", description: "禁用。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "isRequired", description: "必填。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "type", description: "原生 type。", type: "string", options: "text · email · password · …", defaultValue: "text" },
  ]),
  textarea: entry("Textarea", [
    { name: "label", description: "字段标签。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "placeholder", description: "占位。", type: "string", options: "—", defaultValue: "—" },
    { name: "hint", description: "辅助说明。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "errorMessage", description: "错误文案。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  select: entry(
    "Select",
    [
      { name: "label", description: "标签。", type: "ReactNode", options: "—", defaultValue: "—" },
      { name: "placeholder", description: "未选中文案。", type: "string", options: "—", defaultValue: "—" },
      { name: "size", description: "密度。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
      { name: "selectedKey", description: "受控选中。", type: "Key", options: "—", defaultValue: "—" },
      { name: "onSelectionChange", description: "选中回调。", type: "(key) => void", options: "—", defaultValue: "—" },
    ],
    {
      caption: "SelectItem",
      fields: [
        { name: "id", description: "选项键。", type: "Key", required: true, example: '"eu"' },
        { name: "children", description: "展示内容。", type: "ReactNode", required: true, example: "Europe" },
        { name: "isDisabled", description: "禁用项。", type: "boolean", required: false, example: "false" },
      ],
    },
  ),
  checkbox: entry("Checkbox", [
    { name: "children", description: "标签。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "isSelected", description: "受控选中。", type: "boolean", options: "true · false", defaultValue: "—" },
    { name: "defaultSelected", description: "默认选中。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "isIndeterminate", description: "半选。", type: "boolean", options: "true · false", defaultValue: "false" },
  ]),
  switch: entry("Switch", [
    { name: "size", description: "尺寸。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
    { name: "isSelected", description: "受控。", type: "boolean", options: "true · false", defaultValue: "—" },
    { name: "defaultSelected", description: "默认开。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "aria-label", description: "无可见标签时必填。", type: "string", options: "—", defaultValue: "—" },
  ]),
  radio: entry("RadioGroup / Radio", [
    { name: "label", description: "组标签。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "orientation", description: "方向。", type: '"horizontal" | "vertical"', options: "horizontal · vertical", defaultValue: "vertical" },
    { name: "value", description: "选中值。", type: "string", options: "—", defaultValue: "—" },
    { name: "value (Radio)", description: "选项值。", type: "string", options: "—", defaultValue: "—" },
  ]),
  accordion: entry(
    "Accordion",
    [
      { name: "variant", description: "样式。", type: '"divided" | "contained" | "separated"', options: "divided · contained · separated", defaultValue: "divided" },
      { name: "defaultExpandedKeys", description: "默认展开。", type: "Key[]", options: "—", defaultValue: "[]" },
      { name: "id (Item)", description: "项 id。", type: "Key", options: "—", defaultValue: "—" },
      { name: "title (Item)", description: "标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    ],
    {
      caption: "AccordionItem 数据",
      fields: [
        { name: "id", description: "项 id。", type: "string", required: true, example: '"billing"' },
        { name: "title", description: "标题。", type: "string", required: true, example: '"如何计费？"' },
        { name: "content", description: "内容。", type: "ReactNode", required: true, example: "—" },
      ],
    },
  ),
  badge: entry("Badge", [{ name: "children", description: "徽标内容。", type: "ReactNode", options: "—", defaultValue: "—" }]),
  avatar: entry("Avatar", [
    { name: "src", description: "图片地址。", type: "string", options: "—", defaultValue: "—" },
    { name: "alt", description: "替代文本。", type: "string", options: "—", defaultValue: "—" },
    { name: "initials", description: "缩写。", type: "string", options: "—", defaultValue: "—" },
    { name: "size", description: "尺寸。", type: "string", options: "—", defaultValue: "—" },
  ]),
  chip: entry("Chip", [
    { name: "children", description: "文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "variant", description: "强调 / 柔和。", type: "string", options: "—", defaultValue: "—" },
    { name: "color", description: "色板。", type: "string", options: "—", defaultValue: "—" },
  ]),
  modal: entry("Modal", [
    { name: "isOpen", description: "受控打开。", type: "boolean", options: "true · false", defaultValue: "—" },
    { name: "onOpenChange", description: "开关回调。", type: "(open: boolean) => void", options: "—", defaultValue: "—" },
  ]),
  drawer: entry("Drawer", [
    { name: "placement", description: "滑出方向。", type: "string", options: "—", defaultValue: "—" },
    { name: "isOpen", description: "受控打开。", type: "boolean", options: "true · false", defaultValue: "—" },
  ]),
  toast: entry("toast / Toaster", [
    { name: "toast.success", description: "成功提示。", type: "(title, options?) => id", options: "—", defaultValue: "—" },
    { name: "toast.error", description: "错误提示。", type: "(title, options?) => id", options: "—", defaultValue: "—" },
  ]),
  tabs: entry("Tabs", [
    { name: "variant", description: "下划线 / 胶囊。", type: "string", options: "—", defaultValue: "—" },
    { name: "selectedKey", description: "受控选中。", type: "Key", options: "—", defaultValue: "—" },
  ]),
  pagination: entry("Pagination", [
    { name: "page", description: "当前页。", type: "number", options: "—", defaultValue: "—" },
    { name: "total", description: "总页数或总数。", type: "number", options: "—", defaultValue: "—" },
    { name: "onChange", description: "翻页回调。", type: "(page) => void", options: "—", defaultValue: "—" },
  ]),
  progress: entry("Progress", [
    { name: "value", description: "进度 0–100。", type: "number", options: "—", defaultValue: "—" },
    { name: "label", description: "标签。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  slider: entry("Slider", [
    { name: "value", description: "受控值。", type: "number | number[]", options: "—", defaultValue: "—" },
    { name: "minValue / maxValue", description: "范围。", type: "number", options: "—", defaultValue: "—" },
  ]),
  "file-upload": entry("FileUpload", [
    { name: "onUploadComplete", description: "上传完成回调。", type: "(file: File) => void", options: "—", defaultValue: "—" },
    { name: "allowedExtensions", description: "允许扩展名。", type: "string[]", options: "—", defaultValue: "pdf,jpg,png,xlsx" },
    { name: "maxBytes", description: "最大字节。", type: "number", options: "—", defaultValue: "8MB" },
  ]),
  "data-grid": entry(
    "DataGrid",
    [
      { name: "data", description: "行数据。", type: "T[]", options: "—", defaultValue: "—" },
      { name: "columns", description: "列定义。", type: "DataGridColumn<T>[]", options: "—", defaultValue: "—" },
      { name: "getRowId", description: "行键。", type: "(row) => string", options: "—", defaultValue: "—" },
      { name: "onDataChange", description: "编辑回写。", type: "(next) => void", options: "—", defaultValue: "—" },
      { name: "height", description: "可视高度。", type: "number", options: "—", defaultValue: "—" },
    ],
    {
      caption: "DataGridColumn",
      fields: [
        { name: "key", description: "字段。", type: "string", required: true, example: '"account"' },
        { name: "header", description: "表头。", type: "string", required: true, example: '"Account"' },
        { name: "width", description: "列宽。", type: "number", required: false, example: "180" },
        { name: "type", description: "编辑类型。", type: '"text"|"number"|"select"', required: false, example: '"select"' },
        { name: "options", description: "select 选项。", type: "string[]", required: false, example: '["EU"]' },
      ],
    },
  ),
  composer: entry(
    "Composer",
    [
      { name: "models", description: "型号列表。", type: "ComposerModel[]", options: "—", defaultValue: "内置" },
      { name: "defaultModelId", description: "默认型号。", type: "string", options: "—", defaultValue: "fable-5" },
      { name: "placeholder", description: "占位。", type: "string", options: "—", defaultValue: "有什么问题就问我" },
      { name: "branch", description: "分支名。", type: "string", options: "—", defaultValue: "主要" },
      { name: "project", description: "项目名。", type: "string", options: "—", defaultValue: "项目海" },
      { name: "contextPct", description: "上下文占比。", type: "number", options: "0–100", defaultValue: "57" },
    ],
    {
      caption: "ComposerModel",
      fields: [
        { name: "id", description: "型号 id。", type: "string", required: true, example: '"fable-5"' },
        { name: "name", description: "展示名。", type: "string", required: true, example: '"Fable 5"' },
      ],
    },
  ),
  "composer-panel": entry("ComposerPanel", [
    { name: "placeholder", description: "富文本占位。", type: "string", options: "—", defaultValue: "—" },
    { name: "branch / project / modeLabel", description: "状态与权限文案。", type: "string", options: "—", defaultValue: "—" },
    { name: "contextPct", description: "上下文占比。", type: "number", options: "0–100", defaultValue: "57" },
    { name: "attachments", description: "附件。", type: "ComposerAttachment[]", options: "—", defaultValue: "—" },
    { name: "mentions", description: "@ 候选项。", type: "MentionItem[]", options: "—", defaultValue: "内置" },
  ]),
  "composer-attachments": entry(
    "ComposerWithAttachments",
    [{ name: "attachments", description: "附件列表；progress 驱动上传态。", type: "ComposerAttachment[]", options: "—", defaultValue: "演示数据" }],
    {
      caption: "ComposerAttachment",
      fields: [
        { name: "id", description: "id。", type: "string", required: true, example: '"demo-png"' },
        { name: "name", description: "文件名。", type: "string", required: true, example: '"a.png"' },
        { name: "kind", description: "类型。", type: '"image"|"document"|"spreadsheet"|"file"', required: true, example: '"image"' },
        { name: "progress", description: "0 动画；100 成功。", type: "number", required: false, example: "0" },
      ],
    },
  ),
  "stat-cards": entry("StatCards", [
    { name: "items", description: "KPI 卡片数据（若组件支持传入）。", type: "StatItem[]", options: "—", defaultValue: "内置演示" },
  ]),
  alert: entry("Alert", [
    { name: "tone", description: "语义色。", type: '"info" | "success" | "warning" | "error"', options: "info · success · warning · error", defaultValue: "info" },
    { name: "title", description: "标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "children", description: "正文。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "icon", description: "覆盖默认图标。", type: "ComponentType", options: "—", defaultValue: "按 tone" },
  ]),
  card: entry("Card", [
    { name: "variant", description: "描边 / 柔和底 / 透明。", type: '"outline" | "soft" | "ghost"', options: "outline · soft · ghost", defaultValue: "outline" },
    { name: "padding", description: "内边距。", type: '"none" | "sm" | "md" | "lg"', options: "none · sm · md · lg", defaultValue: "md" },
    { name: "children", description: "内容。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  "empty-state": entry("EmptyState", [
    { name: "title", description: "主文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "description", description: "补充说明。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "icon", description: "Remix Icon 组件引用。", type: "ComponentType", options: "—", defaultValue: "RiInbox2Line" },
    { name: "action", description: "CTA 插槽。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "size", description: "密度。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
  ]),
  "page-header": entry("PageHeader", [
    { name: "title", description: "页面标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "description", description: "副标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "actions", description: "右侧操作区。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  list: entry("List / ListItem", [
    { name: "divided (List)", description: "行间分隔线。", type: "boolean", options: "true · false", defaultValue: "true" },
    { name: "title (Item)", description: "主文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "description (Item)", description: "次文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "leading / trailing", description: "左右插槽。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "interactive", description: "可点击行样式。", type: "boolean", options: "true · false", defaultValue: "false" },
  ]),
  "media-card": entry("MediaCard", [
    { name: "title", description: "标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "subtitle", description: "副标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "src", description: "封面 URL。", type: "string | null", options: "—", defaultValue: "—" },
    { name: "action", description: "标题下操作区。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "footer", description: "封面底部叠加内容。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  steps: entry("Steps", [
    { name: "steps", description: "步骤数组。", type: "StepItem[]", options: "—", defaultValue: "—" },
    { name: "current", description: "当前步（从 0 起）。", type: "number", options: "—", defaultValue: "0" },
    { name: "orientation", description: "方向。", type: '"horizontal" | "vertical"', options: "horizontal · vertical", defaultValue: "horizontal" },
  ]),
  timeline: entry("Timeline / TimelineItem", [
    { name: "title", description: "主文案。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "description", description: "说明。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "time", description: "时间标签。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "tone", description: "圆点色。", type: '"neutral" | "success" | "warning" | "error" | "info"', options: "—", defaultValue: "neutral" },
  ]),
  "description-list": entry("DescriptionList", [
    { name: "columns", description: "列数。", type: "1 | 2", options: "1 · 2", defaultValue: "1" },
    { name: "term / children (Item)", description: "键与值。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  "copy-button": entry("CopyButton", [
    { name: "value", description: "要复制的文本。", type: "string", options: "—", defaultValue: "—" },
    { name: "aria-label", description: "复制前无障碍名。", type: "string", options: "—", defaultValue: '"Copy"' },
    { name: "copiedLabel", description: "复制成功后无障碍名。", type: "string", options: "—", defaultValue: '"Copied"' },
    { name: "resetMs", description: "勾选态持续时间。", type: "number", options: "—", defaultValue: "1600" },
  ]),
  "section-header": entry("SectionHeader", [
    { name: "title", description: "分区标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "description", description: "说明。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "actions", description: "右侧操作。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "level", description: "标题级别。", type: "2 | 3 | 4", options: "2 · 3 · 4", defaultValue: "2" },
  ]),
  "text-link": entry("TextLink", [
    { name: "size", description: "字号。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
    { name: "muted", description: "次级色，悬停变品牌色。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "href", description: "链接地址。", type: "string", options: "—", defaultValue: "—" },
  ]),
  rating: entry("Rating", [
    { name: "value", description: "当前分值。", type: "number", options: "0–max", defaultValue: "0" },
    { name: "max", description: "满分。", type: "number", options: "—", defaultValue: "5" },
    { name: "interactive", description: "可点选。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "size", description: "星星尺寸。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
    { name: "onChange", description: "interactive 时回调。", type: "(value: number) => void", options: "—", defaultValue: "—" },
  ]),
  collapsible: entry("Collapsible", [
    { name: "title", description: "触发标题。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "children", description: "展开内容。", type: "ReactNode", options: "—", defaultValue: "—" },
    { name: "defaultExpanded", description: "默认展开。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "isExpanded", description: "受控展开。", type: "boolean", options: "—", defaultValue: "—" },
  ]),
  "qr-code": entry("QrCode", [
    { name: "value", description: "编码内容。", type: "string", options: "—", defaultValue: "—" },
    { name: "size", description: "边长 px。", type: "number", options: "—", defaultValue: "160" },
    { name: "level", description: "纠错级别。", type: '"L" | "M" | "Q" | "H"', options: "L · M · Q · H", defaultValue: "M" },
    { name: "margin", description: "静区模块数。", type: "number", options: "—", defaultValue: "2" },
    { name: "color", description: "模块色。", type: "string", options: "CSS colour", defaultValue: "currentColor" },
    { name: "backgroundColor", description: "背景色。", type: "string", options: "CSS colour", defaultValue: "transparent" },
    { name: "overlay", description: "中心叠加（Logo）。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  barcode: entry("Barcode", [
    { name: "value", description: "条码内容。", type: "string", options: "—", defaultValue: "—" },
    { name: "format", description: "编码格式。", type: "BarcodeFormat", options: "CODE128 · EAN13 · UPC · …", defaultValue: "CODE128" },
    { name: "height", description: "条高 px。", type: "number", options: "—", defaultValue: "64" },
    { name: "width", description: "模块宽 px。", type: "number", options: "—", defaultValue: "2" },
    { name: "displayValue", description: "是否显示文字。", type: "boolean", options: "true · false", defaultValue: "true" },
    { name: "lineColor", description: "条色。", type: "string", options: "CSS colour", defaultValue: "currentColor" },
  ]),
  "border-beam": entry("BorderBeam", [
    { name: "borderWidth", description: "描边厚度。", type: "number", options: "px", defaultValue: "1.5" },
    { name: "duration", description: "一圈时长。", type: "number", options: "秒", defaultValue: "8" },
    { name: "delay", description: "启动延迟。", type: "number", options: "秒", defaultValue: "0" },
    { name: "color", description: "光束主色。", type: "string", options: "CSS colour", defaultValue: "accent-500" },
    { name: "colorFrom", description: "光束尾色。", type: "string", options: "CSS colour", defaultValue: "accent-300" },
    { name: "children", description: "被包裹的内容。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  marquee: entry("Marquee", [
    { name: "duration", description: "一整圈时长。", type: "number", options: "秒", defaultValue: "28" },
    { name: "reverse", description: "反向滚动。", type: "boolean", options: "true · false", defaultValue: "false" },
    { name: "pauseOnHover", description: "悬停暂停。", type: "boolean", options: "true · false", defaultValue: "true" },
    { name: "fade", description: "两端淡出。", type: "boolean", options: "true · false", defaultValue: "true" },
    { name: "repeat", description: "内容复制次数（≥2）。", type: "number", options: "—", defaultValue: "2" },
    { name: "children", description: "滚动内容。", type: "ReactNode", options: "—", defaultValue: "—" },
  ]),
  "number-ticker": entry("NumberTicker", [
    { name: "value", description: "目标数值。", type: "number", options: "—", defaultValue: "—" },
    { name: "from", description: "起始值。", type: "number", options: "—", defaultValue: "0" },
    { name: "duration", description: "动画时长。", type: "number", options: "ms", defaultValue: "1400" },
    { name: "precision", description: "小数位。", type: "number", options: "—", defaultValue: "0" },
    { name: "prefix / suffix", description: "前后缀。", type: "string", options: "—", defaultValue: '""' },
    { name: "startOnView", description: "进入视口后开始。", type: "boolean", options: "true · false", defaultValue: "true" },
    { name: "locale", description: "数字本地化。", type: "string", options: "BCP 47", defaultValue: "运行时" },
  ]),
  "data-table": entry(
    "DataTable",
    [
      { name: "aria-label", description: "表格无障碍名称（必填）。", type: "string", options: "—", defaultValue: "—" },
      { name: "data", description: "行数据。", type: "T[]", options: "—", defaultValue: "—" },
      { name: "columns", description: "列定义。", type: "DataTableColumn<T>[]", options: "—", defaultValue: "—" },
      { name: "getRowId", description: "稳定行 id。", type: "(row: T) => string", options: "—", defaultValue: "—" },
      { name: "pageSize", description: "每页行数。", type: "number", options: "—", defaultValue: "10" },
      { name: "emptyState", description: "空数据占位。", type: "ReactNode", options: "—", defaultValue: '"No results."' },
      { name: "size", description: "行高。", type: '"sm" | "md"', options: "sm · md", defaultValue: "md" },
    ],
    {
      caption: "DataTableColumn",
      fields: [
        { name: "id", description: "列 id。", type: "string", required: true, example: '"fileName"' },
        { name: "header", description: "表头。", type: "ReactNode", required: true, example: '"Original"' },
        { name: "accessorKey", description: "字段键。", type: "keyof T", required: false, example: '"fileName"' },
        { name: "cell", description: "自定义单元格。", type: "(row: T) => ReactNode", required: false, example: "(r) => r.name" },
      ],
    },
  ),
  "revenue-chart-card": entry("RevenueChartCard", [
    { name: "data", description: "月度营收序列。", type: "SeriesPoint[]", options: "—", defaultValue: "内置演示" },
  ]),
};

/** Pascal-ish caption from slug for fallback tables. */
function captionFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Known entry, or a configurable fallback so every docs page has an API table
 * rather than an empty "正在补充" stub.
 */
export function getDocsApi(slug: string): DocsApiEntry {
  if (DOCS_API[slug]) return DOCS_API[slug];

  const isChart = slug.endsWith("-card") || slug.includes("chart");
  const isTemplate = ["admin-dashboard"].includes(slug);

  if (isChart) {
    return entry(captionFromSlug(slug), [
      {
        name: "data",
        description: "图表序列 / 矩阵数据，替换内置演示即可。",
        type: "SeriesPoint[] | Record<string, unknown>",
        options: "—",
        defaultValue: "内置演示",
      },
      {
        name: "className",
        description: "根节点类名。",
        type: "string",
        options: "—",
        defaultValue: "—",
      },
    ], {
      caption: "数据项（示例）",
      fields: [
        { name: "label", description: "类目或时间标签。", type: "string", required: true, example: '"Jan"' },
        { name: "value", description: "主指标。", type: "number", required: true, example: "1200" },
        { name: "secondary", description: "对比序列（可选）。", type: "number", required: false, example: "980" },
      ],
    });
  }

  if (isTemplate) {
    return entry(captionFromSlug(slug), [
      {
        name: "children / slots",
        description: "模板由多个应用块组成；替换文案、路由与数据源。",
        type: "ReactNode",
        options: "—",
        defaultValue: "—",
      },
    ]);
  }

  return entry(captionFromSlug(slug), [
    {
      name: "…props",
      description: "请以组件源码导出的 Props 类型为准；常用 className、受控 value、children 均可配置。",
      type: "见源码",
      options: "—",
      defaultValue: "—",
    },
  ]);
}
