/**
 * Single source for docs DemoFrame preview +「代码」tab.
 * Writes:
 *   - components/demos/component-doc-codes.ts
 *   - components/demos/component-doc-previews.generated.tsx
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");

function pascal(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function wrap(importLine, body) {
  return `${importLine}\n\n${body}`;
}

/** Resolve `@/…` imports under apps/docs; return null if the file is missing. */
function resolveAliasImport(from) {
  if (!from.startsWith("@/")) return true; // package imports — assume ok
  const rel = from.slice(2);
  const base = path.resolve(docsRoot, rel);
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

function snippetImportsExist(source) {
  const froms = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  return froms.every(resolveAliasImport);
}

/** Slugs whose code is documentation-only (not a runnable in-docs preview). */
const SKIP_PREVIEW = new Set([
  // Not vendored as runnable docs previews — JoyProPreview (+ mocks) instead.
  "calendar",
  "questionnaire",
  "task-list",
]);

const codes = {
  accordion: wrap(
    'import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";',
    `<Accordion variant="contained" defaultExpandedKeys={["billing"]} className="w-full max-w-xl">
  <AccordionItem id="billing" title="如何计费？">
    <p>按月为每个活跃席位计费。</p>
  </AccordionItem>
  <AccordionItem id="plans" title="之后可以更换方案吗？">
    <p>随时升级，立即生效。</p>
  </AccordionItem>
</Accordion>`,
  ),
  announcement: wrap(
    'import { Announcement } from "@/components/base/announcement/announcement";',
    `<Announcement title="新功能" description="智能体技能已上线。" />`,
  ),
  alert: wrap(
    'import { Alert } from "@/components/base/alert/alert";',
    `<div className="flex w-full max-w-lg flex-col gap-3">
  <Alert tone="info" title="提示">可在设置中配置 Quark Cookie。</Alert>
  <Alert tone="error" title="登录失败">用户名或密码不正确。</Alert>
</div>`,
  ),
  avatar: wrap(
    'import { Avatar } from "@/components/base/avatar/avatar";',
    `<div className="flex items-center gap-4">
  <Avatar size="lg" color="blue" initials="B" />
  <Avatar size="lg" color="neutral" initials="M" />
  <Avatar size="md" initials="JP" />
</div>`,
  ),
  card: wrap(
    'import { Card } from "@/components/base/card/card";',
    `<Card className="w-full max-w-md" variant="soft">
  <p className="text-body-medium text-text-primary">Settings block</p>
  <p className="mt-1 text-body-regular text-text-secondary">Tokenized surface for grouped content.</p>
</Card>`,
  ),
  "empty-state": wrap(
    'import { Button } from "@/components/base/buttons/button";\nimport { EmptyState } from "@/components/base/empty-state/empty-state";',
    `<EmptyState
  title="No transfers yet"
  description="Add a Quark cookie in Settings, then run a task."
  action={<Button size="small">Open settings</Button>}
/>`,
  ),
  "page-header": wrap(
    'import { Button } from "@/components/base/buttons/button";\nimport { PageHeader } from "@/components/base/page-header/page-header";',
    `<PageHeader
  className="w-full"
  title="Transfer records"
  description="History used for dedupe"
  actions={<Button variant="secondary" size="small">Refresh</Button>}
/>`,
  ),
  badge: wrap(
    'import { Badge } from "@/components/base/badges/badge";',
    `<div className="flex items-center gap-4">
  <Badge>91</Badge>
  <Badge>152</Badge>
  <Badge>99+</Badge>
</div>`,
  ),
  breadcrumb: wrap(
    'import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";',
    `<Breadcrumb>
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbItem href="/docs">文档</BreadcrumbItem>
  <BreadcrumbItem>按钮</BreadcrumbItem>
</Breadcrumb>`,
  ),
  button: wrap(
    'import { Button } from "@/components/base/buttons/button";',
    `<div className="flex items-center gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
</div>`,
  ),
  "button-group": wrap(
    'import { ButtonGroup, ButtonGroupItem } from "@/components/base/buttons/button-group";',
    `<ButtonGroup aria-label="对齐">
  <ButtonGroupItem id="left">左</ButtonGroupItem>
  <ButtonGroupItem id="center" selected>
    中
  </ButtonGroupItem>
  <ButtonGroupItem id="right">右</ButtonGroupItem>
</ButtonGroup>`,
  ),
  carousel: wrap(
    'import { Carousel, CarouselItem } from "@/components/base/carousel/carousel";',
    `<Carousel aria-label="图库">
  <CarouselItem>一</CarouselItem>
  <CarouselItem>二</CarouselItem>
  <CarouselItem>三</CarouselItem>
</Carousel>`,
  ),
  checkbox: wrap(
    'import { Checkbox } from "@/components/base/checkbox/checkbox";',
    `<Checkbox defaultSelected>通知我智能体运行结果</Checkbox>`,
  ),
  chip: wrap(
    'import { Chip } from "@/components/base/badges/chip";',
    `<div className="flex gap-2">
  <Chip>默认</Chip>
  <Chip color="lime">成功</Chip>
</div>`,
  ),
  "close-button": wrap(
    'import { CloseButton } from "@/components/base/buttons/close-button";',
    `<div className="flex items-center gap-6">
  <CloseButton size="2xs" aria-label="Close" />
  <CloseButton size="xs" aria-label="Close" />
  <CloseButton size="sm" aria-label="Close" />
  <CloseButton size="md" aria-label="Close" />
</div>`,
  ),
  "color-picker": `import { useState } from "react";
import { parseColor } from "react-aria-components";
import { ColorPicker } from "@/components/base/color-picker/color-picker";

export function Example() {
  const [color, setColor] = useState(parseColor("#6366f1"));
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#d946ef"]}
    />
  );
}`,
  combobox: wrap(
    'import { ComboBox, ComboBoxItem } from "@/components/base/combobox/combobox";',
    `<ComboBox label="负责人" placeholder="搜索成员" defaultSelectedKey="maya">
  <ComboBoxItem id="maya">Maya Chen</ComboBoxItem>
  <ComboBoxItem id="leo">Leo Park</ComboBoxItem>
</ComboBox>`,
  ),
  "command-palette": wrap(
    'import { CommandPalette, CommandPaletteItem, CommandPaletteSection } from "@/components/base/command-palette/command-palette";',
    `<CommandPalette aria-label="命令">
  <CommandPaletteSection title="导航">
    <CommandPaletteItem id="home">首页</CommandPaletteItem>
    <CommandPaletteItem id="settings">设置</CommandPaletteItem>
  </CommandPaletteSection>
</CommandPalette>`,
  ),
  "context-menu": wrap(
    'import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from "@/components/base/context-menu/context-menu";',
    `<ContextMenuTrigger>
  <div className="rounded-xl border border-separator-border p-6">右键打开菜单</div>
  <ContextMenu aria-label="文件">
    <ContextMenuItem id="rename">重命名</ContextMenuItem>
    <ContextMenuItem id="delete">删除</ContextMenuItem>
  </ContextMenu>
</ContextMenuTrigger>`,
  ),
  "date-calendar": wrap(
    'import { DateCalendar } from "@/components/base/date-picker/date-calendar";',
    `<DateCalendar aria-label="选择日期" />`,
  ),
  "date-picker": wrap(
    'import { DatePicker } from "@/components/base/date-picker/date-picker";',
    `<DatePicker aria-label="开始日期" />`,
  ),
  divider: wrap(
    'import { Divider } from "@/components/base/divider/divider";',
    `<Divider />`,
  ),
  drawer: `import { Button } from "@/components/base/buttons/button";
import { Drawer, DrawerBody, DrawerHeader, DrawerTrigger } from "@/components/base/drawer/drawer";

<DrawerTrigger>
  <Button>打开抽屉</Button>
  <Drawer>
    <DrawerHeader title="筛选" />
    <DrawerBody>内容</DrawerBody>
  </Drawer>
</DrawerTrigger>`,
  dropdown: wrap(
    'import { Dropdown, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";',
    `<Dropdown>
  <DropdownTrigger>菜单</DropdownTrigger>
  <DropdownPopover aria-label="菜单选项">
    <DropdownItem>选项 A</DropdownItem>
    <DropdownItem>选项 B</DropdownItem>
  </DropdownPopover>
</Dropdown>`,
  ),
  "file-upload": wrap(
    'import { FileUpload } from "@/components/base/file-upload/file-upload";',
    `<FileUpload onUploadComplete={(file) => console.log(file.name)} />`,
  ),
  "icon-button": `import { RiAddLine } from "@remixicon/react";
import { IconButton } from "@/components/base/buttons/icon-button";

<IconButton icon={RiAddLine} aria-label="添加" />`,
  input: `import { RiMailLine } from "@remixicon/react";
import { Input } from "@/components/base/input/input";

<Input
  label="邮箱"
  type="email"
  placeholder="you@company.com"
  leadingIcon={RiMailLine}
  isRequired
/>`,
  "input-otp": wrap(
    'import { InputOtp } from "@/components/base/input-otp/input-otp";',
    `<InputOtp aria-label="验证码" length={6} />`,
  ),
  kbd: wrap(
    'import { Kbd } from "@/components/base/kbd/kbd";',
    `<div className="flex gap-2">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</div>`,
  ),
  "link-button": wrap(
    'import { LinkButton } from "@/components/base/buttons/link-button";',
    `<LinkButton href="/docs">查看文档</LinkButton>`,
  ),
  list: wrap(
    'import { Chip } from "@/components/base/badges/chip";\nimport { List, ListItem } from "@/components/base/list/list";',
    `<List className="w-full max-w-md">
  <ListItem
    title="admin@marhub.local"
    description="primary (transfer)"
    trailing={<Chip color="lime" variant="subtle">ok</Chip>}
  />
  <ListItem
    title="CloudSaver"
    description="Plugin endpoint"
    interactive
    trailing={<Chip color="neutral" variant="subtle">off</Chip>}
  />
</List>`,
  ),
  "media-card": wrap(
    'import { Button } from "@/components/base/buttons/button";\nimport { MediaCard } from "@/components/base/media-card/media-card";',
    `<div className="grid w-full max-w-sm grid-cols-2 gap-4">
  <MediaCard
    title="Severance"
    subtitle="2022 · TV"
    src="https://image.tmdb.org/t/p/w342/pPHpeI2X1qXQQb1vtlnDJLvxYBi.jpg"
    action={<Button size="small" variant="secondary">Add task</Button>}
  />
  <MediaCard title="Untitled" subtitle="No artwork" />
</div>`,
  ),
  steps: wrap(
    'import { Steps } from "@/components/base/steps/steps";',
    `<Steps
  current={1}
  className="w-full max-w-xl"
  steps={[
    { title: "账号", description: "Cookie" },
    { title: "片源", description: "TMDB" },
    { title: "完成" },
  ]}
/>`,
  ),
  timeline: wrap(
    'import { Timeline, TimelineItem } from "@/components/base/timeline/timeline";',
    `<Timeline className="w-full max-w-md">
  <TimelineItem title="任务已创建" description="Severance S01" time="刚刚" tone="info" />
  <TimelineItem title="转存完成" description="E01.mkv" time="2 分钟前" tone="success" />
  <TimelineItem title="Cookie 失效" description="请重新登录" time="1 小时前" tone="error" />
</Timeline>`,
  ),
  "description-list": wrap(
    'import { Card } from "@/components/base/card/card";\nimport { DescriptionItem, DescriptionList } from "@/components/base/description-list/description-list";',
    `<Card className="w-full max-w-md" padding="md">
  <DescriptionList columns={2}>
    <DescriptionItem term="账号">primary</DescriptionItem>
    <DescriptionItem term="状态">ok</DescriptionItem>
    <DescriptionItem term="保存路径">/Media</DescriptionItem>
    <DescriptionItem term="模式">auto</DescriptionItem>
  </DescriptionList>
</Card>`,
  ),
  "copy-button": wrap(
    'import { CopyButton } from "@/components/base/copy-button/copy-button";\nimport { Input } from "@/components/base/input/input";',
    `<div className="flex w-full max-w-md items-end gap-2">
  <Input label="分享链接" value="https://pan.quark.cn/s/demo" isReadOnly />
  <CopyButton value="https://pan.quark.cn/s/demo" size="medium" />
</div>`,
  ),
  "section-header": wrap(
    'import { Button } from "@/components/base/buttons/button";\nimport { SectionHeader } from "@/components/base/section-header/section-header";',
    `<SectionHeader
  title="运行中"
  description="当前调度中的任务"
  actions={<Button size="small" variant="secondary">全部查看</Button>}
  className="w-full max-w-xl"
/>`,
  ),
  "text-link": wrap(
    'import { TextLink } from "@/components/base/text-link/text-link";',
    `<p className="text-body-regular text-text-secondary">
  打开 <TextLink href="https://www.joyui.top/docs">文档</TextLink> 或
  <TextLink href="#" muted> 次级链接</TextLink>。
</p>`,
  ),
  rating: wrap(
    'import { Rating } from "@/components/base/rating/rating";',
    `<div className="flex flex-col gap-3">
  <Rating value={4} aria-label="只读评分" />
  <Rating value={3} interactive aria-label="可点选评分" />
</div>`,
  ),
  collapsible: wrap(
    'import { Collapsible } from "@/components/base/collapsible/collapsible";',
    `<Collapsible title="高级筛选" className="w-full max-w-md" defaultExpanded>
  过滤预告片、花絮，以及自定义规则。
</Collapsible>`,
  ),
  meter: wrap(
    'import { Meter } from "@/components/base/meter/meter";',
    `<Meter label="席位" value={19} maxValue={20} />`,
  ),
  modal: `import { Button } from "@/components/base/buttons/button";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTrigger } from "@/components/base/modal/modal";

<ModalTrigger>
  <Button>邀请队友</Button>
  <Modal>
    {({ close }) => (
      <>
        <ModalHeader title="邀请队友" description="他们会收到加入链接。" />
        <ModalBody>表单内容</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>取消</Button>
          <Button onClick={close}>发送</Button>
        </ModalFooter>
      </>
    )}
  </Modal>
</ModalTrigger>`,
  notification: wrap(
    'import { Notification } from "@/components/base/notification/notification";',
    `<Notification status="success" title="已保存更改" />`,
  ),
  "number-field": wrap(
    'import { NumberField } from "@/components/base/number-field/number-field";',
    `<NumberField label="数量" defaultValue={3} minValue={0} />`,
  ),
  pagination: `import { useState } from "react";
import { Pagination } from "@/components/base/pagination/pagination";

export function Example() {
  const [page, setPage] = useState(2);
  return (
    <Pagination page={page} totalPages={12} onChange={setPage} />
  );
}`,
  popover: `import { Button } from "@/components/base/buttons/button";
import { Popover, PopoverTrigger } from "@/components/base/popover/popover";

<PopoverTrigger>
  <Button>打开</Button>
  <Popover>弹出内容</Popover>
</PopoverTrigger>`,
  progress: wrap(
    'import { ProgressBar } from "@/components/base/progress/progress";',
    `<ProgressBar label="上传中" value={64} />`,
  ),
  "qr-code": wrap(
    'import { QrCode } from "@/components/base/qr-code/qr-code";',
    `<div className="flex flex-wrap items-end gap-4">
  <QrCode value="https://www.joyui.top" size={160} />
  <QrCode value="https://www.joyui.top/docs" size={120} level="H" />
</div>`,
  ),
  barcode: wrap(
    'import { Barcode } from "@/components/base/barcode/barcode";',
    `<div className="flex w-full max-w-lg flex-col gap-4">
  <Barcode value="MH-2026-0312" format="CODE128" />
  <Barcode value="5901234123457" format="EAN13" height={48} />
</div>`,
  ),
  "border-beam": wrap(
    'import { BorderBeam } from "@/components/base/border-beam/border-beam";\nimport { Card } from "@/components/base/card/card";',
    `<BorderBeam className="w-full max-w-md rounded-2xl">
  <Card className="relative z-10 w-full" variant="soft">
    <p className="text-body-medium text-text-primary">Showcase tile</p>
    <p className="mt-1 text-body-regular text-text-secondary">Border light for landing / AI cards.</p>
  </Card>
</BorderBeam>`,
  ),
  marquee: wrap(
    'import { Chip } from "@/components/base/badges/chip";\nimport { Marquee } from "@/components/base/marquee/marquee";',
    `<Marquee className="w-full max-w-xl py-2" duration={18}>
  <Chip color="soft">React</Chip>
  <Chip color="soft">Tailwind</Chip>
  <Chip color="soft">React Aria</Chip>
  <Chip color="soft">JoyUI</Chip>
  <Chip color="soft">MCP</Chip>
  <Chip color="soft">Charts</Chip>
</Marquee>`,
  ),
  "number-ticker": wrap(
    'import { NumberTicker } from "@/components/base/number-ticker/number-ticker";',
    `<div className="flex w-full max-w-md items-end gap-8">
  <div>
    <p className="text-caption-1-medium text-text-secondary">Transfers</p>
    <NumberTicker value={1280} suffix="+" className="text-title-1-semibold" startOnView={false} />
  </div>
  <div>
    <p className="text-caption-1-medium text-text-secondary">Uptime</p>
    <NumberTicker value={99.9} precision={1} suffix="%" className="text-title-1-semibold" startOnView={false} />
  </div>
</div>`,
  ),
  radio: wrap(
    'import { Radio, RadioGroup } from "@/components/base/radio/radio";',
    `<RadioGroup aria-label="计划" defaultValue="pro">
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
</RadioGroup>`,
  ),
  "search-field": wrap(
    'import { SearchField } from "@/components/base/search-field/search-field";',
    `<SearchField aria-label="搜索" placeholder="搜索组件…" />`,
  ),
  "segmented-control": wrap(
    'import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";',
    `<SegmentedControl defaultSelectedKeys={["month"]} aria-label="周期">
  <SegmentedControlItem id="week">周</SegmentedControlItem>
  <SegmentedControlItem id="month">月</SegmentedControlItem>
  <SegmentedControlItem id="year">年</SegmentedControlItem>
</SegmentedControl>`,
  ),
  select: wrap(
    'import { Select, SelectItem } from "@/components/base/select/select";',
    `<Select label="地区" placeholder="选择地区" defaultSelectedKey="eu">
  <SelectItem id="na">North America</SelectItem>
  <SelectItem id="eu">Europe</SelectItem>
</Select>`,
  ),
  skeleton: wrap(
    'import { Skeleton } from "@/components/base/skeleton/skeleton";',
    `<Skeleton className="h-10 w-48 rounded-xl" />`,
  ),
  slider: wrap(
    'import { Slider } from "@/components/base/slider/slider";',
    `<Slider aria-label="音量" defaultValue={40} />`,
  ),
  "social-button": wrap(
    'import { SocialButton } from "@/components/base/social-button/social-button";',
    `<div className="flex w-full max-w-xs flex-col gap-2">
  <SocialButton brand="google" appearance="white" fullWidth>
    使用 Google 继续
  </SocialButton>
  <SocialButton brand="github" appearance="white" fullWidth>
    使用 GitHub 继续
  </SocialButton>
</div>`,
  ),
  spinner: wrap(
    'import { Spinner } from "@/components/base/spinner/spinner";',
    `<Spinner aria-label="加载中" />`,
  ),
  switch: wrap(
    'import { Switch } from "@/components/base/switch/switch";',
    `<Switch defaultSelected aria-label="安静模式" />`,
  ),
  table: wrap(
    'import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/base/table/table";',
    `<Table aria-label="客户">
  <TableHeader>
    <TableColumn isRowHeader>名称</TableColumn>
    <TableColumn>状态</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Acme</TableCell>
      <TableCell>活跃</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  ),
  tabs: wrap(
    'import { Tab, TabList, Tabs } from "@/components/base/tabs/tabs";',
    `<Tabs>
  <TabList aria-label="分区">
    <Tab id="general">通用</Tab>
    <Tab id="billing">账单</Tab>
  </TabList>
</Tabs>`,
  ),
  "tag-group": wrap(
    'import { Tag, TagGroup } from "@/components/base/tag-group/tag-group";',
    `<TagGroup aria-label="标签" selectionMode="multiple">
  <Tag id="design">设计</Tag>
  <Tag id="eng">工程</Tag>
</TagGroup>`,
  ),
  textarea: wrap(
    'import { Textarea } from "@/components/base/textarea/textarea";',
    `<Textarea label="备注" placeholder="补充说明…" rows={4} />`,
  ),
  "time-field": wrap(
    'import { TimeField } from "@/components/base/time-field/time-field";',
    `<TimeField label="开始时间" />`,
  ),
  toast: `import { Button } from "@/components/base/buttons/button";
import { toast, Toaster } from "@/components/base/toast/toast";

<>
  <Toaster />
  <Button onClick={() => toast.success("已保存更改")}>保存</Button>
</>`,
  tooltip: `import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

<TooltipTrigger>
  <Button>悬停我</Button>
  <Tooltip>提示文案</Tooltip>
</TooltipTrigger>`,
  "tree-view": wrap(
    'import { TreeView, TreeViewItem } from "@/components/base/tree-view/tree-view";',
    `<TreeView
  aria-label="项目文件"
  defaultExpandedKeys={["src", "components"]}
  defaultSelectedKeys={["components"]}
  className="max-w-sm"
>
  <TreeViewItem id="src" label="src">
    <TreeViewItem id="components" label="components">
      <TreeViewItem id="button" label="button.tsx" iconClassName="text-accent-700" />
      <TreeViewItem id="button-styles" label="button.module.css" iconClassName="text-chart-5-active" />
      <TreeViewItem id="input" label="input.tsx" iconClassName="text-accent-700" />
    </TreeViewItem>
    <TreeViewItem id="hooks" label="hooks">
      <TreeViewItem id="use-theme" label="use-theme.ts" iconClassName="text-accent-700" />
    </TreeViewItem>
    <TreeViewItem id="page" label="page.tsx" iconClassName="text-accent-700" />
  </TreeViewItem>
  <TreeViewItem id="readme" label="README.md" iconClassName="text-chart-1-active" />
</TreeView>`,
  ),
  "auth-card": wrap(
    'import { AuthCard } from "@/components/application/auth/auth-card";',
    `<AuthCard />`,
  ),
  "composer-loader": wrap(
    'import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";',
    `<ComposerLoader active>
  <div className="rounded-full border border-separator-border px-4 py-3">Ask anything…</div>
</ComposerLoader>`,
  ),
  composer: wrap(
    'import { Composer } from "@/components/application/composer/composer";',
    `<Composer />`,
  ),
  "composer-panel": wrap(
    'import { ComposerPanel } from "@/components/application/composer-panel/composer-panel";',
    `<ComposerPanel />`,
  ),
  "composer-attachments": wrap(
    'import { ComposerWithAttachments } from "@/components/application/composer-panel/composer-attachments";',
    `<ComposerWithAttachments
  attachments={[
    { id: "demo-png", name: "freepro-demo-resized.png", kind: "image", progress: 0 },
    { id: "payroll", name: "payroll.docx", kind: "document", progress: 0 },
    { id: "timetable", name: "timetable.xlsx", kind: "spreadsheet", progress: 0 },
  ]}
/>`,
  ),
  "data-grid": wrap(
    'import { DataGridExample } from "@/components/application/docs/examples/data-grid-example";',
    `<DataGridExample rowCount={24} showTitle height={520} />`,
  ),
  "data-table": `import { DataTable } from "@/components/application/data-table/data-table-view";

export function Example() {
  const rows = [
    { id: "1", taskId: 12, fileName: "episode.mkv", renamedName: "S01E01.mkv", transferredAt: "2026-11-13T08:00:00Z" },
    { id: "2", taskId: 12, fileName: "episode-2.mkv", renamedName: "", transferredAt: "2026-11-13T09:00:00Z" },
  ];
  return (
    <DataTable
      aria-label="Transfers"
      data={rows}
      getRowId={(row) => row.id}
      emptyState="No transfers yet."
      columns={[
        { id: "taskId", header: "Task", accessorKey: "taskId" },
        { id: "fileName", header: "Original", accessorKey: "fileName", meta: { isRowHeader: true } },
        { id: "renamedName", header: "Renamed", cell: (row) => row.renamedName || "-" },
        { id: "transferredAt", header: "Time", cell: (row) => new Date(row.transferredAt).toLocaleString() },
      ]}
    />
  );
}
`,

  "notification-center": wrap(
    'import { NotificationCenterDemo } from "@/components/application/notification-center/notification-center-demo";',
    `<NotificationCenterDemo />`,
  ),
  "settings-modal": `import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { SettingsModal } from "@/components/application/settings/settings-modal";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开设置</Button>
      <SettingsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        planArtSrc="/templates/settings-plan-art.png"
      />
    </>
  );
}`,
  sidebar: wrap(
    'import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";',
    `<div className="mx-auto w-full max-w-[280px]">
  <DashboardSidebar fluid showThemeToggle={false} className="h-auto" />
</div>`,
  ),
  "stat-cards": wrap(
    'import { StatCards } from "@/components/application/dashboard/stat-cards";',
    `<StatCards />`,
  ),
  "theme-toggle": wrap(
    'import { ThemeToggle } from "@/components/application/theme/theme-toggle";',
    `<ThemeToggle />`,
  ),
  "web-search": wrap(
    'import { WebSearch } from "@/components/application/web-search/web-search";',
    `<WebSearch />`,
  ),
  calendar: `import { Calendar } from "@joyui/react";

export function Example() {
  return <Calendar />;
}

// 安装: npx @joyui/cli add calendar --yes`,
  questionnaire: `import { Questionnaire } from "@joyui/react";

export function Example() {
  return <Questionnaire />;
}

// 安装: npx @joyui/cli add questionnaire --yes`,
  "task-list": `import { TaskList } from "@joyui/react";

export function Example() {
  return <TaskList />;
}

// 安装: npx @joyui/cli add task-list --yes`,
  "admin-dashboard": wrap(
    'import { AdminDashboard } from "@/components/application/admin/admin-dashboard";',
    `<div className="h-[720px] w-full overflow-hidden rounded-2xl border border-separator-border">
  <AdminDashboard />
</div>`,
  ),
};

