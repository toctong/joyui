"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/base/badges/chip";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

type Range = "weekly" | "monthly" | "yearly";

const STATS = [
  { value: "9B", label: "累计 Token" },
  { value: "562.7M", label: "峰值 Token" },
  { value: "12h 54m", label: "最长任务时长" },
  { value: "62 days", label: "最长连续活跃天数" },
] as const;

function buildHeatmap(seed: number) {
  // 53 weeks × 7 days — GitHub-style contribution grid
  return Array.from({ length: 53 * 7 }, (_, i) => {
    const n = ((i * 17 + seed * 13) % 97) / 97;
    if (n < 0.42) return 0;
    if (n < 0.62) return 1;
    if (n < 0.78) return 2;
    if (n < 0.9) return 3;
    return 4;
  });
}

const LEVEL_CLASS = [
  "bg-background-tertiary-default",
  "bg-purple-200",
  "bg-purple-300",
  "bg-purple-400",
  "bg-purple-500",
] as const;

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

/**
 * Contributions Card — year contribution count, KPI tiles, and a purple
 * GitHub-style activity heatmap with a period switcher.
 */
export function ContributionsCard({ className }: { className?: string }) {
  const [range, setRange] = useState<Range>("weekly");
  const cells = useMemo(
    () => buildHeatmap(range === "weekly" ? 1 : range === "monthly" ? 2 : 3),
    [range],
  );
  const total = useCountUp(958);

  return (
    <section
      className={cx(
        "flex w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body-medium text-text-secondary">今年的贡献</p>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-title-1-medium text-text-primary tabular-nums">
              {total.toLocaleString("en-US")}
            </p>
            <Chip variant="bold" color="lime">
              +14.8%
            </Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-background-primary-default px-3 py-2.5"
          >
            <p className="text-title-3-semibold text-text-primary tabular-nums">
              {stat.value}
            </p>
            <p className="mt-0.5 text-caption-1-medium text-text-tertiary">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-medium text-text-secondary">活动</p>
          <SegmentedControl
            selectedKeys={[range]}
            onSelectionChange={(keys) => {
              const next = [...keys][0];
              if (next) setRange(String(next) as Range);
            }}
            aria-label="活动范围"
            className="shrink-0"
          >
            <SegmentedControlItem id="weekly">每周</SegmentedControlItem>
            <SegmentedControlItem id="monthly">每月</SegmentedControlItem>
            <SegmentedControlItem id="yearly">每年</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex min-w-full flex-col gap-1.5">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(53, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(7, 10px)`,
                gridAutoFlow: "column",
              }}
            >
              {cells.map((level, i) => (
                <span
                  key={i}
                  className={cx("size-2.5 rounded-[3px]", LEVEL_CLASS[level])}
                  title={`贡献等级 ${level}`}
                />
              ))}
            </div>
            <div className="flex justify-between px-0.5 text-caption-1-medium text-text-tertiary">
              {MONTHS.filter((_, i) => i % 1 === 0).map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
