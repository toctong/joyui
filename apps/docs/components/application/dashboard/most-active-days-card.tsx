"use client";

import { useMemo, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

type DayMetrics = { move: number; exercise: number; stand: number };

const DEMO_MONTH = 6; // July (0-indexed)
const DEMO_YEAR = 2026;

function metricsForDay(day: number): DayMetrics {
  const move = 40 + ((day * 17) % 60);
  const exercise = 35 + ((day * 13) % 55);
  const stand = 45 + ((day * 11) % 50);
  return { move, exercise, stand };
}

function MiniRings({ m, size = 22 }: { m: DayMetrics; size?: number }) {
  const r = [size * 0.42, size * 0.3, size * 0.18];
  const colors = ["#FF2D55", "#A3E635", "#22D3EE"];
  const values = [m.move, m.exercise, m.stand];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {r.map((radius, i) => {
        const c = 2 * Math.PI * radius;
        const pct = Math.min(100, values[i]) / 100;
        return (
          <g key={i}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-background-tertiary-default)"
              strokeWidth={size * 0.08}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i]}
              strokeWidth={size * 0.08}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

function LargeRings({ m }: { m: DayMetrics }) {
  const size = 168;
  const r = [72, 52, 32];
  const colors = ["#FF2D55", "#A3E635", "#22D3EE"];
  const values = [m.move, m.exercise, m.stand];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {r.map((radius, i) => {
        const c = 2 * Math.PI * radius;
        const pct = Math.min(100, values[i]) / 100;
        return (
          <g key={i}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-background-tertiary-default)"
              strokeWidth={14}
              opacity={0.85}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i]}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ filter: `drop-shadow(0 0 6px ${colors[i]}66)` }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Most Active Days — scrollable month calendar with per-day mini rings and a
 * detail panel for the selected day.
 */
export function MostActiveDaysCard({ className }: { className?: string }) {
  const [selected, setSelected] = useState(10);
  const daysInMonth = 31;
  const startWeekday = new Date(DEMO_YEAR, DEMO_MONTH, 1).getDay(); // 0=Sun
  const selectedMetrics = useMemo(() => metricsForDay(selected), [selected]);

  const cells = useMemo(() => {
    const blanks = Array.from({ length: startWeekday }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [startWeekday]);

  return (
    <section
      className={cx(
        "grid w-full min-w-0 gap-3 rounded-2xl bg-background-secondary-default p-3 sm:grid-cols-2 sm:p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3 rounded-2xl bg-background-primary-default p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-body-medium text-text-secondary">最活跃的日子</p>
            <p className="mt-0.5 text-title-3-semibold text-text-primary">
              32,459{" "}
              <span className="text-body-medium text-text-tertiary">总步数</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-border-button-default px-1 py-0.5">
            <button
              type="button"
              aria-label="上一月"
              className="flex size-6 items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-default"
            >
              <RiArrowLeftSLine className="size-4" />
            </button>
            <span className="min-w-10 text-center text-body-2-medium text-text-primary">
              7月
            </span>
            <button
              type="button"
              aria-label="下一月"
              className="flex size-6 items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-default"
            >
              <RiArrowRightSLine className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-caption-1-medium text-text-tertiary">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid max-h-[280px] grid-cols-7 gap-1 overflow-y-auto pe-1 [scrollbar-width:thin]">
          {cells.map((day, i) =>
            day === null ? (
              <div key={`b-${i}`} className="h-12" />
            ) : (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(day)}
                className={cx(
                  "flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors",
                  selected === day
                    ? "bg-background-secondary-hover ring-1 ring-border-button-default"
                    : "hover:bg-background-secondary-default",
                )}
              >
                <span className="text-caption-1-medium text-text-secondary">
                  {day}
                </span>
                <MiniRings m={metricsForDay(day)} />
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-background-primary-default p-4">
        <p className="text-body-medium text-text-secondary">
          July {selected}, {DEMO_YEAR} 的活动
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-body-2-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
            Move · 816 kcal
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-50 px-2.5 py-1 text-body-2-medium text-lime-700 dark:bg-lime-950/40 dark:text-lime-300">
            Exercise · 1h 41m
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-2.5 py-1 text-body-2-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
            Stand · 5.2 km
          </span>
        </div>
        <LargeRings m={selectedMetrics} />
      </div>
    </section>
  );
}
