"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { Chip } from "@/components/base/badges/chip";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Scatter Chart Card: revenue vs meetings as three bubble series. Hovering a
 * point isolates its series and swaps the headline; footer tiles show each
 * plan's average revenue.
 */

export type ScatterPoint = {
  x: number;
  y: number;
  z: number;
  label?: string;
};

export type ScatterSeries = {
  label: string;
  color: string;
  swatchClass: string;
  points: ScatterPoint[];
};

export const SCATTER_SERIES: ScatterSeries[] = [
  {
    label: "Starter",
    color: "var(--color-chart-2-active)",
    swatchClass: "bg-chart-2-active",
    points: [
      { x: 120, y: 4, z: 80, label: "Acme Starter" },
      { x: 180, y: 6, z: 110, label: "Northwind Starter" },
      { x: 240, y: 8, z: 95, label: "Contoso Starter" },
      { x: 310, y: 5, z: 140, label: "Fabrikam Starter" },
      { x: 360, y: 9, z: 120, label: "Adventure Starter" },
      { x: 420, y: 7, z: 160, label: "Tailspin Starter" },
    ],
  },
  {
    label: "Growth",
    color: "var(--color-chart-6-active)",
    swatchClass: "bg-chart-6-active",
    points: [
      { x: 520, y: 12, z: 180, label: "Acme Growth" },
      { x: 610, y: 15, z: 210, label: "Northwind Growth" },
      { x: 700, y: 11, z: 190, label: "Contoso Growth" },
      { x: 780, y: 18, z: 240, label: "Fabrikam Growth" },
      { x: 860, y: 14, z: 220, label: "Adventure Growth" },
      { x: 940, y: 20, z: 260, label: "Tailspin Growth" },
    ],
  },
  {
    label: "Scale",
    color: "var(--color-chart-5-active)",
    swatchClass: "bg-chart-5-active",
    points: [
      { x: 1100, y: 22, z: 280, label: "Acme Scale" },
      { x: 1240, y: 28, z: 320, label: "Northwind Scale" },
      { x: 1380, y: 24, z: 300, label: "Contoso Scale" },
      { x: 1520, y: 32, z: 360, label: "Fabrikam Scale" },
      { x: 1680, y: 27, z: 340, label: "Adventure Scale" },
      { x: 1840, y: 35, z: 400, label: "Tailspin Scale" },
    ],
  },
];

function averageX(points: ScatterPoint[]) {
  if (points.length === 0) return 0;
  return Math.round(points.reduce((sum, p) => sum + p.x, 0) / points.length);
}

export function ScatterChartCard({
  series = SCATTER_SERIES,
  title = "Revenue per account",
  headline = 742,
  delta = "+6.8%",
  period = "本季度",
  className,
}: {
  series?: ScatterSeries[];
  title?: string;
  headline?: number;
  delta?: string;
  period?: string;
  className?: string;
} = {}) {
  const [active, setActive] = useState<{
    seriesIndex: number;
    pointIndex: number;
  } | null>(null);

  const averages = useMemo(
    () => series.map((s) => ({ label: s.label, value: averageX(s.points), swatchClass: s.swatchClass })),
    [series],
  );

  const activePoint =
    active && series[active.seriesIndex]
      ? series[active.seriesIndex].points[active.pointIndex]
      : null;
  const activeSeries = active ? series[active.seriesIndex] : null;
  const value = activePoint?.x ?? headline;
  const label = activePoint
    ? (activePoint.label ?? activeSeries?.label ?? title)
    : title;
  const display = useCountUp(value);

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
              key={active ? `${active.seriesIndex}-${active.pointIndex}` : "total"}
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
          <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid
              stroke="var(--color-border-secondary)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="x"
              name="收入"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
              tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="会议"
              width={32}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <ZAxis type="number" dataKey="z" range={[60, 320]} />
            <Tooltip content={() => null} cursor={{ strokeDasharray: "4 4" }} />
            {series.map((s, seriesIndex) => (
              <Scatter
                key={s.label}
                name={s.label}
                data={s.points}
                fill={s.color}
                fillOpacity={
                  active === null || active.seriesIndex === seriesIndex ? 0.85 : 0.2
                }
                isAnimationActive
                animationDuration={450}
                onMouseEnter={(_, pointIndex) =>
                  setActive({ seriesIndex, pointIndex: Number(pointIndex) })
                }
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between gap-3 text-caption-1-medium text-text-tertiary">
        <span>收入</span>
        <span>会议</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {averages.map((tile, i) => (
          <button
            key={tile.label}
            type="button"
            className={cx(
              "flex min-w-0 flex-col gap-0.5 rounded-2lg bg-background-inner-default px-2.5 py-2 text-start shadow-card outline-none transition-opacity duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              active !== null && active.seriesIndex !== i && "opacity-40",
            )}
            onMouseEnter={() => setActive({ seriesIndex: i, pointIndex: 0 })}
            onMouseLeave={() => setActive(null)}
          >
            <span className="flex items-center gap-1.5">
              <span className={cx("size-2 shrink-0 rounded-full", tile.swatchClass)} aria-hidden />
              <span className="truncate text-caption-1-medium text-text-tertiary">
                {tile.label} · 平均
              </span>
            </span>
            <span className="ps-3.5 text-body-medium text-text-primary tabular-nums">
              {tile.value.toLocaleString("en-US")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
