"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Chip } from "../../base/badges/chip";
import { Button } from "../../base/buttons/button";
import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Combo Chart Card: sessions bars (lime) and conversion line (blue) on dual axes.
 * Hover darkens the active bar, pulses the line dot, and swaps the headline.
 */

export type ComboChartPoint = {
  label: string;
  sessions: number;
  conversion: number;
};

/** Twelve months that total 83,200 sessions at a 3.7% average conversion. */
export const COMBO_DATA: ComboChartPoint[] = [
  { label: "1月", sessions: 5800, conversion: 2.8 },
  { label: "2月", sessions: 6200, conversion: 3.0 },
  { label: "3月", sessions: 6500, conversion: 3.2 },
  { label: "4月", sessions: 6700, conversion: 3.1 },
  { label: "5月", sessions: 7000, conversion: 3.4 },
  { label: "6月", sessions: 7200, conversion: 3.6 },
  { label: "7月", sessions: 7600, conversion: 3.9 },
  { label: "8月", sessions: 7400, conversion: 3.7 },
  { label: "9月", sessions: 7800, conversion: 4.0 },
  { label: "10月", sessions: 7500, conversion: 4.1 },
  { label: "11月", sessions: 7100, conversion: 3.8 },
  { label: "12月", sessions: 6400, conversion: 3.5 },
];

const CONVERSION_AVG = 3.7;

const formatCount = (value: number) => value.toLocaleString("en-US");
const formatK = (value: number) =>
  value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`;
const formatPct = (value: number) => `${value}%`;

function ActiveDot({ cx: x, cy: y }: { cx?: number; cy?: number }) {
  if (x === undefined || y === undefined) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="var(--color-chart-6-active)" opacity={0.22}>
        <animate attributeName="r" values="7;12;7" dur="1.25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.32;0.08;0.32" dur="1.25s" repeatCount="indefinite" />
      </circle>
      <circle
        cx={x}
        cy={y}
        r={4}
        fill="var(--color-chart-6-active)"
        stroke="var(--color-background-secondary-default)"
        strokeWidth={2}
      />
    </g>
  );
}

export function ComboChartCard({
  data = COMBO_DATA,
  className,
  delta = 9.4,
  conversionRate = CONVERSION_AVG,
}: {
  data?: ComboChartPoint[];
  className?: string;
  /** Headline delta percentage. */
  delta?: number;
  /** Shown in the title and conversion tile. */
  conversionRate?: number;
} = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sessionsTotal = useMemo(
    () => data.reduce((sum, point) => sum + point.sessions, 0),
    [data],
  );
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;

  const headlineValue = point ? point.sessions : sessionsTotal;
  const title = point
    ? `${point.label} · Conversion ${formatPct(point.conversion)}`
    : `Sessions · Conversion ${formatPct(conversionRate)}`;
  const deltaLabel = `${delta > 0 ? "+" : ""}${delta}%`;
  const display = useCountUp(Math.round(headlineValue));

  const sessionsMax = Math.max(...data.map((d) => d.sessions));
  const conversionMax = Math.max(...data.map((d) => d.conversion));

  return (
    <section
      className={cx(
        "flex flex-col gap-4 rounded-2xl bg-background-secondary-default p-4",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="w-full text-body-medium text-text-secondary">{title}</p>
          <div className="flex w-full items-center gap-2">
            <p
              key={activeIndex ?? "total"}
              className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums"
            >
              {formatCount(display)}
            </p>
            <Chip variant="bold" color={delta > 0 ? "lime" : delta < 0 ? "rose" : "neutral"}>
              {deltaLabel}
            </Chip>
          </div>
        </div>

        <Button variant="secondary" size="xs" className="shrink-0 self-start" type="button">
          今年
        </Button>
      </div>

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="28%"
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <YAxis
              yAxisId="sessions"
              width={40}
              domain={[0, sessionsMax * 1.15]}
              tickCount={4}
              tickFormatter={formatK}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              yAxisId="conversion"
              orientation="right"
              width={36}
              domain={[0, conversionMax * 1.25]}
              tickCount={4}
              tickFormatter={formatPct}
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
            <Tooltip content={() => null} cursor={{ fill: "var(--color-chart-track)", opacity: 0.45 }} />
            <Bar
              yAxisId="sessions"
              dataKey="sessions"
              radius={[6, 6, 6, 6]}
              isAnimationActive
              animationDuration={450}
            >
              {data.map((entry, index) => {
                const dimmed = activeIndex !== null && activeIndex !== index;
                const active = activeIndex === index;
                return (
                  <Cell
                    key={entry.label}
                    fill={active ? "var(--color-chart-2-active)" : "var(--color-chart-2)"}
                    fillOpacity={dimmed ? 0.35 : 1}
                  />
                );
              })}
            </Bar>
            <Line
              yAxisId="conversion"
              type="monotone"
              dataKey="conversion"
              stroke="var(--color-chart-6-active)"
              strokeWidth={2.5}
              dot={false}
              activeDot={<ActiveDot />}
              isAnimationActive
              animationDuration={450}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-0.5 rounded-xl bg-background-tertiary-default px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-body-2-medium text-text-secondary">
            <span className="size-2 rounded-full bg-chart-2-active" aria-hidden />
            <span>Sessions 总计</span>
          </div>
          <p className="text-title-2-medium text-text-primary tabular-nums">
            {formatCount(sessionsTotal)}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 rounded-xl bg-background-tertiary-default px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-body-2-medium text-text-secondary">
            <span className="size-2 rounded-full bg-chart-6-active" aria-hidden />
            <span>Conversion average</span>
          </div>
          <p className="text-title-2-medium text-text-primary tabular-nums">
            {formatPct(conversionRate)}
          </p>
        </div>
      </div>
    </section>
  );
}
