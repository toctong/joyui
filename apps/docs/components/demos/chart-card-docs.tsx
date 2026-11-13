"use client";

import type { ReactNode } from "react";
import { ActivityRingsCard } from "@/components/application/dashboard/activity-rings-card";
import { AreaChartCard } from "@/components/application/dashboard/area-chart-card";
import { BarListCard } from "@/components/application/dashboard/bar-list-card";
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
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { cx } from "@/utils/cx";

function DashboardShell({
  title,
  hint,
  className,
  children,
}: {
  title: string;
  hint: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div>
        <p className="text-body-medium text-text-primary">{title}</p>
        <p className="text-caption-1-medium text-text-tertiary">{hint}</p>
      </div>
      {children}
    </div>
  );
}

export function AreaChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="收入构成" hint="周 / 月 / 年切换内置在卡片上。" className={className}>
      <AreaChartCard />
    </DashboardShell>
  );
}

export function AreaChartWithStats({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-4xl gap-4", className)}>
      <StatCards variant="plain" columns={2} count={2} />
      <AreaChartCard />
    </div>
  );
}

export function RevenueChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="年度收入" hint="可用 `title` / `data` 替换演示。" className={className}>
      <RevenueChartCard title="全年收入" />
    </DashboardShell>
  );
}

export function RevenueOrdersPair({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-5xl gap-4 lg:grid-cols-2", className)}>
      <RevenueChartCard title="收入" />
      <OrdersChartCard />
    </div>
  );
}

export function LineChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="趋势" hint="折线卡嵌入 KPI 区。" className={className}>
      <LineChartCard />
    </DashboardShell>
  );
}

export function OrdersChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="订单" hint="与收入卡同构，便于并排。" className={className}>
      <OrdersChartCard />
    </DashboardShell>
  );
}

export function EarningsChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="收益" hint="财务看板模块。" className={className}>
      <EarningsChartCard />
    </DashboardShell>
  );
}

export function FunnelChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="转化漏斗" hint="替换各阶段业务数据。" className={className}>
      <FunnelChartCard />
    </DashboardShell>
  );
}

export function HeatmapChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="活跃热力" hint="适合运营周报。" className={className}>
      <HeatmapChartCard />
    </DashboardShell>
  );
}

export function RadarChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="多维评分" hint="雷达图卡片。" className={className}>
      <RadarChartCard />
    </DashboardShell>
  );
}

export function RadialChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="完成度" hint="径向进度。" className={className}>
      <RadialChartCard />
    </DashboardShell>
  );
}

export function ScatterChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="分布" hint="散点关系。" className={className}>
      <ScatterChartCard />
    </DashboardShell>
  );
}

export function SankeyChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="流向" hint="桑基流量。" className={className}>
      <SankeyChartCard />
    </DashboardShell>
  );
}

export function ComboChartEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="组合图" hint="柱线叠加。" className={className}>
      <ComboChartCard />
    </DashboardShell>
  );
}

export function ActivityRingsEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="活动圆环" hint="健康看板。" className={className}>
      <ActivityRingsCard />
    </DashboardShell>
  );
}

export function BarListEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="排行" hint="条形列表。" className={className}>
      <BarListCard />
    </DashboardShell>
  );
}

export function ContributionsEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="贡献日历" hint="GitHub 风格贡献热力。" className={className}>
      <ContributionsCard />
    </DashboardShell>
  );
}

export function MostActiveDaysEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="最活跃日" hint="周内活跃分布。" className={className}>
      <MostActiveDaysCard />
    </DashboardShell>
  );
}

export function SleepScoreEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="睡眠评分" hint="健康 KPI。" className={className}>
      <SleepScoreCard />
    </DashboardShell>
  );
}

export function StageBarsEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="阶段条" hint="漏斗阶段占比。" className={className}>
      <StageBarsCard />
    </DashboardShell>
  );
}

export function StepsCardEmbed({ className }: { className?: string }) {
  return (
    <DashboardShell title="步数" hint="可与睡眠卡并排。" className={className}>
      <StepsCard />
    </DashboardShell>
  );
}

export function HealthPair({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-4xl gap-4 md:grid-cols-2", className)}>
      <StepsCard />
      <SleepScoreCard />
    </div>
  );
}
