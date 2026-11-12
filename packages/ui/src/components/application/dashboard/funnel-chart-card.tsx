"use client";

import { useId, useState } from "react";

import { Chip } from "../../base/badges/chip";
import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Funnel Chart Card: a horizontal four-stage sign-up funnel drawn as SVG
 * trapezoids with a soft glow. Conversion % pills sit on each stage; the
 * footer lists absolute counts with matching color dots.
 */

export type FunnelStage = {
  label: string;
  value: number;
  /** Share of the funnel top, 0–100. */
  percent: number;
  /** CSS color for the trapezoid fill (chart token). */
  color: string;
  /** Tailwind bg utility for the footer dot. */
  dotClass: string;
};

export const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: "链接已打开",
    value: 197,
    percent: 100,
    color: "var(--color-chart-7-active)",
    dotClass: "bg-chart-7-active",
  },
  {
    label: "开始",
    value: 110,
    percent: 56,
    color: "var(--color-chart-6-active)",
    dotClass: "bg-chart-6-active",
  },
  {
    label: "已完成",
    value: 77,
    percent: 39,
    color: "var(--color-chart-5-active)",
    dotClass: "bg-chart-5-active",
  },
  {
    label: "已转换",
    value: 38,
    percent: 19,
    color: "var(--color-chart-3-active)",
    dotClass: "bg-chart-3-active",
  },
];

const VIEW_W = 400;
const VIEW_H = 140;
const PAD_Y = 8;

function stageBand(percent: number) {
  const h = ((VIEW_H - PAD_Y * 2) * percent) / 100;
  const y0 = (VIEW_H - h) / 2;
  return { y0, y1: y0 + h };
}

function stagePath(index: number, stages: FunnelStage[]) {
  const n = stages.length;
  const w = VIEW_W / n;
  const left = stageBand(stages[index].percent);
  const right = stageBand(stages[Math.min(index + 1, n - 1)].percent);
  const x0 = index * w;
  const x1 = (index + 1) * w;
  // Last stage keeps a slight inward taper so it still reads as a funnel tip.
  const tip = index === n - 1 ? stageBand(Math.max(8, stages[index].percent * 0.72)) : right;
  return `M ${x0} ${left.y0} L ${x1} ${tip.y0} L ${x1} ${tip.y1} L ${x0} ${left.y1} Z`;
}

export function FunnelChartCard({
  stages = FUNNEL_STAGES,
  title = "Sign-up funnel",
  delta = "+5.2%",
  period = "过去 7 天",
  className,
}: {
  stages?: FunnelStage[];
  title?: string;
  delta?: string;
  period?: string;
  className?: string;
} = {}) {
  const glowId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = stages[0]?.value ?? 0;
  const hovering = activeIndex !== null && activeIndex < stages.length;
  const stage = hovering ? stages[activeIndex] : null;
  const headline = stage?.value ?? total;
  const label = stage?.label ?? title;
  const display = useCountUp(headline);

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

      <div className="relative min-h-0 w-full flex-1">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-full w-full"
          role="img"
          aria-label={title}
        >
          <defs>
            <filter id={glowId} x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {stages.map((s, i) => {
            const dimmed = activeIndex !== null && activeIndex !== i;
            return (
              <path
                key={s.label}
                d={stagePath(i, stages)}
                fill={s.color}
                opacity={dimmed ? 0.28 : 0.92}
                filter={`url(#${glowId})`}
                className="cursor-pointer transition-opacity duration-200 ease"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
          {stages.map((s, i) => (
            <div key={s.label} className="flex items-center justify-center">
              <span
                className={cx(
                  "rounded-full bg-background-secondary-default/90 px-2 py-0.5 text-caption-1-medium text-text-primary tabular-nums shadow-card backdrop-blur-sm transition-opacity duration-200 ease",
                  activeIndex !== null && activeIndex !== i && "opacity-40",
                )}
              >
                {s.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-separator-border pt-3">
        {stages.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={cx(
              "flex min-w-0 flex-col items-start gap-1 rounded-lg px-1 py-0.5 text-start outline-none transition-opacity duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              activeIndex !== null && activeIndex !== i && "opacity-40",
            )}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex items-center gap-1.5">
              <span className={cx("size-2 shrink-0 rounded-full", s.dotClass)} aria-hidden />
              <span className="truncate text-caption-1-medium text-text-tertiary">{s.label}</span>
            </span>
            <span className="ps-3.5 text-body-medium text-text-primary tabular-nums">
              {s.value.toLocaleString("en-US")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
