"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/base/badges/chip";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Earnings Chart Card: “至今已赚到” with custom CSS track bars.
 * Each month is a full-height gray track and a lime fill rising from the bottom.
 */

type Period = "weekly" | "monthly" | "yearly";

export type EarningsPoint = {
  label: string;
  value: number;
};

const PERIOD_META: Record<Period, { total: number; delta: number }> = {
  weekly: { total: 1680, delta: 8.2 },
  monthly: { total: 7462, delta: 14.8 },
  yearly: { total: 89440, delta: 11.3 },
};

const PERIOD_DATA: Record<Period, EarningsPoint[]> = {
  weekly: [
    { label: "1月", value: 90 },
    { label: "2月", value: 110 },
    { label: "3月", value: 100 },
    { label: "4月", value: 130 },
    { label: "5月", value: 145 },
    { label: "6月", value: 140 },
    { label: "7月", value: 160 },
    { label: "8月", value: 155 },
    { label: "9月", value: 170 },
    { label: "10月", value: 180 },
    { label: "11月", value: 165 },
    { label: "12月", value: 135 },
  ],
  monthly: [
    { label: "1月", value: 420 },
    { label: "2月", value: 480 },
    { label: "3月", value: 510 },
    { label: "4月", value: 560 },
    { label: "5月", value: 620 },
    { label: "6月", value: 590 },
    { label: "7月", value: 680 },
    { label: "8月", value: 650 },
    { label: "9月", value: 710 },
    { label: "10月", value: 760 },
    { label: "11月", value: 700 },
    { label: "12月", value: 782 },
  ],
  yearly: [
    { label: "1月", value: 5040 },
    { label: "2月", value: 5760 },
    { label: "3月", value: 6120 },
    { label: "4月", value: 6720 },
    { label: "5月", value: 7440 },
    { label: "6月", value: 7080 },
    { label: "7月", value: 8160 },
    { label: "8月", value: 7800 },
    { label: "9月", value: 8520 },
    { label: "10月", value: 9120 },
    { label: "11月", value: 8400 },
    { label: "12月", value: 9280 },
  ],
};

const Y_TICKS = [0, 0.25, 0.5, 0.75, 1];

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function formatDelta(delta: number) {
  const rounded = Math.round(delta * 10) / 10;
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    color: rounded > 0 ? ("lime" as const) : rounded < 0 ? ("rose" as const) : ("neutral" as const),
  };
}

export function EarningsChartCard({
  className,
  title = "至今已赚到",
}: {
  className?: string;
  /** Headline label when no month is hovered. */
  title?: string;
} = {}) {
  const [period, setPeriod] = useState<Period>("monthly");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = PERIOD_DATA[period];
  const meta = PERIOD_META[period];
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;

  const headlineValue = point ? point.value : meta.total;
  const label = point ? point.label : title;
  const delta = formatDelta(meta.delta);
  const display = useCountUp(Math.round(headlineValue));
  const yMax = useMemo(() => Math.max(...data.map((d) => d.value)) * 1.1, [data]);

  return (
    <section
      className={cx(
        "flex flex-col gap-4 rounded-2xl bg-background-secondary-default p-4",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="w-full text-body-medium text-text-secondary">{label}</p>
          <div className="flex w-full items-center gap-2">
            <p
              key={`${period}-${activeIndex ?? "total"}`}
              className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums"
            >
              ${formatMoney(display)}
            </p>
            <Chip variant="bold" color={delta.color}>
              {delta.label}
            </Chip>
          </div>
        </div>

        <SegmentedControl
          aria-label="周期"
          selectedKeys={[period]}
          onSelectionChange={(keys) => {
            const next = [...(keys as Set<string>)][0] as Period | undefined;
            if (next) {
              setPeriod(next);
              setActiveIndex(null);
            }
          }}
          className="shrink-0 self-start"
        >
          <SegmentedControlItem id="weekly">每周</SegmentedControlItem>
          <SegmentedControlItem id="monthly">每月</SegmentedControlItem>
          <SegmentedControlItem id="yearly">每年</SegmentedControlItem>
        </SegmentedControl>
      </div>

      <div className="flex h-[220px] w-full min-w-0 gap-2">
        {/* Optional Y-axis style labels */}
        <div className="flex w-8 shrink-0 flex-col justify-between pb-6 pt-1" aria-hidden>
          {[...Y_TICKS].reverse().map((tick) => (
            <span key={tick} className="text-caption-1-medium text-text-tertiary tabular-nums">
              {tick === 0
                ? "0"
                : yMax >= 1000
                  ? `${Math.round((yMax * tick) / 1000)}k`
                  : Math.round(yMax * tick)}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-stretch gap-1.5 sm:gap-2">
            {data.map((item, index) => {
              const heightPct = Math.max(4, (item.value / yMax) * 100);
              const active = activeIndex === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label={`${item.label} $${formatMoney(item.value)}`}
                  className="group relative flex min-w-0 flex-1 cursor-pointer flex-col justify-end outline-none"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                >
                  <div
                    className={cx(
                      "relative flex h-full w-full max-w-6 items-end justify-center self-center overflow-hidden rounded-full bg-chart-track transition-[box-shadow,opacity] duration-150",
                      active ? "ring-1 ring-chart-2-active shadow-xs" : "opacity-90 group-hover:opacity-100",
                    )}
                  >
                    <div
                      className={cx(
                        "w-full rounded-full transition-[height,background-color] duration-300 ease-out",
                        active ? "bg-chart-2-active" : "bg-chart-2",
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex gap-1.5 sm:gap-2" aria-hidden>
            {data.map((item) => (
              <span
                key={item.label}
                className="min-w-0 flex-1 text-center text-caption-1-medium text-text-tertiary"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
