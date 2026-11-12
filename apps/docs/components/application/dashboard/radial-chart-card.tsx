"use client";

import { useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Chip } from "@/components/base/badges/chip";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Radial Chart Card: concentric rings for browser / channel share. Hovering
 * a ring or legend tile focuses that series and swaps the headline.
 */

export type RadialItem = {
  label: string;
  value: number;
  /** Recharts fill color. */
  fill: string;
  /** Tailwind bg utility for the legend swatch. */
  swatchClass: string;
};

/** Demo rings that sum to the headline visitor total. */
export const RADIAL_DATA: RadialItem[] = [
  {
    label: "其他",
    value: 90,
    fill: "var(--color-chart-8-active)",
    swatchClass: "bg-chart-8-active",
  },
  {
    label: "边缘",
    value: 173,
    fill: "var(--color-chart-3-active)",
    swatchClass: "bg-chart-3-active",
  },
  {
    label: "火狐浏览器",
    value: 187,
    fill: "var(--color-chart-6-active)",
    swatchClass: "bg-chart-6-active",
  },
  {
    label: "狩猎之旅",
    value: 200,
    fill: "var(--color-chart-5-active)",
    swatchClass: "bg-chart-5-active",
  },
  {
    label: "镀铬",
    value: 275,
    fill: "var(--color-chart-2-active)",
    swatchClass: "bg-chart-2-active",
  },
];

export function RadialChartCard({
  data = RADIAL_DATA,
  title = "访客",
  delta = "+5.2%",
  period = "过去 7 天",
  className,
}: {
  data?: RadialItem[];
  title?: string;
  delta?: string;
  period?: string;
  className?: string;
} = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...data.map((item) => item.value));
  const hovering = activeIndex !== null && activeIndex < data.length;
  const item = hovering ? data[activeIndex] : null;
  const headline = item?.value ?? total;
  const label = item?.label ?? title;
  const display = useCountUp(headline);

  // Innermost → outermost so larger rings sit outside.
  const chartData = [...data]
    .map((entry, index) => ({
      ...entry,
      // Normalize to the strongest ring so arcs remain readable.
      score: Math.round((entry.value / max) * 100),
      _index: index,
    }))
    .reverse();

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
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="18%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
            barSize={12}
            onMouseMove={(state) => {
              const payload = (
                state as {
                  activePayload?: Array<{ payload?: { _index?: number } }>;
                }
              )?.activePayload?.[0]?.payload;
              if (payload && typeof payload._index === "number") {
                setActiveIndex(payload._index);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <Tooltip content={() => null} />
            <RadialBar
              dataKey="score"
              background={{ fill: "var(--color-chart-track)" }}
              cornerRadius={6}
              isAnimationActive
              animationDuration={450}
              // Dim non-hovered rings via fill opacity on each cell.
              shape={(props: {
                cx?: number;
                cy?: number;
                innerRadius?: number;
                outerRadius?: number;
                startAngle?: number;
                endAngle?: number;
                fill?: string;
                payload?: { _index?: number };
              }) => {
                const idx = props.payload?._index;
                const dimmed = activeIndex !== null && idx !== activeIndex;
                const {
                  cx = 0,
                  cy = 0,
                  innerRadius = 0,
                  outerRadius = 0,
                  startAngle = 0,
                  endAngle = 0,
                  fill = "currentColor",
                } = props;
                const start = ((startAngle - 90) * Math.PI) / 180;
                const end = ((endAngle - 90) * Math.PI) / 180;
                const x1 = cx + outerRadius * Math.cos(start);
                const y1 = cy + outerRadius * Math.sin(start);
                const x2 = cx + outerRadius * Math.cos(end);
                const y2 = cy + outerRadius * Math.sin(end);
                const x3 = cx + innerRadius * Math.cos(end);
                const y3 = cy + innerRadius * Math.sin(end);
                const x4 = cx + innerRadius * Math.cos(start);
                const y4 = cy + innerRadius * Math.sin(start);
                const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
                const d = [
                  `M ${x1} ${y1}`,
                  `A ${outerRadius} ${outerRadius} 0 ${large} 0 ${x2} ${y2}`,
                  `L ${x3} ${y3}`,
                  `A ${innerRadius} ${innerRadius} 0 ${large} 1 ${x4} ${y4}`,
                  "Z",
                ].join(" ");
                return (
                  <path
                    d={d}
                    fill={fill}
                    opacity={dimmed ? 0.28 : 1}
                    className="transition-opacity duration-150 ease"
                  />
                );
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {data.map((entry, i) => (
          <button
            key={entry.label}
            type="button"
            className={cx(
              "flex min-w-0 items-center justify-between gap-2 rounded-2lg bg-background-inner-default px-2.5 py-2 shadow-card outline-none transition-opacity duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              activeIndex !== null && activeIndex !== i && "opacity-40",
              // Last odd tile stretches full width on the final row.
              data.length % 3 === 2 && i === data.length - 1 && "sm:col-span-3",
              data.length % 2 === 1 && i === data.length - 1 && "col-span-2 sm:col-span-1",
              data.length % 3 === 2 && i === data.length - 1 && "sm:col-span-3",
            )}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className={cx("size-2 shrink-0 rounded-full", entry.swatchClass)} aria-hidden />
              <span className="truncate text-caption-1-medium text-text-tertiary">{entry.label}</span>
            </span>
            <span className="shrink-0 text-body-medium text-text-primary tabular-nums">
              {entry.value.toLocaleString("en-US")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
