"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Chip } from "@/components/base/badges/chip";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Area Chart Card: stacked Product / Services / Other revenue with soft gradients.
 * Hover swaps the headline to that month’s stack total; footer tiles hold series sums.
 */

type Period = "weekly" | "monthly" | "yearly";

export type AreaChartPoint = {
  label: string;
  product: number;
  services: number;
  other: number;
};

const SERIES = [
  { key: "product" as const, label: "Product", color: "var(--color-chart-2)", active: "var(--color-chart-2-active)", swatch: "bg-chart-2-active" },
  { key: "services" as const, label: "Services", color: "var(--color-chart-6)", active: "var(--color-chart-6-active)", swatch: "bg-chart-6-active" },
  { key: "other" as const, label: "Other", color: "var(--color-chart-5)", active: "var(--color-chart-5-active)", swatch: "bg-chart-5-active" },
];

const PERIOD_META: Record<Period, { total: number; delta: number }> = {
  weekly: { total: 28640, delta: 7.6 },
  monthly: { total: 128450, delta: 14.8 },
  yearly: { total: 1541400, delta: 18.2 },
};

function scaleYear(factor: number): AreaChartPoint[] {
  const base: AreaChartPoint[] = [
    { label: "1月", product: 6200, services: 3100, other: 1400 },
    { label: "2月", product: 6800, services: 3400, other: 1500 },
    { label: "3月", product: 7100, services: 3600, other: 1600 },
    { label: "4月", product: 7400, services: 3800, other: 1700 },
    { label: "5月", product: 7900, services: 4100, other: 1800 },
    { label: "6月", product: 8200, services: 4300, other: 1900 },
    { label: "7月", product: 8600, services: 4500, other: 2000 },
    { label: "8月", product: 8400, services: 4400, other: 1950 },
    { label: "9月", product: 8800, services: 4700, other: 2100 },
    { label: "10月", product: 9200, services: 4900, other: 2200 },
    { label: "11月", product: 8700, services: 4600, other: 2050 },
    { label: "12月", product: 9100, services: 4800, other: 2150 },
  ];
  return base.map((row) => ({
    label: row.label,
    product: Math.round(row.product * factor),
    services: Math.round(row.services * factor),
    other: Math.round(row.other * factor),
  }));
}

/** Base year totals ~169,950; scale so monthly headline lands on $128,450. */
const MONTHLY_FACTOR = 128450 / 169950;

const PERIOD_DATA: Record<Period, AreaChartPoint[]> = {
  weekly: scaleYear(MONTHLY_FACTOR * 0.22),
  monthly: scaleYear(MONTHLY_FACTOR),
  yearly: scaleYear(MONTHLY_FACTOR * 12),
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatK = (value: number) =>
  value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;

function formatDelta(delta: number) {
  const rounded = Math.round(delta * 10) / 10;
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    color: rounded > 0 ? ("lime" as const) : rounded < 0 ? ("rose" as const) : ("neutral" as const),
  };
}

function rowTotal(point: AreaChartPoint) {
  return point.product + point.services + point.other;
}

export function AreaChartCard({
  className,
  title = "Revenue",
}: {
  className?: string;
  /** Headline label when no month is hovered. */
  title?: string;
} = {}) {
  const [period, setPeriod] = useState<Period>("monthly");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();

  const data = PERIOD_DATA[period];
  const meta = PERIOD_META[period];
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;

  const headlineValue = point ? rowTotal(point) : meta.total;
  const label = point ? point.label : title;
  const delta = formatDelta(meta.delta);
  const display = useCountUp(Math.round(headlineValue));

  const seriesTotals = useMemo(() => {
    return SERIES.map((series) => ({
      ...series,
      total: data.reduce((sum, row) => sum + row[series.key], 0),
    }));
  }, [data]);

  const yMax = useMemo(() => Math.max(...data.map(rowTotal)), [data]);

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

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 6, bottom: 0, left: 0 }}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              {SERIES.map((series) => (
                <linearGradient
                  key={series.key}
                  id={`${gradientId}-${series.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={series.color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={series.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <YAxis
              width={44}
              domain={[0, yMax * 1.1]}
              tickCount={4}
              tickFormatter={formatK}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval="preserveStartEnd"
              tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }}
            />
            <Tooltip
              content={() => null}
              cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            {SERIES.map((series) => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stackId="revenue"
                stroke={series.active}
                strokeWidth={1.5}
                fill={`url(#${gradientId}-${series.key})`}
                isAnimationActive
                animationDuration={450}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {seriesTotals.map((series) => (
          <div
            key={series.key}
            className="flex flex-col gap-0.5 rounded-xl bg-background-tertiary-default px-3 py-2.5"
          >
            <div className="flex items-center gap-1.5 text-body-2-medium text-text-secondary">
              <span className={cx("size-2 rounded-full", series.swatch)} aria-hidden />
              <span>{series.label}</span>
            </div>
            <p className="text-title-2-medium text-text-primary tabular-nums">
              ${formatMoney(series.total)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