const charts = [
  "activity-rings-card",
  "area-chart-card",
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
];
for (const slug of charts) {
  const name = pascal(slug);
  codes[slug] = wrap(
    `import { ${name} } from "@/components/application/dashboard/${slug}";`,
    `<${name} />`,
  );
}

codes["bar-list-card"] = wrap(
  'import { BarListCard } from "@/components/application/dashboard/bar-list-card";',
  `<BarListCard />`,
);


function splitSnippet(source) {
  const trimmed = source.trim();
  if (/export\s+(default\s+)?function\s+\w+/.test(trimmed)) {
    return { kind: "module", source: trimmed };
  }
  const imports = [];
  let rest = trimmed;
  while (true) {
    const match = rest.match(/^import\s+[\s\S]*?from\s+["'][^"']+["']\s*;?\s*/);
    if (!match) break;
    imports.push(`${match[0].trim().replace(/;?\s*$/, "")};`);
    rest = rest.slice(match[0].length).trimStart();
  }
  return { kind: "snippet", imports, body: rest.trim() };
}

function fnName(slug) {
  return `Preview_${slug.replace(/-/g, "_")}`;
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

function collectImportMap(importLines) {
  /** @type {Map<string, { defaultName: string | null, named: Set<string> }>} */
  const map = new Map();
  for (const line of importLines) {
    const m = line.match(
      /^import\s+(?:(\w+)\s*,\s*)?\{([^}]+)\}\s*from\s*["']([^"']+)["']\s*;?$/,
    );
    const defOnly = line.match(/^import\s+(\w+)\s+from\s*["']([^"']+)["']\s*;?$/);
    const namespace = line.match(
      /^import\s+\*\s+as\s+(\w+)\s+from\s*["']([^"']+)["']\s*;?$/,
    );
    if (m) {
      const [, defaultName, named, from] = m;
      const entry = map.get(from) ?? { defaultName: null, named: new Set() };
      if (defaultName) entry.defaultName = defaultName;
      for (const part of named.split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) entry.named.add(name);
      }
      map.set(from, entry);
      continue;
    }
    if (defOnly) {
      const [, defaultName, from] = defOnly;
      const entry = map.get(from) ?? { defaultName: null, named: new Set() };
      entry.defaultName = defaultName;
      map.set(from, entry);
      continue;
    }
    if (namespace) {
      // Keep as raw line — rare in our snippets
      map.set(`__raw__:${line}`, { defaultName: null, named: new Set() });
    }
  }
  return map;
}

