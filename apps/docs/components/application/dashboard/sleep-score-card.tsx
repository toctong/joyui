"use client";

import { useId, useState } from "react";
import { RiAlarmLine, RiMoonClearFill, RiNotification3Line } from "@remixicon/react";

import { WeekRangePill } from "@/components/application/medical/week-range-pill";
import { Chip } from "@/components/base/badges/chip";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Sleep Score Card: segmented donut (purple / pink / blue) with a centre
 * score, week switcher, and three metric rows with sub-scores.
 */

type Metric = {
  icon: typeof RiMoonClearFill;
  label: string;
  detail: string;
  score: number;
  max: number;
  color: string;
};

const WEEKS = ["6/29 - 7/5", "6/22 - 6/28", "7/6 - 7/12"];

const METRICS: Metric[] = [
  {
    icon: RiMoonClearFill,
    label: "持续时间",
    detail: "7h 50m",
    score: 49,
    max: 50,
    color: "var(--color-chart-5-active)",
  },
  {
    icon: RiAlarmLine,
    label: "就寝时间",
    detail: "提前 20m",
    score: 29,
    max: 30,
    color: "var(--color-chart-3-active)",
  },
  {
    icon: RiNotification3Line,
    label: "打扰",
    detail: "5m 醒来",
    score: 20,
    max: 20,
    color: "var(--color-chart-6-active)",
  },
];

const SEGMENTS = [
  { key: "duration", value: 49, color: "var(--color-chart-5-active)" },
  { key: "bedtime", value: 29, color: "var(--color-chart-3-active)" },
  { key: "disturb", value: 20, color: "var(--color-chart-6-active)" },
] as const;

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export function SleepScoreCard({ className }: { className?: string } = {}) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const gradientId = useId();
  const score = useCountUp(98);
  const total = SEGMENTS.reduce((sum, s) => sum + s.value, 0);

  let cursor = 0;
  const arcs = SEGMENTS.map((segment) => {
    const start = (cursor / total) * 360;
    cursor += segment.value;
    const end = (cursor / total) * 360;
    return { ...segment, start, end };
  });

  return (
    <section
      className={cx(
        "flex min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">睡眠评分</p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
              {score}
            </p>
            <Chip variant="bold" color="purple">
              优秀
            </Chip>
          </div>
        </div>
        <WeekRangePill
          label={WEEKS[weekIndex]}
          onPrev={() => setWeekIndex((i) => (i + WEEKS.length - 1) % WEEKS.length)}
          onNext={() => setWeekIndex((i) => (i + 1) % WEEKS.length)}
        />
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative size-[148px] shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-0" aria-hidden>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-chart-5)" />
                <stop offset="50%" stopColor="var(--color-chart-3)" />
                <stop offset="100%" stopColor="var(--color-chart-6)" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="var(--color-chart-track)"
              strokeWidth="12"
            />
            {arcs.map((arc) => {
              const active = focus === null || focus === arc.key;
              return (
                <path
                  key={arc.key}
                  d={arcPath(60, 60, 46, arc.start + 2, arc.end - 2)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity={active ? 1 : 0.2}
                  className="transition-opacity duration-200"
                  onMouseEnter={() => setFocus(arc.key)}
                  onMouseLeave={() => setFocus(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-display-4-medium text-text-primary tabular-nums">{score}</p>
            <p className="text-caption-1-medium text-text-tertiary">分</p>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          {METRICS.map((metric, index) => {
            const key = SEGMENTS[index].key;
            const active = focus === null || focus === key;
            return (
              <div
                key={metric.label}
                className={cx(
                  "flex items-center justify-between gap-3 rounded-2lg bg-background-inner-default px-2.5 py-2 shadow-card transition-opacity duration-200",
                  !active && "opacity-40",
                )}
                onMouseEnter={() => setFocus(key)}
                onMouseLeave={() => setFocus(null)}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${metric.color} 18%, transparent)` }}
                  >
                    <metric.icon className="size-4" style={{ color: metric.color }} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-body-medium text-text-primary">{metric.label}</p>
                    <p className="truncate text-body-2-medium text-text-tertiary">{metric.detail}</p>
                  </div>
                </div>
                <p className="shrink-0 text-body-medium text-text-primary tabular-nums">
                  {metric.score}
                  <span className="text-text-tertiary">/{metric.max}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
