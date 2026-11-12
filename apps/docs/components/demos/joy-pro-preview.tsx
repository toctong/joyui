"use client";

import * as React from "react";
import { ActivityRingsCard } from "@/components/application/dashboard/activity-rings-card";
import { AreaChartCard } from "@/components/application/dashboard/area-chart-card";
import { ComboChartCard } from "@/components/application/dashboard/combo-chart-card";
import { ContributionsCard } from "@/components/application/dashboard/contributions-card";
import { EarningsChartCard } from "@/components/application/dashboard/earnings-chart-card";
import { FunnelChartCard } from "@/components/application/dashboard/funnel-chart-card";
import { HeatmapChartCard } from "@/components/application/dashboard/heatmap-chart-card";
import { LineChartCard } from "@/components/application/dashboard/line-chart-card";
import { MostActiveDaysCard } from "@/components/application/dashboard/most-active-days-card";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { RadarChartCard } from "@/components/application/dashboard/radar-chart-card";
import { RadialChartCard } from "@/components/application/dashboard/radial-chart-card";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { SankeyChartCard } from "@/components/application/dashboard/sankey-chart-card";
import { ScatterChartCard } from "@/components/application/dashboard/scatter-chart-card";
import { SleepScoreCard } from "@/components/application/dashboard/sleep-score-card";
import { StageBarsCard } from "@/components/application/dashboard/stage-bars-card";
import { StepsCard } from "@/components/application/dashboard/steps-card";
import { Composer } from "@/components/application/composer/composer";
import { ComposerWithAttachments } from "@/components/application/composer-panel/composer-attachments";
import { ComposerPanel } from "@/components/application/composer-panel/composer-panel";
import { WebSearch } from "@/components/application/web-search/web-search";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress/progress";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

const CHART_PREVIEWS: Record<string, () => React.ReactElement> = {
  "activity-rings-card": () => <ActivityRingsCard />,
  "area-chart-card": () => <AreaChartCard />,
  "combo-chart-card": () => <ComboChartCard />,
  "contributions-card": () => <ContributionsCard />,
  "earnings-chart-card": () => <EarningsChartCard />,
  "funnel-chart-card": () => <FunnelChartCard />,
  "heatmap-chart-card": () => <HeatmapChartCard />,
  "line-chart-card": () => <LineChartCard />,
  "most-active-days-card": () => <MostActiveDaysCard />,
  "orders-chart-card": () => <OrdersChartCard />,
  "radar-chart-card": () => <RadarChartCard />,
  "radial-chart-card": () => <RadialChartCard />,
  "revenue-chart-card": () => <RevenueChartCard />,
  "sankey-chart-card": () => <SankeyChartCard />,
  "scatter-chart-card": () => <ScatterChartCard />,
  "sleep-score-card": () => <SleepScoreCard />,
  "stage-bars-card": () => <StageBarsCard />,
  "steps-card": () => <StepsCard />,
};

