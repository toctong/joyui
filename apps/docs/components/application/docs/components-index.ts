import { RiFontSize, RiPaletteLine } from "@remixicon/react";

/**
 * Catalogue of every component, block, chart and template with its docs page.
 * Plain data, so the starter can show the same list without carrying source.
 */
export type Entry = {
  name: string;
  href: string;
  description: string;
  tier: "free" | "pro";
  status: "shipped" | "planned";
  isNew?: boolean;
  /** Optional leading icon - used by the Foundations entries. */
  icon?: typeof RiPaletteLine;
};

const foundations: Entry[] = [
  {
    name: "Color",
    href: "/docs/color",
    description: "The full palette and semantic tokens.",
    tier: "free",
    status: "shipped",
    icon: RiPaletteLine,
  },
  {
    name: "Typography",
    href: "/docs/typography",
    description: "Type scale, weights, and text styles.",
    tier: "free",
    status: "shipped",
    icon: RiFontSize,
  },
];

const components: Entry[] = [
  { name: "Accordion", href: "/docs/accordion", description: "FAQs and settings that open in place.", tier: "free", status: "shipped", isNew: true },
  { name: "Announcement", href: "/docs/announcement", description: "Dismissible banner for product news.", tier: "free", status: "shipped" },
  { name: "Avatar", href: "/docs/avatar", description: "Single avatar and stacked AvatarGroup.", tier: "free", status: "shipped" },
  { name: "Breadcrumb", href: "/docs/breadcrumb", description: "Path trail with collapsing levels.", tier: "free", status: "shipped" },
  { name: "Button", href: "/docs/button", description: "Button family: variants, icon/close/link, groups, social.", tier: "free", status: "shipped" },
  { name: "Carousel", href: "/docs/carousel", description: "Gallery, coverflow, fade, thumbs, and stacked variants.", tier: "free", status: "shipped", isNew: true },
  { name: "Checkbox", href: "/docs/checkbox", description: "Animated tick, card variant, two sizes.", tier: "free", status: "shipped" },
  { name: "Chip", href: "/docs/chip", description: "Compact removable filter tokens.", tier: "free", status: "shipped" },
  { name: "Command Palette", href: "/docs/command-palette", description: "Every page and action behind ⌘K.", tier: "free", status: "shipped", isNew: true },
  { name: "Context Menu", href: "/docs/context-menu", description: "Right-click actions, with submenus.", tier: "free", status: "shipped", isNew: true },
  { name: "Color Picker", href: "/docs/color-picker", description: "Pick by eye, by hex, or from presets.", tier: "free", status: "shipped", isNew: true },
  { name: "Combobox", href: "/docs/combobox", description: "Type to filter a list, then pick.", tier: "free", status: "shipped", isNew: true },
  { name: "Date Calendar", href: "/docs/date-calendar", description: "A month on the page for dates and ranges.", tier: "free", status: "shipped", isNew: true },
  { name: "Date Picker", href: "/docs/date-picker", description: "Popover calendar for single dates.", tier: "free", status: "shipped" },
  { name: "Divider", href: "/docs/divider", description: "Single, double, and filled content separators.", tier: "free", status: "shipped", isNew: true },
  { name: "Drawer", href: "/docs/drawer", description: "Side panels and bottom sheets from any edge.", tier: "free", status: "shipped", isNew: true },
  { name: "Dropdown", href: "/docs/dropdown", description: "Composable menus - teams, models, actions.", tier: "free", status: "shipped" },
  { name: "File Upload", href: "/docs/file-upload", description: "Drag, validate, and track upload progress.", tier: "free", status: "shipped" },
  { name: "Input", href: "/docs/input", description: "Text field with addons and validation.", tier: "free", status: "shipped" },
  { name: "Input OTP", href: "/docs/input-otp", description: "One-time-code boxes with paste and autofill.", tier: "free", status: "shipped" },
  { name: "Meter", href: "/docs/meter", description: "Usage against a limit, toned as it fills.", tier: "free", status: "shipped", isNew: true },
  { name: "Modal", href: "/docs/modal", description: "Dialogs and alert dialogs over a dimmed page.", tier: "free", status: "shipped", isNew: true },
  { name: "Notification", href: "/docs/notification", description: "Notification card and grouped notification center.", tier: "free", status: "shipped" },
  { name: "Number Field", href: "/docs/number-field", description: "Numbers with steppers, units, and limits.", tier: "free", status: "shipped", isNew: true },
  { name: "Pagination", href: "/docs/pagination", description: "Page numbers with truncation.", tier: "free", status: "shipped" },
  { name: "Popover", href: "/docs/popover", description: "Rich content anchored to a trigger, arrow optional.", tier: "free", status: "shipped", isNew: true },
  { name: "Progress", href: "/docs/progress", description: "Bars and rings, determinate or sweeping.", tier: "free", status: "shipped", isNew: true },
  { name: "Radio", href: "/docs/radio", description: "Gradient dot, card variant, two sizes.", tier: "free", status: "shipped" },
  { name: "Segmented Control", href: "/docs/segmented-control", description: "Sliding pill option switcher.", tier: "free", status: "shipped" },
  { name: "Search Field", href: "/docs/search-field", description: "Type to filter, Escape to clear.", tier: "free", status: "shipped", isNew: true },
  { name: "Select", href: "/docs/select", description: "Single-choice listbox with search.", tier: "free", status: "shipped" },
  { name: "Skeleton", href: "/docs/skeleton", description: "Placeholders that blur into real content.", tier: "free", status: "shipped", isNew: true },
  { name: "Slider", href: "/docs/slider", description: "Single-value and min/max range selection.", tier: "free", status: "shipped", isNew: true },
  { name: "Spinner", href: "/docs/spinner", description: "Layered orbiting light for work in progress.", tier: "free", status: "shipped", isNew: true },
  { name: "Switch", href: "/docs/switch", description: "On/off toggle with spring motion.", tier: "free", status: "shipped" },
  { name: "Table", href: "/docs/table", description: "Sortable columns, sticky header.", tier: "free", status: "shipped" },
  { name: "Tabs", href: "/docs/tabs", description: "Underline and pill tab lists.", tier: "free", status: "shipped" },
  { name: "Tag", href: "/docs/tag-group", description: "TagGroup and TagInput for filters and entry.", tier: "free", status: "shipped", isNew: true },
  { name: "Textarea", href: "/docs/textarea", description: "Multiline field with auto-grow and character count.", tier: "free", status: "shipped", isNew: true },
  { name: "Time Field", href: "/docs/time-field", description: "Times typed segment by segment.", tier: "free", status: "shipped", isNew: true },
  { name: "Toast", href: "/docs/toast", description: "toast() from anywhere, stacked and timed.", tier: "free", status: "shipped", isNew: true },
  { name: "Tree View", href: "/docs/tree-view", description: "Nested folders with selection and keyboard navigation.", tier: "free", status: "shipped", isNew: true },
  { name: "Tooltip", href: "/docs/tooltip", description: "Positioned hints on hover and focus.", tier: "free", status: "shipped" },
];

