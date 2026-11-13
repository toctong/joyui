import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  RiAccessibilityLine,
  RiArrowRightLine,
  RiCodeSSlashLine,
  RiContrast2Line,
  RiDatabase2Line,
  RiNpmjsLine,
  RiPaletteLine,
  RiRobot2Line,
  RiSparklingLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export function GettingStartedHero({ className }: { className?: string }) {
  return (
    <section
      className={cx(
        "not-prose relative overflow-hidden rounded-3xl border border-separator-border",
        "bg-background-secondary-default",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklab,var(--color-accent-400)_22%,transparent),transparent_55%),radial-gradient(ellipse_at_90%_10%,color-mix(in_oklab,var(--color-violet-400)_14%,transparent),transparent_45%)]"
      />

      <div className="relative px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
        <p className="mb-3 text-caption-1-semibold tracking-wide text-accent-600 uppercase">
          Getting started
        </p>
        <h2 className="max-w-2xl text-balance text-title-1-medium text-text-primary sm:text-[1.85rem] sm:leading-tight">
          React 设计系统，为智能体界面而打造
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-body-regular text-text-secondary sm:text-[0.9375rem] sm:leading-6">
          高保真组件、数据图表与完整模板，语义化 token 贯穿浅色 / 深色。通过 npm、MCP 或 Agent Skill
          装进项目，智能体也能按同一套规范生成界面。
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-b from-accent-500 to-accent-600 px-3.5 py-2 text-body-medium text-white shadow-nav-selected transition-[filter] hover:brightness-105"
          >
            开始安装
            <RiArrowRightLine className="size-4" aria-hidden />
          </Link>
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-1.5 rounded-full border border-separator-border bg-background-full px-3.5 py-2 text-body-medium text-text-secondary transition-colors hover:bg-background-secondary-hover hover:text-text-primary"
          >
            浏览组件
          </Link>
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "组件与模板", value: "100+", hint: "基础 · 组合 · 图表 · 页面" },
            { label: "设计变量", value: "400+", hint: "颜色 · 字体 · 阴影 · 圆角" },
            { label: "接入方式", value: "3", hint: "npm · MCP · Agent Skill" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-separator-border/80 bg-background-full/80 px-4 py-3.5 backdrop-blur-sm"
            >
              <dt className="text-caption-1-semibold text-text-tertiary">{stat.label}</dt>
              <dd className="mt-1 text-title-2-medium text-text-primary">{stat.value}</dd>
              <dd className="mt-0.5 text-body-regular text-text-secondary">{stat.hint}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Path cards (shadcn-style starting points)                                   */
/* -------------------------------------------------------------------------- */

const PATHS: {
  href: string;
  title: string;
  description: string;
  icon: Icon;
}[] = [
  {
    href: "/docs/installation",
    title: "npm 安装",
    description: "整库安装 @joyui/react，引入样式与 Provider 即可使用。",
    icon: RiNpmjsLine,
  },
  {
    href: "/docs/mcp",
    title: "MCP 服务器",
    description: "连接 Cursor / VS Code，让智能体浏览并写入组件。",
    icon: RiTerminalBoxLine,
  },
  {
    href: "/docs/skill",
    title: "Agent Skill",
    description: "安装 SKILL.md，让编码智能体始终加载设计规则。",
    icon: RiSparklingLine,
  },
];

export function GettingStartedPaths({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose grid gap-3 sm:grid-cols-3", className)}>
      {PATHS.map((path) => {
        const Icon = path.icon;
        return (
          <Link
            key={path.href}
            href={path.href}
            className={cx(
              "group flex flex-col rounded-2xl border border-separator-border bg-background-full p-4",
              "transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-sm",
            )}
          >
            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex items-center gap-1 text-title-3-medium text-text-primary">
              {path.title}
              <RiArrowRightLine
                className="size-4 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
                aria-hidden
              />
            </span>
            <span className="mt-1.5 text-body-regular text-text-secondary">{path.description}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Features                                                                    */
/* -------------------------------------------------------------------------- */

const FEATURES: {
  title: string;
  description: string;
  icon: Icon;
  tone: keyof typeof TONE;
}[] = [
  {
    title: "源代码由您掌握",
    description: "可整库安装，也可 CLI 拷贝源码。没有黑盒 runtime，打开就能改。",
    icon: RiCodeSSlashLine,
    tone: "accent",
  },
  {
    title: "为 AI 智能体而打造",
    description: "MCP 与 Agent Skill 让智能体按 token 体系生成界面，而不是自行发挥。",
    icon: RiRobot2Line,
    tone: "violet",
  },
  {
    title: "默认无障碍",
    description: "建立在 React Aria：标签、焦点、键盘与 ARIA 开箱即用。",
    icon: RiAccessibilityLine,
    tone: "accent",
  },
  {
    title: "语义化设计变量",
    description: "颜色、字体与阴影统一走 token。改强调色一次，全站跟上。",
    icon: RiPaletteLine,
    tone: "amber",
  },
  {
    title: "内置深色模式",
    description: "语义 token 在 .dark 下自动切换，无需逐组件写 dark: 覆盖。",
    icon: RiContrast2Line,
    tone: "teal",
  },
  {
    title: "数据展示友好",
    description: "图表卡片、仪表盘区块与完整模板，适合数据即界面的产品。",
    icon: RiDatabase2Line,
    tone: "accent",
  },
];

const TONE = {
  accent: "bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
} as const;

export function GettingStartedFeatures({ className }: { className?: string }): ReactNode {
  return (
    <div className={cx("not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="rounded-2xl border border-separator-border bg-background-full p-4 sm:p-5"
          >
            <span
              className={cx(
                "mb-3 inline-flex size-8 items-center justify-center rounded-lg",
                TONE[feature.tone],
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <h3 className="text-body-medium text-text-primary">{feature.title}</h3>
            <p className="mt-1 text-body-regular text-text-secondary">{feature.description}</p>
          </article>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Numbered install steps                                                      */
/* -------------------------------------------------------------------------- */

export function GettingStartedSteps({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <ol className={cx("not-prose my-4 flex list-none flex-col gap-5 p-0", className)}>
      {children}
    </ol>
  );
}

export function GettingStartedStep({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="relative flex gap-4">
      <span
        className={cx(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          "bg-accent-100 text-caption-1-semibold text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
        )}
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-body-medium text-text-primary">{title}</p>
        <div className="text-body-regular text-text-secondary [&_pre]:mt-2 [&_pre]:mb-0">
          {children}
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Foundation teasers                                                          */
/* -------------------------------------------------------------------------- */

export function GettingStartedFoundations({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose grid gap-3 sm:grid-cols-2", className)}>
      <FoundationCard
        href="/docs/color"
        title="颜色"
        cta="设计变量参考"
        swatch={<ColorSwatchRow />}
      >
        语义色覆盖文字、背景、边框与图表。强调色阶驱动按钮与选中态，深色模式自动切换。
      </FoundationCard>
      <FoundationCard
        href="/docs/typography"
        title="字体排版"
        cta="字体层级"
        swatch={<TypeSampleRow />}
      >
        Figma 层级映射为组合工具类：字号、字重、行高、字间距一次选好，无需拼凑。
      </FoundationCard>
    </div>
  );
}

function FoundationCard({
  href,
  title,
  cta,
  swatch,
  children,
}: {
  href: string;
  title: string;
  cta: string;
  swatch: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group flex flex-col rounded-2xl border border-separator-border bg-background-secondary-default p-5",
        "transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-sm",
      )}
    >
      <div className="mb-4">{swatch}</div>
      <h3 className="text-title-3-medium text-text-primary">{title}</h3>
      <p className="mt-1.5 flex-1 text-body-regular text-text-secondary">{children}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-body-medium text-accent-600">
        {cta}
        <RiArrowRightLine
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function ColorSwatchRow() {
  const chips = [
    "bg-accent-500",
    "bg-accent-300",
    "bg-accent-100",
    "bg-background-tertiary-default",
    "bg-border-secondary-default",
    "bg-text-primary",
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((tone) => (
        <span
          key={tone}
          className={cx("size-7 rounded-full border border-separator-border shadow-xs", tone)}
        />
      ))}
    </div>
  );
}

function TypeSampleRow() {
  return (
    <div className="space-y-1">
      <p className="text-title-2-medium text-text-primary">让数据井然有序</p>
      <p className="text-body-medium text-text-secondary">text-body-medium</p>
      <p className="text-caption-1-semibold text-text-tertiary">text-caption-1-semibold</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Next links                                                                  */
/* -------------------------------------------------------------------------- */

const NEXT: { href: string; title: string; description: string }[] = [
  { href: "/docs/i18n", title: "国际化", description: "locale / 文案 / JoyUIProvider" },
  { href: "/docs/rtl", title: "RTL 支持", description: "方向镜像与排版约定" },
  { href: "/docs/icons", title: "图标", description: "Remix Icon 全库浏览与复制" },
  { href: "/docs/button", title: "按钮", description: "从第一个交互组件开始" },
  { href: "/docs/data-grid", title: "数据网格", description: "表格与虚拟滚动" },
  { href: "/docs/admin-dashboard", title: "后台管理", description: "完整页面模板" },
];

export function GettingStartedNext({ className }: { className?: string }) {
  return (
    <div className={cx("not-prose grid gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {NEXT.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cx(
            "group rounded-2xl border border-separator-border bg-background-full px-4 py-3.5",
            "transition-colors hover:border-accent-300 hover:bg-background-secondary-default",
          )}
        >
          <span className="flex items-center gap-1 text-body-medium text-text-primary">
            {item.title}
            <RiArrowRightLine
              className="size-3.5 text-text-tertiary opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </span>
          <span className="mt-0.5 block text-body-regular text-text-secondary">
            {item.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section lead                                                                */
/* -------------------------------------------------------------------------- */

export function GettingStartedLead({ children }: { children: ReactNode }) {
  // `div`, not `p` — MDX wraps block children in `<p>`, and `<p>`-in-`<p>` hydrates badly.
  return (
    <div className="not-prose mb-4 max-w-2xl text-pretty text-body-regular text-text-secondary">
      {children}
    </div>
  );
}