function Shell({
  children,
  className,
  wash = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Soft accent wash behind content. Off for chat-style cards. */
  wash?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative w-full overflow-hidden rounded-2xl border border-separator-border bg-background-secondary-default p-4 sm:p-6",
        className,
      )}
    >
      {wash ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-accent-100/70 to-transparent"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

function ComposerMock({ withAttachments = false }: { withAttachments?: boolean }) {
  return (
    <div className="flex w-full justify-center px-2 py-10 sm:py-14">
      <div className="w-full max-w-xl">
        {withAttachments ? (
          <ComposerWithAttachments />
        ) : (
          <Composer defaultModelMenuOpen />
        )}
      </div>
    </div>
  );
}

function AgentProgressMock() {
  const steps = [
    { label: "读取项目文件", done: true },
    { label: "更新浅色 token", done: true },
    { label: "实现深色 token", active: true },
    { label: "注册主题切换", done: false },
    { label: "跑通构建", done: false },
  ];
  return (
    <Shell className="max-w-md mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-headline-medium text-text-primary">任务进度</p>
      </div>
      <p className="mb-4 text-body-2-regular text-text-secondary">还剩 3 步</p>
      <ul className="space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3">
            <span
              className={cx(
                "size-2.5 rounded-full",
                step.done && "bg-accent-500",
                step.active && "bg-accent-400 ring-4 ring-accent-100",
                !step.done && !step.active && "bg-background-tertiary-default",
              )}
            />
            <span
              className={cx(
                "text-body-1-medium",
                step.active ? "text-text-primary" : "text-text-secondary",
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function AgentLimitsMock() {
  return (
    <Shell className="max-w-md mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-headline-medium text-text-primary">智能体额度</p>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-body-2-medium">
          <span className="text-text-secondary">上下文窗口</span>
          <span className="text-text-primary">128k / 200k</span>
        </div>
        <ProgressBar value={64} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ["输入 Token", "42.1k"],
          ["输出 Token", "18.4k"],
          ["工具调用", "126"],
          ["重置", "14h"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-separator-border bg-background-primary-default p-3"
          >
            <p className="text-caption-1-medium text-text-tertiary">{label}</p>
            <p className="mt-1 text-title-3-semibold text-text-primary">{value}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function TaskListMock() {
  const items = [
    { title: "扫描依赖图", state: "完成" },
    { title: "生成迁移计划", state: "进行中" },
    { title: "写入组件源码", state: "等待" },
  ];
  return (
    <Shell className="max-w-md mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-headline-medium text-text-primary">任务列表</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item.title}
            className="rounded-xl border border-separator-border bg-background-primary-default px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-body-1-medium text-text-primary">
                {i + 1}. {item.title}
              </span>
              <Chip color={item.state === "完成" ? "lime" : item.state === "进行中" ? "blue" : "neutral"}>
                {item.state}
              </Chip>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function WebSearchMock() {
  return (
    <div className="flex w-full justify-center py-2">
      <WebSearch />
    </div>
  );
}

function CalendarMock() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <Shell className="max-w-md mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-headline-medium text-text-primary">2026 年 8 月</p>
        </div>
        <SegmentedControl defaultSelectedKeys={["month"]} aria-label="视图">
          <SegmentedControlItem id="month">月</SegmentedControlItem>
          <SegmentedControlItem id="week">周</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div
            key={d}
            className={cx(
              "flex aspect-square items-center justify-center rounded-lg text-body-2-medium",
              d === 12
                ? "bg-accent-500 text-white"
                : "bg-background-primary-default text-text-secondary",
            )}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-separator-border bg-background-primary-default px-3 py-2">
        <p className="text-body-2-medium text-text-primary">设计评审 · 14:00</p>
        <p className="text-caption-1-medium text-text-tertiary">会议室 B</p>
      </div>
    </Shell>
  );
}

function QuestionnaireMock() {
  return (
    <div className="flex w-full justify-center bg-background-full p-4 sm:p-8">
      <div
        className={cx(
          "w-full max-w-md space-y-4 rounded-3xl border border-separator-border",
          "bg-background-primary-default p-5 shadow-xs sm:p-6",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-headline-medium text-text-primary">计划问卷</p>
          <span className="rounded-full bg-background-tertiary-default px-2.5 py-1 text-caption-1-medium text-text-tertiary">
            2 / 4
          </span>
        </div>
        <p className="text-body-1-medium text-text-primary">
          你更希望智能体默认如何处理工具调用？
        </p>
        <div className="space-y-2">
          {["询问后执行", "自动执行低风险工具", "始终询问", "其他…"].map(
            (opt, i) => (
              <button
                key={opt}
                type="button"
                className={cx(
                  "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-start text-body-1-medium transition-colors",
                  i === 1
                    ? "border-accent-400 bg-accent-50 text-text-primary"
                    : "border-separator-border bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover",
                )}
              >
                <span
                  className={cx(
                    "inline-flex size-6 items-center justify-center rounded-lg text-caption-1-semibold",
                    i === 1
                      ? "bg-accent-500 text-white"
                      : "border border-separator-border bg-background-primary-default text-text-tertiary",
                  )}
                >
                  {i + 1}
                </span>
                {opt}
              </button>
            ),
          )}
        </div>
        <div className="flex justify-between gap-2 pt-1">
          <Button variant="secondary" size="small">
            上一步
          </Button>
          <Button size="small">下一步</Button>
        </div>
      </div>
    </div>
  );
}

function TemplateMock({ title }: { title: string }) {
  return (
    <Shell>
      <div className="mb-4 flex items-center gap-2">
        <p className="text-headline-medium text-text-primary">{title}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[200px_1fr]">
        <div className="rounded-2xl border border-separator-border bg-background-primary-default p-3">
          <div className="mb-3 h-8 w-24 rounded-lg bg-background-tertiary-default" />
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={cx(
                  "h-8 rounded-lg",
                  i === 1
                    ? "bg-accent-100"
                    : "bg-background-tertiary-default/70",
                )}
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["收入", "订单", "活跃"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-separator-border bg-background-primary-default p-3"
              >
                <p className="text-caption-1-medium text-text-tertiary">
                  {label}
                </p>
                <p className="mt-1 text-title-3-semibold text-text-primary">
                  —
                </p>
              </div>
            ))}
          </div>
          <div className="h-36 rounded-2xl border border-separator-border bg-background-primary-default p-3">
            <div className="flex h-full items-end gap-1">
              {[40, 55, 48, 70, 62, 80, 74].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-accent-300/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AgentCreatorMock() {
  return (
    <Shell className="max-w-sm mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-headline-medium text-text-primary">智能体创建器</p>
      </div>
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-linear-to-br from-accent-200 to-accent-400 text-title-1-medium text-white shadow-md">
        J
      </div>
      <div className="space-y-2">
        <div className="rounded-xl border border-separator-border bg-background-primary-default px-3 py-2">
          <p className="text-caption-1-medium text-text-tertiary">名称</p>
          <p className="text-body-1-medium text-text-primary">Joy Agent</p>
        </div>
        <div className="rounded-xl border border-separator-border bg-background-primary-default px-3 py-2">
          <p className="text-caption-1-medium text-text-tertiary">语气</p>
          <p className="text-body-1-medium text-text-primary">简洁 · 专业</p>
        </div>
      </div>
      <Button className="w-full">保存智能体</Button>
    </Shell>
  );
}

function FallbackMock({ name }: { name: string }) {
  return (
    <Shell className="max-w-lg mx-auto">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-title-3-semibold text-text-primary">{name}</p>
      </div>
      <p className="mb-4 max-w-md text-body-1-regular text-text-secondary">
        JoyUI 高保真组合预览。用 CLI 安装源码后即可在项目中微调。
      </p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-separator-border bg-background-primary-default"
          />
        ))}
      </div>
    </Shell>
  );
}

export function JoyProPreview({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  if (slug === "composer") {
    return <ComposerMock />;
  }
  if (slug === "composer-panel") {
    return (
      <div className="flex w-full justify-center px-2 py-10 sm:py-14">
        <ComposerPanel defaultMenuOpen />
      </div>
    );
  }
  if (slug === "composer-attachments") {
    return <ComposerMock withAttachments />;
  }
  if (slug === "agent-progress") return <AgentProgressMock />;
  if (slug === "agent-limits-card") return <AgentLimitsMock />;
  if (slug === "agent-creator") return <AgentCreatorMock />;
  if (slug === "task-list") return <TaskListMock />;
  if (slug === "web-search") return <WebSearchMock />;
  if (slug === "calendar") return <CalendarMock />;
  if (slug === "questionnaire") return <QuestionnaireMock />;
  const ChartPreview = CHART_PREVIEWS[slug];
  if (ChartPreview) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto">
        <ChartPreview />
      </div>
    );
  }
  if (slug.endsWith("-card") || slug.includes("chart") || slug.includes("rings")) {
    return <FallbackMock name={name} />;
  }
  if (
    slug.includes("dashboard") ||
    slug.includes("chat") ||
    slug.includes("board") ||
    slug.includes("profile") ||
    slug.includes("generation") ||
    slug.includes("management")
  ) {
    return <TemplateMock title={name} />;
  }
  return <FallbackMock name={name} />;
}

export function getProDocCode(slug: string, name: string) {
  return `import { ${toExport(slug)} } from "@joyui/react";

export function Example() {
  return <${toExport(slug)} />;
}

// 安装
// npx joyui add ${slug} --yes
// ${name}
`;
}

function toExport(slug: string) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
