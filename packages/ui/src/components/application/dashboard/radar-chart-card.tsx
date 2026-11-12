"use client";

import { useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Chip } from "../../base/badges/chip";
import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Radar Chart Card: a filled lime polygon over six monthly axes. Hovering an
 * axis swaps the headline for that month; tiles under the chart echo each
 * month's value.
 */

export type RadarPoint = {
  label: string;
  value: number;
};

/** H1 months that sum to the headline visitor total. */
export const RADAR_DATA: RadarPoint[] = [
  { label: "1月", value: 220 },
  { label: "2月", value: 180 },
  { label: "3月", value: 305 },
  { label: "4月", value: 237 },
  { label: "5月", value: 273 },
  { label: "6月", value: 209 },
];

export function RadarChartCard({
  data = RADAR_DATA,
  title = "访客",
  delta = "+5.2%",
  period = "H1 2024",
  className,
}: {
  data?: RadarPoint[];
  title?: string;
  delta?: string;
  period?: string;
  className?: string;
} = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, point) => sum + point.value, 0);
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;
  const headline = point?.value ?? total;
  const label = point?.label ?? title;
  const display = useCountUp(headline);
  const domainMax = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <section
      className={cx(
        "flex min-h-[380px] min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="w-full text-body-medium text-text-secondary">{label}</p>
          <div className="flex w-full items-center gap-2">
            <p
              key={activeIndex ?? "total"}
              className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums"
            >
              {display.toLocaleString("en-US")}
            </p>
            <Chip variant="bold" color="lime">
              {delta}
            </Chip>
          </div>
        </div>
        <Chip variant="bold" color="soft" className="shrink-0">
          {period}
        </Chip>
      </div>

      <div className="h-[200px] w-full shrink-0">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="72%"
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <PolarGrid stroke="var(--color-border-secondary)" strokeOpacity={0.9} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <PolarRadiusAxis
              domain={[0, domainMax]}
              tick={false}
              axisLine={false}
            />
            <Tooltip content={() => null} />
            <Radar
              dataKey="value"
              stroke="var(--color-chart-2-active)"
              fill="var(--color-chart-2)"
              fillOpacity={0.45}
              strokeWidth={2}
              isAnimationActive
              animationDuration={450}
              dot={{
                r: 3,
                fill: "var(--color-chart-2-active)",
                stroke: "var(--color-background-secondary-default)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--color-chart-2-active)",
                stroke: "var(--color-background-secondary-default)",
                strokeWidth: 2,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {data.map((item, i) => (
          <button
            key={item.label}
            type="button"
            className={cx(
              "flex min-w-0 flex-col gap-0.5 rounded-2lg bg-background-inner-default px-2.5 py-2 text-start shadow-card outline-none transition-opacity duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              activeIndex !== null && activeIndex !== i && "opacity-40",
            )}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="truncate text-caption-1-medium text-text-tertiary">{item.label}</span>
            <span className="text-body-medium text-text-primary tabular-nums">
              {item.value.toLocaleString("en-US")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