const ai: Entry[] = [
  { name: "AI Chat", href: "/docs/ai-chat", description: "Built-in useChat shell: transcript + composer.", tier: "free", status: "shipped", isNew: true },
  { name: "Composer", href: "/docs/composer", description: "AI input: capsule, attachments, loader, and panel.", tier: "free", status: "shipped", isNew: true },
  { name: "Chat Message", href: "/docs/chat-message", description: "User bubble and assistant transcript turn.", tier: "free", status: "shipped", isNew: true },
  { name: "Message Actions", href: "/docs/message-actions", description: "Copy / regenerate row under a reply.", tier: "free", status: "shipped", isNew: true },
  { name: "Reasoning Block", href: "/docs/reasoning-block", description: "Collapsible chain-of-thought in a turn.", tier: "free", status: "shipped", isNew: true },
  { name: "Tool Call", href: "/docs/tool-call", description: "Expandable tool / MCP call card.", tier: "free", status: "shipped", isNew: true },
  { name: "Agent Thinking", href: "/docs/agent-thinking", description: "Thinking indicator above the composer.", tier: "free", status: "shipped", isNew: true },
  { name: "Agent Log", href: "/docs/agent-log", description: "Streaming transcript primitives for agent rows.", tier: "free", status: "shipped", isNew: true },
  { name: "Thinking Orbs", href: "/docs/thinking-orbs", description: "Brand orbs while the model thinks.", tier: "free", status: "shipped", isNew: true },
  { name: "Web Search", href: "/docs/web-search", description: "Research trail with the sources an agent opened.", tier: "free", status: "shipped", isNew: true },
  { name: "Task List", href: "/docs/task-list", description: "Streaming agent log demo; build on agent-log.", tier: "pro", status: "shipped", isNew: true },
  { name: "Prompt Suggestions", href: "/docs/prompt-suggestions", description: "Suggested prompts under an empty composer.", tier: "free", status: "shipped" },
  { name: "Citation", href: "/docs/citation", description: "Inline source chips for grounded answers.", tier: "free", status: "shipped" },
  { name: "Context Meter", href: "/docs/context-meter", description: "Segmented context-window usage bar.", tier: "free", status: "shipped", isNew: true },
  { name: "Model Select", href: "/docs/model-select", description: "Pick a chat model from a compact menu.", tier: "free", status: "shipped" },
  { name: "Voice Ring", href: "/docs/voice-ring", description: "Listening / speaking ring for voice mode.", tier: "free", status: "shipped" },
  { name: "Typing Text", href: "/docs/typing-text", description: "Typewriter effect for streaming copy.", tier: "free", status: "shipped" },
  { name: "Text Shimmer", href: "/docs/text-shimmer", description: "Sweeping highlight for loading labels.", tier: "free", status: "shipped" },
  { name: "Questionnaire", href: "/docs/questionnaire", description: "Plan-mode questions, one step at a time.", tier: "pro", status: "shipped", isNew: true },
];

