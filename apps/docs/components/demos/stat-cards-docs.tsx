"use client";

import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { cx } from "@/utils/cx";

const CUSTOM: Stat[] = [
  { label: "任务", value: "128", delta: "+8.2%", deltaColor: "lime" },
  { label: "已保存", value: "42", delta: "+12%", deltaColor: "lime" },
  { label: "失败", value: "3", delta: "-1", deltaColor: "rose" },
  { label: "队列", value: "19", delta: "0", deltaColor: "neutral" },
];

export function StatCardsPlainPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-4xl", className)}>
      <StatCards variant="plain" columns={2} stats={CUSTOM} />
    </div>
  );
}

export function StatCardsFooterPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-4xl", className)}>
      <StatCards variant="footer" columns={2} count={2} />
    </div>
  );
}

export function StatCardsDashboardScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div>
        <p className="text-body-medium text-text-primary">本周概览</p>
        <p className="text-caption-1-medium text-text-tertiary">传入业务 `stats` 即可替换演示数据。</p>
      </div>
      <StatCards variant="plain" columns={2} stats={CUSTOM} />
    </div>
  );
}
