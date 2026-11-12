"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/base/badges/chip";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Heatmap Chart Card: weekday × hour matrix as a pure CSS grid. Cell tint
 * blends chart-blue into the chart track so the ramp follows the theme;
 * hovering a cell rings it and swaps the headline for that cell's value.
 */

export type HeatmapRow = {
  label: string;
  values: number[];
};

export const HEATMAP_COLUMNS = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];

/** Demo active-user intensity for Mon–Sun × bi-hourly slots. */
export const HEATMAP_ROWS: HeatmapRow[] = [
  { label: "周一", values: [12, 8, 4, 6, 28, 52, 68, 74, 81, 76, 58, 34] },
  { label: "周二", values: [14, 9, 5, 7, 31, 55, 72, 78, 84, 79, 61, 36] },
  { label: "周三", values: [11, 7, 3, 8, 33, 58, 75, 82, 88, 80, 63, 38] },
  { label: "周四", values: [13, 8, 4, 9, 30, 54, 71, 77, 85, 78, 60, 35] },
  { label: "周五", values: [15, 10, 6, 10, 36, 62, 79, 86, 90, 83, 66, 42] },
  { label: "周六", values: [22, 14, 9, 12, 24, 40, 48, 52, 55, 58, 49, 31] },
  { label: "周日", values: [18, 12, 8, 10, 20, 34, 42, 46, 50, 52, 44, 28] },
];

const TIER_CLASSES = [
  "bg-chart-track",
  "bg-chart-6/25",
  "bg-chart-6/45",
  "bg-chart-6/65",
  "bg-chart-6-active/85",
  "bg-chart-6-active",
] as const;

function tierFor(value: number, max: number) {
  if (value <= 0 || max <= 0) return 0;
  const t = value / max;
  if (t < 0.15) return 1;
  if (t < 0.35) return 2;
  if (t < 0.55) return 3;
  if (t < 0.75) return 4;
  return 5;
}

export function HeatmapChartCard({
  rows = HEATMAP_ROWS,
  columns = HEATMAP_COLUMNS,
  title = "Active users",
  headline = 1892,
  delta = "+5.2%",
  period = "过去 7 天",
  className,
}: {
  rows?: HeatmapRow[];
  columns?: string[];
  title?: string;
  headline?: number;
  delta?: string;
  period?: string;
  className?: string;
} = {}) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  const max = useMemo(
    () => Math.max(1, ...rows.flatMap((row) => row.values)),
    [rows],
  );

  const cellValue =
    hover && rows[hover.row] ? (rows[hover.row].values[hover.col] ?? 0) : null;
  const label =
    hover && rows[hover.row]
      ? `${rows[hover.row].label} · ${columns[hover.col] ?? ""}:00`
      : title;
  const display = useCountUp(cellValue ?? headline);

  return (
    <section
      className={cx(
        "flex h-[344px] min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="w-full text-body-medium text-text-secondary">{label}</p>
          <div className="flex w-full items-center gap-2">
            <p
              key={hover ? `${hover.row}-${hover.col}` : "total"}
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

      <div className="flex min-h-0 w-full flex-1 flex-col gap-2">
        <div
          className="grid min-h-0 flex-1 gap-1"
          style={{
            gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`,
          }}
        >
          {rows.map((row, ri) => (
            <div key={row.label} className="contents">
              <span className="flex items-center pe-2 text-caption-1-medium text-text-tertiary">
                {row.label}
              </span>
              {row.values.map((value, ci) => {
                const active = hover?.row === ri && hover?.col === ci;
                const dimmed = hover !== null && !active;
                return (
                  <button
                    key={`${row.label}-${columns[ci]}`}
                    type="button"
                    aria-label={`${row.label} ${columns[ci]}:00, ${value}`}
                    className={cx(
                      "min-h-0 min-w-0 rounded-sm outline-none transition-[opacity,box-shadow] duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      TIER_CLASSES[tierFor(value, max)],
                      active && "ring-2 ring-border-focus-ring ring-offset-1 ring-offset-background-secondary-default",
                      dimmed && "opacity-35",
                    )}
                    onMouseEnter={() => setHover({ row: ri, col: ci })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ row: ri, col: ci })}
                    onBlur={() => setHover(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          <span aria-hidden className="pe-2" />
          {columns.map((col) => (
            <span
              key={col}
              className="text-center text-caption-1-medium text-text-tertiary tabular-nums"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-caption-1-medium text-text-tertiary">
        <span>少</span>
        <div className="flex items-center gap-1">
          {TIER_CLASSES.slice(1).map((cls) => (
            <span key={cls} className={cx("size-2.5 rounded-sm", cls)} aria-hidden />
          ))}
        </div>
        <span>更多</span>
      </div>
    </section>
  );
}
