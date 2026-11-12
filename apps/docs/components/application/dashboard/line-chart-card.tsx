"use client";

import { useId, useMemo, useState } from "react";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Chip } from "@/components/base/badges/chip";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Line Chart Card: a lime area + monotone line with a period switcher.
 * Hovering a month swaps the count-up headline; the active point pulses.
 */

type Period = "weekly" | "monthly" | "yearly";

export type LineChartPoint = {
  label: string;
  value: number;
};

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const PERIOD_META: Record<Period, { total: number; delta: number }> = {
  weekly: { total: 4120, delta: 6.2 },
  monthly: { total: 18240, delta: 9.4 },
  yearly: { total: 214880, delta: 12.1 },
};

const PERIOD_DATA: Record<Period, LineChartPoint[]> = {
  weekly: [
    { label: "1月", value: 280 },
    { label: "2月", value: 310 },
    { label: "3月", value: 295 },
    { label: "4月", value: 340 },
    { label: "5月", value: 360 },
    { label: "6月", value: 355 },
    { label: "7月", value: 390 },
    { label: "8月", value: 375 },
    { label: "9月", value: 410 },
    { label: "10月", value: 430 },
    { label: "11月", value: 405 },
    { label: "12月", value: 370 },
  ],
  monthly: [
    { label: "1月", value: 1240 },
    { label: "2月", value: 1380 },
    { label: "3月", value: 1320 },
    { label: "4月", value: 1490 },
    { label: "5月", value: 1580 },
    { label: "6月", value: 1510 },
    { label: "7月", value: 1720 },
    { label: "8月", value: 1650 },
    { label: "9月", value: 1780 },
    { label: "10月", value: 1860 },
    { label: "11月", value: 1740 },
    { label: "12月", value: 1970 },
  ],
  yearly: [
    { label: "1月", value: 14880 },
    { label: "2月", value: 15620 },
    { label: "3月", value: 16240 },
    { label: "4月", value: 17100 },
    { label: "5月", value: 17840 },
    { label: "6月", value: 18220 },
    { label: "7月", value: 19160 },
    { label: "8月", value: 18640 },
    { label: "9月", value: 19480 },
    { label: "10月", value: 20120 },
    { label: "11月", value: 18840 },
    { label: "12月", value: 18740 },
  ],
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatK = (value: number) => {
  if (value >= 1000) {
    const k = value / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `$${Math.round(value)}`;
};

function formatDelta(delta: number) {
  const rounded = Math.round(delta * 10) / 10;
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    color: rounded > 0 ? ("lime" as const) : rounded < 0 ? ("rose" as const) : ("neutral" as const),
  };
}

/** Pulsing marker on the active line point. */
function ActiveDot({ cx: x, cy: y }: { cx?: number; cy?: number }) {
  if (x === undefined || y === undefined) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="var(--color-chart-2-active)" opacity={0.22}>
        <animate attributeName="r" values="7;12;7" dur="1.25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.32;0.08;0.32" dur="1.25s" repeatCount="indefinite" />
      </circle>
      <circle
        cx={x}
        cy={y}
        r={4}
        fill="var(--color-chart-2-active)"
        stroke="var(--color-background-secondary-default)"
        strokeWidth={2}
      />
    </g>
  );
}

export function LineChartCard({
  className,
  title = "收入",
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

  const headlineValue = point ? point.value : meta.total;
  const label = point ? point.label : title;
  const delta = formatDelta(meta.delta);
  const display = useCountUp(Math.round(headlineValue));
  const yMax = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

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
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 6, bottom: 0, left: 0 }}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis
              width={44}
              domain={[0, yMax * 1.15]}
              tickCount={4}
              tickFormatter={formatK}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis
              dataKey="label"
              ticks={MONTHS}
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#${gradientId})`}
              isAnimationActive
              animationDuration={450}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-chart-2-active)"
              strokeWidth={2.5}
              dot={false}
              activeDot={<ActiveDot />}
              isAnimationActive
              animationDuration={450}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
