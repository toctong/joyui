"use client";

import { cn } from "@/lib/cn";

type Token = {
  name: string;
  css: string;
  utility: string;
  role: string;
};

const GROUPS: { title: string; description: string; tokens: Token[] }[] = [
  {
    title: "表面与文字",
    description: "页面画布、卡片与主文案。",
    tokens: [
      {
        name: "background",
        css: "--joy-background",
        utility: "bg-background",
        role: "页面背景",
      },
      {
        name: "foreground",
        css: "--joy-foreground",
        utility: "text-foreground",
        role: "主文字",
      },
      {
        name: "card",
        css: "--joy-card",
        utility: "bg-card",
        role: "卡片表面",
      },
      {
        name: "muted",
        css: "--joy-muted",
        utility: "bg-muted",
        role: "弱化表面",
      },
      {
        name: "muted-foreground",
        css: "--joy-muted-foreground",
        utility: "text-muted-foreground",
        role: "次要文字",
      },
    ],
  },
  {
    title: "品牌与强调",
    description: "主操作、次要操作与强调色。",
    tokens: [
      {
        name: "primary",
        css: "--joy-primary",
        utility: "bg-primary",
        role: "主色 / CTA",
      },
      {
        name: "primary-foreground",
        css: "--joy-primary-foreground",
        utility: "text-primary-foreground",
        role: "主色上的文字",
      },
      {
        name: "secondary",
        css: "--joy-secondary",
        utility: "bg-secondary",
        role: "次要按钮",
      },
      {
        name: "accent",
        css: "--joy-accent",
        utility: "bg-accent",
        role: "悬停 / 高亮",
      },
      {
        name: "destructive",
        css: "--joy-destructive",
        utility: "bg-destructive",
        role: "危险操作",
      },
    ],
  },
  {
    title: "边框与焦点",
    description: "分割线、输入框边框与 focus ring。",
    tokens: [
      {
        name: "border",
        css: "--joy-border",
        utility: "border-border",
        role: "默认边框",
      },
      {
        name: "input",
        css: "--joy-input",
        utility: "border-input",
        role: "表单边框",
      },
      {
        name: "ring",
        css: "--joy-ring",
        utility: "ring-ring",
        role: "焦点环",
      },
    ],
  },
  {
    title: "图表",
    description: "图表系列色，浅色 / 深色主题都会重映射。",
    tokens: [
      {
        name: "chart-1",
        css: "--joy-chart-1",
        utility: "bg-chart-1",
        role: "系列 1",
      },
      {
        name: "chart-2",
        css: "--joy-chart-2",
        utility: "bg-chart-2",
        role: "系列 2",
      },
      {
        name: "chart-3",
        css: "--joy-chart-3",
        utility: "bg-chart-3",
        role: "系列 3",
      },
      {
        name: "chart-4",
        css: "--joy-chart-4",
        utility: "bg-chart-4",
        role: "系列 4",
      },
      {
        name: "chart-5",
        css: "--joy-chart-5",
        utility: "bg-chart-5",
        role: "系列 5",
      },
    ],
  },
];

function Swatch({ token }: { token: Token }) {
  const isText = token.utility.startsWith("text-");
  const isRing = token.utility.startsWith("ring-");

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div
        className={cn(
          "flex h-20 items-center justify-center",
          isText && "bg-background",
          isRing && "bg-background ring-4 ring-inset",
          !isText && !isRing && token.utility,
          isRing && token.utility,
        )}
        style={
          isText
            ? { color: `var(${token.css})` }
            : isRing
              ? undefined
              : { background: `var(${token.css})` }
        }
      >
        {isText ? (
          <span className="text-lg font-semibold">Aa</span>
        ) : isRing ? (
          <span className="rounded-md border border-dashed border-fd-border px-3 py-1 text-xs text-fd-muted-foreground">
            focus
          </span>
        ) : null}
      </div>
      <div className="space-y-1 border-t border-fd-border p-3 text-sm">
        <div className="font-medium text-fd-foreground">{token.name}</div>
        <div className="text-fd-muted-foreground">{token.role}</div>
        <code className="block truncate text-xs text-fd-muted-foreground">
          {token.utility}
        </code>
        <code className="block truncate text-xs text-fd-muted-foreground">
          {token.css}
        </code>
      </div>
    </div>
  );
}

export function ColorTokens() {
  return (
    <div className="not-prose space-y-10">
      {GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-fd-foreground">
              {group.title}
            </h3>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              {group.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <Swatch key={token.name} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