function emitImportLines(map) {
  const lines = [];
  for (const [from, entry] of [...map.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    if (from.startsWith("__raw__:")) {
      lines.push(from.slice("__raw__:".length));
      continue;
    }
    const named = [...entry.named].sort();
    if (entry.defaultName && named.length) {
      lines.push(
        `import ${entry.defaultName}, { ${named.join(", ")} } from "${from}";`,
      );
    } else if (entry.defaultName) {
      lines.push(`import ${entry.defaultName} from "${from}";`);
    } else {
      lines.push(`import { ${named.join(", ")} } from "${from}";`);
    }
  }
  return lines;
}

// --- write codes.ts ---
const codeLines = [
  "/** AUTO-GENERATED by scripts/gen-doc-codes.mjs — do not edit by hand. */",
  "/** Default demo source shown in DemoFrame「代码」tab — real snippets, never placeholders. */",
  "",
  "export const COMPONENT_DOC_CODES: Record<string, string> = {",
];

for (const slug of Object.keys(codes).sort()) {
  codeLines.push(`  ${JSON.stringify(slug)}: ${JSON.stringify(codes[slug])},`);
}
codeLines.push("};", "");
codeLines.push(`export function getComponentDocCode(slug: string): string | undefined {
  return COMPONENT_DOC_CODES[slug];
}

/** Fallback when no hand-written snippet exists — still a real import + mount. */
export function getFallbackDocCode(slug: string, name?: string) {
  const exportName = slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return \`import { \${exportName} } from "@joyui/react";

export function Example() {
  return <\${exportName} />;
}

// 安装: npx @joyui/cli add \${slug} --yes\${name ? \`\\n// \${name}\` : ""}\`;
}
`);

const codesOut = path.resolve(
  __dirname,
  "../components/demos/component-doc-codes.ts",
);
fs.writeFileSync(codesOut, codeLines.join("\n"), "utf8");

// --- write previews.generated.tsx ---
const allImports = new Map();
const previewFns = [];
const registryEntries = [];

for (const slug of Object.keys(codes).sort()) {
  if (SKIP_PREVIEW.has(slug)) continue;
  const source = codes[slug];
  if (source.includes("@joyui/react")) continue;
  if (!snippetImportsExist(source)) {
    console.warn("skip preview (missing import):", slug);
    continue;
  }

  const parsed = splitSnippet(source);
  const name = fnName(slug);

  if (parsed.kind === "module") {
    // Pull import lines + rewrite export function Example → local fn
    const modImports = [];
    let rest = parsed.source;
    while (true) {
      const match = rest.match(/^import\s+[\s\S]*?from\s+["'][^"']+["']\s*;?\s*/);
      if (!match) break;
      modImports.push(`${match[0].trim().replace(/;?\s*$/, "")};`);
      rest = rest.slice(match[0].length).trimStart();
    }
    for (const [from, entry] of collectImportMap(modImports)) {
      const cur = allImports.get(from) ?? { defaultName: null, named: new Set() };
      if (entry.defaultName) cur.defaultName = entry.defaultName;
      for (const n of entry.named) cur.named.add(n);
      allImports.set(from, cur);
    }
    // Ensure useState import if present
    const body = rest
      .replace(/export\s+default\s+function\s+\w+/, `function ${name}`)
      .replace(/export\s+function\s+\w+/, `function ${name}`);
    previewFns.push(body);
    registryEntries.push(`  ${JSON.stringify(slug)}: ${name},`);
    continue;
  }

  for (const [from, entry] of collectImportMap(parsed.imports)) {
    const cur = allImports.get(from) ?? { defaultName: null, named: new Set() };
    if (entry.defaultName) cur.defaultName = entry.defaultName;
    for (const n of entry.named) cur.named.add(n);
    allImports.set(from, cur);
  }

  const jsx = parsed.body;
  previewFns.push(`function ${name}() {
  return (
${indent(jsx, 4)}
  );
}`);
  registryEntries.push(`  ${JSON.stringify(slug)}: ${name},`);
}

const previewLines = [
  "/** AUTO-GENERATED by scripts/gen-doc-codes.mjs — do not edit by hand. */",
  `"use client";`,
  "",
  ...emitImportLines(allImports),
  "",
  ...previewFns.flatMap((fn) => [fn, ""]),
  "export const GENERATED_DOC_PREVIEWS: Record<string, () => React.ReactElement> = {",
  ...registryEntries,
  "};",
  "",
];

// React namespace for React.ReactElement — add import if missing
if (![...allImports.keys()].some((k) => k === "react")) {
  previewLines.splice(3, 0, 'import type * as React from "react";');
} else {
  // ensure type import isn't needed if value import exists
  previewLines.splice(3, 0, 'import type { ReactElement } from "react";');
  // fix type in registry - use ReactElement instead
}

const previewsOut = path.resolve(
  __dirname,
  "../components/demos/component-doc-previews.generated.tsx",
);

// Prefer clean ReactElement typing
const previewSource = [
  "/** AUTO-GENERATED by scripts/gen-doc-codes.mjs — do not edit by hand. */",
  `"use client";`,
  "",
  'import type { ReactElement } from "react";',
  ...emitImportLines(allImports).filter((l) => !l.includes('from "react"') || l.includes("{")),
  // Re-add react value imports if needed (useState)
  ...(() => {
    const reactEntry = allImports.get("react");
    if (!reactEntry) return [];
    const named = [...reactEntry.named].sort();
    if (reactEntry.defaultName && named.length) {
      return [`import ${reactEntry.defaultName}, { ${named.join(", ")} } from "react";`];
    }
    if (named.length) return [`import { ${named.join(", ")} } from "react";`];
    if (reactEntry.defaultName) return [`import ${reactEntry.defaultName} from "react";`];
    return [];
  })(),
  "",
  ...previewFns.flatMap((fn) => [fn, ""]),
  "export const GENERATED_DOC_PREVIEWS: Record<",
  "  string,",
  "  () => ReactElement",
  "> = {",
  ...registryEntries,
  "};",
  "",
].join("\n");

// Deduplicate accidental double react imports from emitImportLines
const cleaned = previewSource
  .split("\n")
  .filter((line, i, arr) => {
    if (!line.includes('from "react"')) return true;
    // keep first react import lines we explicitly added; drop duplicates from emit
    const firstReact = arr.findIndex((l) => l.includes('from "react"'));
    return i === firstReact || !line.startsWith("import");
  });

// Simpler: rebuild without the buggy filter
const reactEntry = allImports.get("react");
allImports.delete("react");
const importBlock = emitImportLines(allImports);
const reactImports = [];
if (reactEntry) {
  const named = [...reactEntry.named].sort();
  if (named.length) reactImports.push(`import { ${named.join(", ")} } from "react";`);
}

const finalPreview = [
  "/** AUTO-GENERATED by scripts/gen-doc-codes.mjs — do not edit by hand. */",
  `"use client";`,
  "",
  'import type { ReactElement } from "react";',
  ...reactImports,
  ...importBlock,
  "",
  ...previewFns.flatMap((fn) => [fn, ""]),
  "export const GENERATED_DOC_PREVIEWS: Record<",
  "  string,",
  "  () => ReactElement",
  "> = {",
  ...registryEntries,
  "};",
  "",
].join("\n");

fs.writeFileSync(previewsOut, finalPreview, "utf8");
console.log(
  "wrote",
  Object.keys(codes).length,
  "codes ->",
  codesOut,
);
console.log(
  "wrote",
  registryEntries.length,
  "previews ->",
  previewsOut,
);