const blocks: Entry[] = [
  { name: "Auth Card", href: "/docs/auth-card", description: "Sign-in and sign-up blocks with social login.", tier: "free", status: "shipped", isNew: true },
  { name: "Calendar", href: "/docs/calendar", description: "Full month view with event pills.", tier: "pro", status: "shipped" },
  { name: "Data Grid", href: "/docs/data-grid", description: "Editable spreadsheet with selection, filters, and live summaries.", tier: "free", status: "shipped", isNew: true },
  { name: "Data Table", href: "/docs/data-table", description: "Filters, selection, and pagination wired up.", tier: "free", status: "shipped" },
  { name: "Profile cards", href: "/docs/profile-cards", description: "Reusable profile, alert feed, and week-range cards.", tier: "free", status: "shipped", isNew: true },
  { name: "Notification Bell", href: "/docs/notification-bell", description: "Header bell with unread badge and center popover.", tier: "free", status: "shipped", isNew: true },
  { name: "Settings Modal", href: "/docs/settings-modal", description: "Multi-page settings in a controlled dialog.", tier: "free", status: "shipped" },
  { name: "Sidebar", href: "/docs/sidebar", description: "Floating app navigation with teams menu.", tier: "free", status: "shipped" },
  { name: "Stat Cards", href: "/docs/stat-cards", description: "KPI cards with delta chips or a footer band.", tier: "free", status: "shipped", isNew: true },
  { name: "Theme", href: "/docs/theme-toggle", description: "Light / system / dark plus accent skins.", tier: "free", status: "shipped" },
];

