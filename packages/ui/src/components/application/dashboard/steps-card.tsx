"use client";

import { useState } from "react";

import { WeekRangePill } from "../medical/week-range-pill";
import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Steps Card: weekly step totals as teal bars in gray tracks (earnings-style),
 * with a week-range switcher and a count-up headline.
 */

type DayPoint = { label: string; value: number };

const WEEKS: { label: string; total: number; days: DayPoint[] }[] = [
  {
    label: "6/29 - 7/5",
    total: 31600,
    days: [
      { label: "周一", value: 4200 },
      { label: "周二", value: 5100 },
      { label: "周三", value: 3800 },
      { label: "周四", value: 5600 },
      { label: "周五", value: 4900 },
      { label: "周六", value: 6200 },
      { label: "周日", value: 1800 },
    ],
  },
  {
    label: "6/22 - 6/28",
    total: 28420,
    days: [
      { label: "周一", value: 3600 },
      { label: "周二", value: 4400 },
      { label: "周三", value: 4100 },
      { label: "周四", value: 3900 },
      { label: "周五", value: 5200 },
      { label: "周六", value: 4700 },
      { label: "周日", value: 2520 },
    ],
  },
  {
    label: "7/6 - 7/12",
    total: 33840,
    days: [
      { label: "周一", value: 4800 },
      { label: "周二", value: 5300 },
      { label: "周三", value: 4500 },
      { label: "周四", value: 5100 },
      { label: "周五", value: 4700 },
      { label: "周六", value: 5900 },
      { label: "周日", value: 3540 },
    ],
  },
];

export function StepsCard({ className }: { className?: string } = {}) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const week = WEEKS[weekIndex];
  const display = useCountUp(week.total);
  const max = Math.max(...week.days.map((d) => d.value));

  return (
    <section
      className={cx(
        "flex h-[320px] min-w-0 flex-1 flex-col gap-5 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">步数</p>
          <p
            key={week.label}
            className="animate-number-fade text-title-1-medium text-text-primary tabular-nums"
          >
            {display.toLocaleString("en-US")}
          </p>
          <p className="text-body-2-medium text-text-tertiary">总步数</p>
        </div>
        <WeekRangePill
          label={week.label}
          onPrev={() => setWeekIndex((i) => (i + WEEKS.length - 1) % WEEKS.length)}
          onNext={() => setWeekIndex((i) => (i + 1) % WEEKS.length)}
        />
      </div>

      <div className="flex min-h-0 flex-1 items-end gap-2.5 px-1 pb-1">
        {week.days.map((day, index) => {
          const height = `${Math.max(8, (day.value / max) * 100)}%`;
          const active = hover === index;
          return (
            <button
              key={`${week.label}-${day.label}`}
              type="button"
              className="group flex h-full min-w-0 flex-1 flex-col items-center gap-2 outline-none"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              aria-label={`${day.label} ${day.value.toLocaleString("en-US")} 步`}
            >
              <div
                className={cx(
                  "relative flex w-full flex-1 items-end justify-center rounded-xl bg-chart-track/80 px-1.5 py-1.5 transition-shadow duration-150",
                  active && "ring-1 ring-chart-cursor shadow-xs",
                )}
              >
                <div
                  className="w-full origin-bottom rounded-lg bg-chart-1-active animate-bar-rise"
                  style={{
                    height,
                    animationDelay: `${index * 45}ms`,
                  }}
                />
              </div>
              <span className="text-caption-1-medium text-text-tertiary">{day.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
