"use client";

import { cn } from "@/lib/cn";

const SAMPLE = "The five boxing wizards jump quickly. 快速的棕色狐狸。";

const STYLES: {
  name: string;
  className: string;
  meta: string;
  usage: string;
}[] = [
  {
    name: "Display",
    className: "text-4xl font-semibold tracking-tight",
    meta: "36px · semibold",
    usage: "营销页主标题、落地页英雄区",
  },
  {
    name: "Title",
    className: "text-2xl font-semibold tracking-tight",
    meta: "24px · semibold",
    usage: "页面标题、大数字 KPI",
  },
  {
    name: "Heading",
    className: "text-lg font-semibold",
    meta: "18px · semibold",
    usage: "区块标题、卡片标题",
  },
  {
    name: "Subheading",
    className: "text-base font-semibold",
    meta: "16px · semibold",
    usage: "小节标题、强调正文",
  },
  {
    name: "Body",
    className: "text-sm font-medium",
    meta: "14px · medium",
    usage: "默认 UI 文案：按钮、表格、导航",
  },
  {
    name: "Body regular",
    className: "text-sm font-normal",
    meta: "14px · regular",
    usage: "说明段落、较长正文",
  },
  {
    name: "Caption",
    className: "text-xs font-medium",
    meta: "12px · medium",
    usage: "时间戳、轴标签、辅助信息",
  },
  {
    name: "Overline",
    className: "text-xs font-medium uppercase tracking-wide",
    meta: "12px · medium · tracking",
    usage: "分类标签、eyebrow",
  },
];

export function TypographyScale() {
  return (
    <div className="not-prose space-y-3">
      {STYLES.map((style) => (
        <div
          key={style.name}
          className="rounded-xl border border-fd-border bg-fd-card p-4"
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-fd-foreground">
                {style.name}
              </div>
              <div className="text-xs text-fd-muted-foreground">
                {style.meta} · {style.usage}
              </div>
            </div>
            <code className="rounded-md bg-fd-secondary px-2 py-1 text-xs text-fd-muted-foreground">
              {style.className}
            </code>
          </div>
          <p className={cn("text-fd-foreground", style.className)}>{SAMPLE}</p>
        </div>
      ))}
    </div>
  );
}

export function TypographyColors() {
  const colors = [
    { label: "foreground", className: "text-foreground" },
    { label: "muted-foreground", className: "text-muted-foreground" },
    { label: "primary", className: "text-primary" },
    { label: "destructive", className: "text-destructive" },
  ];

  return (
    <div className="not-prose grid gap-3 sm:grid-cols-2">
      {colors.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-fd-border bg-fd-card p-4"
        >
          <p className={cn("text-base font-medium", item.className)}>
            语义文字色 · {item.label}
          </p>
          <code className="mt-2 block text-xs text-fd-muted-foreground">
            {item.className}
          </code>
        </div>
      ))}
    </div>
  );
}