const charts: Entry[] = [
  { name: "Revenue Chart", href: "/docs/revenue-chart-card", description: "This year against last, area over a dashed line.", tier: "free", status: "shipped", isNew: true },
  { name: "Activity Rings", href: "/docs/activity-rings-card", description: "Concentric progress rings, Apple style.", tier: "pro", status: "shipped" },
  { name: "Area Chart", href: "/docs/area-chart-card", description: "Stacked, overlapping or 100% area series.", tier: "pro", status: "shipped", isNew: true },
  { name: "Bar List", href: "/docs/bar-list-card", description: "Ranked breakdown rows with share bars and tabs.", tier: "pro", status: "shipped", isNew: true },
  { name: "Combo Chart", href: "/docs/combo-chart-card", description: "Bars and a line on independent axes.", tier: "pro", status: "shipped", isNew: true },
  { name: "Contributions", href: "/docs/contributions-card", description: "GitHub-style activity heatmap.", tier: "pro", status: "shipped" },
  { name: "Earnings Chart", href: "/docs/earnings-chart-card", description: "Bar chart with period comparison.", tier: "pro", status: "shipped" },
  { name: "Funnel Chart", href: "/docs/funnel-chart-card", description: "Flow funnel with tapered stages and conversion pills.", tier: "pro", status: "shipped", isNew: true },
  { name: "Heatmap Chart", href: "/docs/heatmap-chart-card", description: "Matrix heatmap with a theme-following ramp.", tier: "pro", status: "shipped", isNew: true },
  { name: "Most Active Days", href: "/docs/most-active-days-card", description: "Weekday bars linked to the rings.", tier: "pro", status: "shipped" },
  { name: "Radar Chart", href: "/docs/radar-chart-card", description: "Filled, dotted, lines, and score radars.", tier: "pro", status: "shipped", isNew: true },
  { name: "Radial Chart", href: "/docs/radial-chart-card", description: "Rings, gauges, and a stacked half gauge.", tier: "pro", status: "shipped", isNew: true },
  { name: "Line Chart", href: "/docs/line-chart-card", description: "Curved or sharp line over a soft area.", tier: "pro", status: "shipped" },
  { name: "Sankey Chart", href: "/docs/sankey-chart-card", description: "Flow diagram with tinted links and shares.", tier: "pro", status: "shipped", isNew: true },
  { name: "Scatter Chart", href: "/docs/scatter-chart-card", description: "Correlation dots, bubbles when sized.", tier: "pro", status: "shipped", isNew: true },
  { name: "Sleep Score", href: "/docs/sleep-score-card", description: "Radial gauge with score breakdown.", tier: "pro", status: "shipped" },
  { name: "Stage Bars", href: "/docs/stage-bars-card", description: "Funnel stages as rounded horizontal pills.", tier: "pro", status: "shipped", isNew: true },
  { name: "Steps Chart", href: "/docs/steps-card", description: "Daily steps with goal marker.", tier: "pro", status: "shipped" },
];

const templates: Entry[] = [
  {
    name: "后台管理",
    href: "/docs/admin-dashboard",
    description: "侧栏、KPI、收入/订单图表与数据表组装的后台控制台。",
    tier: "free",
    status: "shipped",
    isNew: true,
  },
  {
    name: "AI 对话",
    href: "/docs/ai-chat-template",
    description: "全页 AiChat：标题栏 + transcript + composer。",
    tier: "free",
    status: "shipped",
    isNew: true,
  },
  {
    name: "登录页",
    href: "/docs/auth-template",
    description: "全屏 AuthCard，默认媒体分栏。",
    tier: "free",
    status: "shipped",
    isNew: true,
  },
  {
    name: "工作台",
    href: "/docs/workspace-template",
    description: "侧栏 + KPI + 档案卡 + 动态流。",
    tier: "free",
    status: "shipped",
    isNew: true,
  },
];

/**
 * `wide` halves the column count: a template card shows a whole app screen,
 * which is unreadable at a third of the width.
 */
export const COMPONENT_SECTIONS: { title: string; blurb: string; entries: Entry[]; wide?: boolean }[] = [
  { title: "Foundations", blurb: "The tokens everything else is built on.", entries: foundations },
  { title: "Base", blurb: "The everyday building blocks.", entries: components },
  { title: "AI", blurb: "Composer, thinking states, and agent trails.", entries: ai },
  { title: "Blocks", blurb: "Larger assemblies, ready to drop in.", entries: blocks },
  { title: "Charts", blurb: "Data cards for dashboards.", entries: charts },
  { title: "Templates", blurb: "Complete screens, wired together.", entries: templates, wide: true },
];
