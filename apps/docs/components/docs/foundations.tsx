"use client";

import { useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiCheckLine,
  RiFileCopyLine,
  RiLayoutGridLine,
  RiLineChartLine,
  RiPaletteLine,
  RiPuzzleLine,
  RiTextSnippet,
  RiWindowLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";

/* -------------------------------------------------------------------------- */
/* Shared                                                                      */
/* -------------------------------------------------------------------------- */

function FoundationsHero({
  eyebrow,
  title,
  description,
  children,
  visual,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "not-prose overflow-hidden rounded-2xl border border-separator-border bg-background-full",
        className,
      )}
    >
      <div
        className={cx(
          "grid",
          visual && "min-[820px]:grid-cols-[minmax(0,1.2fr)_minmax(200px,0.8fr)]",
        )}
      >
        <div className="flex flex-col justify-center border-separator-border px-5 py-6 sm:px-7 sm:py-7 min-[820px]:border-e">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent-500" aria-hidden />
            <p className="text-caption-1-semibold tracking-[0.08em] text-text-tertiary uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="max-w-xl text-balance text-title-2-medium text-text-primary sm:text-title-1-medium">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-body-regular text-text-secondary">
            {description}
          </p>
          {children ? <div className="mt-5">{children}</div> : null}
        </div>
        {visual ? (
          <div
            aria-hidden
            className="relative flex items-center justify-center border-t border-separator-border bg-background-secondary-default px-5 py-6 min-[820px]:border-t-0 sm:px-6"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.55]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklab, var(--color-separator-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-separator-border) 70%, transparent) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative w-full max-w-[280px]">{visual}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ColorHeroVisual() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        "bg-text-primary",
        "bg-text-secondary",
        "bg-accent-500",
        "bg-status-lime-background",
        "bg-background-tertiary-default",
        "bg-status-yellow-background",
        "bg-status-rose-background",
        "bg-accent-100",
      ].map((tone) => (
        <div
          key={tone}
          className={cx("aspect-square rounded-xl border border-separator-border shadow-xs", tone)}
        />
      ))}
    </div>
  );
}

function TypeHeroVisual() {
  return (
    <div className="space-y-3 rounded-xl border border-separator-border bg-background-full p-4 shadow-xs">
      <p className="text-title-2-medium text-text-primary">Aa</p>
      <p className="text-body-regular text-text-secondary">正文 · body-regular</p>
      <p className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">
        Caption
      </p>
      <div className="h-px bg-separator-border" />
      <p className="font-mono text-[11px] text-text-tertiary">text-title-2-medium</p>
    </div>
  );
}

function IconsHeroVisual() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        RiLayoutGridLine,
        RiPuzzleLine,
        RiLineChartLine,
        RiWindowLine,
        RiPaletteLine,
        RiTextSnippet,
        RiArrowRightLine,
        RiCheckLine,
      ].map((Icon, i) => (
        <div
          key={i}
          className="flex aspect-square items-center justify-center rounded-xl border border-separator-border bg-background-full text-text-secondary shadow-xs"
        >
          <Icon className="size-5" />
        </div>
      ))}
    </div>
  );
}

function CopyChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={onCopy}
      title={`复制 ${value}`}
      className={cx(
        "inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5",
        "font-mono text-[11px] leading-4 text-text-tertiary",
        "transition-colors hover:bg-background-tertiary-default hover:text-text-secondary",
      )}
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <RiCheckLine className="size-3.5 shrink-0 text-accent-600" aria-hidden />
      ) : (
        <RiFileCopyLine className="size-3.5 shrink-0 opacity-60" aria-hidden />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Color                                                                       */
/* -------------------------------------------------------------------------- */

type Swatch = { label: string; token: string; className: string; fg?: boolean };

const COLOR_GROUPS: { title: string; hint: string; items: Swatch[] }[] = [
  {
    title: "文字",
    hint: "正文与状态文字",
    items: [
      { label: "Primary", token: "text-text-primary", className: "bg-text-primary", fg: true },
      { label: "Secondary", token: "text-text-secondary", className: "bg-text-secondary", fg: true },
      { label: "Tertiary", token: "text-text-tertiary", className: "bg-text-tertiary", fg: true },
      { label: "Brand", token: "text-text-brand-primary", className: "bg-text-brand-primary", fg: true },
      { label: "Error", token: "text-text-error-primary", className: "bg-text-error-primary", fg: true },
    ],
  },
  {
    title: "表面",
    hint: "页面与卡片背景",
    items: [
      { label: "Full", token: "bg-background-full", className: "bg-background-full" },
      { label: "Primary", token: "bg-background-primary-default", className: "bg-background-primary-default" },
      { label: "Secondary", token: "bg-background-secondary-default", className: "bg-background-secondary-default" },
      { label: "Tertiary", token: "bg-background-tertiary-default", className: "bg-background-tertiary-default" },
    ],
  },
  {
    title: "边框与分隔",
    hint: "描边、分隔线、焦点",
    items: [
      { label: "Default", token: "border-border-secondary-default", className: "bg-border-secondary-default" },
      { label: "Button", token: "border-border-button-default", className: "bg-border-button-default" },
      { label: "Separator", token: "border-separator-border", className: "bg-separator-border" },
      { label: "Focus", token: "ring-border-focus-ring", className: "bg-border-focus-ring" },
    ],
  },
  {
    title: "强调与状态",
    hint: "CTA 与语义状态色",
    items: [
      { label: "Accent", token: "bg-accent-500", className: "bg-accent-500" },
      { label: "Accent soft", token: "bg-accent-100", className: "bg-accent-100" },
      { label: "Lime", token: "bg-status-lime-background", className: "bg-status-lime-background" },
      { label: "Yellow", token: "bg-status-yellow-background", className: "bg-status-yellow-background" },
      { label: "Rose", token: "bg-status-rose-background", className: "bg-status-rose-background" },
    ],
  },
];

export function FoundationsColorPage({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose space-y-8", className)}>
      <FoundationsHero
        eyebrow="Foundations · Color"
        title="语义色，而不是调色板"
        description="组件与业务界面只使用语义 token。给 html 加 .dark 后，浅色 / 深色会自动翻转；不要写 raw palette 或 hex。"
        visual={<ColorHeroVisual />}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-1 font-mono text-[12px] text-text-primary">
            text-text-primary
          </span>
          <span className="rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-1 font-mono text-[12px] text-text-secondary">
            bg-background-secondary-default
          </span>
          <span className="rounded-lg bg-accent-500 px-2.5 py-1 font-mono text-[12px] text-white">
            accent-500
          </span>
        </div>
      </FoundationsHero>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-separator-border bg-background-full p-5">
          <p className="text-caption-1-semibold text-text-tertiary uppercase">Live surface</p>
          <div className="mt-4 space-y-3 rounded-2xl border border-separator-border bg-background-secondary-default p-4">
            <p className="text-title-3-medium text-text-primary">语义表面预览</p>
            <p className="text-body-regular text-text-secondary">
              主文字、次文字与三级说明叠在 secondary 表面上，边框使用 separator。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-status-lime-background px-2.5 py-1 text-caption-1-semibold text-status-lime-text">
                +14.8%
              </span>
              <span className="rounded-full bg-status-rose-background px-2.5 py-1 text-caption-1-semibold text-status-rose-text">
                -2.1%
              </span>
              <span className="rounded-full bg-accent-100 px-2.5 py-1 text-caption-1-semibold text-accent-700 dark:text-accent-300">
                Brand
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-separator-border bg-background-full p-5">
          <p className="text-caption-1-semibold text-text-tertiary uppercase">Rules</p>
          <ul className="mt-3 space-y-2.5 text-body-regular text-text-secondary">
            <li>只用语义 token，不用 raw palette 或 hex。</li>
            <li>
              深色模式：给 html 加{" "}
              <code className="rounded bg-background-tertiary-default px-1 py-0.5 font-mono text-[12px]">
                .dark
              </code>
              ，token 自动翻转。
            </li>
            <li>
              完整定义见{" "}
              <code className="rounded bg-background-tertiary-default px-1 py-0.5 font-mono text-[12px]">
                @joyui/react/theme.css
              </code>
              。
            </li>
            <li>不存在的类不会生效——以 theme 为准。</li>
          </ul>
        </div>
      </div>

      {COLOR_GROUPS.map((group) => (
        <section key={group.title} className="space-y-3">
          <div>
            <h3 className="text-title-3-medium text-text-primary">{group.title}</h3>
            <p className="mt-0.5 text-body-regular text-text-secondary">{group.hint}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {group.items.map((item) => (
              <div
                key={item.token}
                className="overflow-hidden rounded-2xl border border-separator-border bg-background-full"
              >
                <div
                  className={cx(
                    "h-16 border-b border-separator-border",
                    item.className,
                    item.fg && "ring-1 ring-inset ring-black/5 dark:ring-white/10",
                  )}
                />
                <div className="space-y-1 px-2.5 py-2">
                  <p className="text-caption-1-semibold text-text-primary">{item.label}</p>
                  <CopyChip value={item.token} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

const TYPE_SCALE: { sample: string; token: string; note: string }[] = [
  { sample: "Display 4", token: "text-display-4-medium", note: "32 / 44 · 营销标题" },
  { sample: "Title 1", token: "text-title-1-medium", note: "24 / 34 · 页标题" },
  { sample: "Title 2", token: "text-title-2-medium", note: "20 / 26 · 区块标题" },
  { sample: "Title 3", token: "text-title-3-medium", note: "18 / 26 · 卡片标题" },
  { sample: "Headline", token: "text-headline-medium", note: "16 / 22 · 强调行" },
  { sample: "Body", token: "text-body-regular", note: "14 / 20 · 正文" },
  { sample: "Body medium", token: "text-body-medium", note: "14 / 20 · 控件标签" },
  { sample: "Body 2", token: "text-body-2-regular", note: "13 / 18 · 紧凑正文" },
  { sample: "Caption", token: "text-caption-1-semibold", note: "说明 / 角标" },
];

export function FoundationsTypePage({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose space-y-8", className)}>
      <FoundationsHero
        eyebrow="Foundations · Typography"
        title="字阶打包，不要手拼"
        description="字号、字重、行高、字间距写在同一个 text-{family}-{weight} 工具类里。选样式即可，禁止 text-sm font-medium 这类拼装。"
        visual={<TypeHeroVisual />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: "标题", body: "display-* · title-* · headline-*" },
          { title: "正文", body: "body-regular / medium / semibold" },
          { title: "说明", body: "caption-1-* · label-1-*" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-separator-border bg-background-full p-4"
          >
            <p className="text-body-medium text-text-primary">{card.title}</p>
            <p className="mt-1 font-mono text-[12px] text-text-tertiary">{card.body}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-separator-border bg-background-full">
        {TYPE_SCALE.map((row, index) => (
          <div
            key={row.token}
            className={cx(
              "flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-5",
              index > 0 && "border-t border-separator-border",
            )}
          >
            <p className={cx("min-w-0 text-text-primary", row.token)}>{row.sample}</p>
            <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
              <CopyChip value={row.token} />
              <span className="text-caption-1-regular text-text-tertiary">{row.note}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components overview                                                         */
/* -------------------------------------------------------------------------- */

const COMPONENT_PATHS: {
  href: string;
  title: string;
  count: string;
  description: string;
  icon: typeof RiLayoutGridLine;
}[] = [
  {
    href: "/docs/base",
    title: "基础组件",
    count: "50+",
    description: "按钮、表单、反馈与导航等日常积木。",
    icon: RiLayoutGridLine,
  },
  {
    href: "/docs/compounds",
    title: "组合组件",
    count: "20+",
    description: "Composer、Auth、Data Grid 等可落地模块。",
    icon: RiPuzzleLine,
  },
  {
    href: "/docs/charts",
    title: "图表",
    count: "19",
    description: "仪表盘数据卡片：面积、漏斗、热力等。",
    icon: RiLineChartLine,
  },
  {
    href: "/docs/templates",
    title: "模板",
    count: "11",
    description: "完整页面模板，侧栏与图表已组装。",
    icon: RiWindowLine,
  },
];

export function FoundationsComponentsPage({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose space-y-6", className)}>
      <div className="flex flex-col gap-4 border-b border-separator-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-1.5">
          <p className="text-caption-1-semibold tracking-[0.08em] text-text-tertiary uppercase">
            Foundations · Components
          </p>
          <p className="text-body-regular text-text-secondary">
            基础、组合、图表、模板与侧栏分区一一对应。落地时用精确名称安装，或通过 JoyUI MCP 写入。
          </p>
          <p className="font-mono text-[12px] text-text-tertiary">
            npx @joyui/cli add button --yes
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            href="/docs/button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent-500 px-3.5 py-2 text-body-medium text-white transition-[filter] hover:brightness-105"
          >
            从按钮开始
            <RiArrowRightLine className="size-4" aria-hidden />
          </Link>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            安装指南
            <RiArrowRightLine className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMPONENT_PATHS.map((path) => {
          const Icon = path.icon;
          return (
            <Link
              key={path.href}
              href={path.href}
              className={cx(
                "group relative overflow-hidden rounded-2xl border border-separator-border bg-background-full p-5",
                "transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-accent-300 hover:bg-background-secondary-default",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-title-2-medium tabular-nums text-text-primary">{path.count}</span>
              </div>
              <p className="mt-4 flex items-center gap-1 text-title-3-medium text-text-primary">
                {path.title}
                <RiArrowRightLine
                  className="size-4 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
                  aria-hidden
                />
              </p>
              <p className="mt-1.5 text-body-regular text-text-secondary">{path.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/docs/color"
          className="flex items-center gap-3 rounded-2xl border border-separator-border bg-background-secondary-default p-4 transition-colors hover:bg-background-full"
        >
          <RiPaletteLine className="size-5 text-accent-600" aria-hidden />
          <div>
            <p className="text-body-medium text-text-primary">颜色</p>
            <p className="text-body-regular text-text-secondary">语义 token 与状态色</p>
          </div>
        </Link>
        <Link
          href="/docs/typography"
          className="flex items-center gap-3 rounded-2xl border border-separator-border bg-background-secondary-default p-4 transition-colors hover:bg-background-full"
        >
          <RiTextSnippet className="size-5 text-accent-600" aria-hidden />
          <div>
            <p className="text-body-medium text-text-primary">字体排版</p>
            <p className="text-body-regular text-text-secondary">复合字阶工具类</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons intro                                                                 */
/* -------------------------------------------------------------------------- */

export function FoundationsIconsIntro({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose space-y-6", className)}>
      <FoundationsHero
        eyebrow="Foundations · Icons"
        title="Remix Icon，按组件引用传入"
        description="JoyUI 使用 @remixicon/react（3000+）。传组件引用而不是已渲染节点；颜色走语义 icon token；RTL 下导航箭头会按方向镜像。"
        visual={<IconsHeroVisual />}
      >
        <div className="flex flex-wrap gap-2">
          <code className="rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-1 font-mono text-[12px] text-text-secondary">
            leadingIcon=&#123;RiAddLine&#125;
          </code>
          <code className="rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-1 font-mono text-[12px] text-text-secondary">
            text-foreground-icon-primary
          </code>
        </div>
      </FoundationsHero>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "传引用",
            body: "leadingIcon={RiAddLine}，不要传 <RiAddLine />。",
          },
          {
            title: "语义色",
            body: "text-foreground-icon-primary … quaternary。",
          },
          {
            title: "RTL",
            body: "左右导航箭头在 RTL 下自动镜像。",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-separator-border bg-background-full p-4"
          >
            <p className="text-body-medium text-text-primary">{card.title}</p>
            <p className="mt-1 text-body-regular text-text-secondary">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
