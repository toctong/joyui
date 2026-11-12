"use client";

import { useId, useState } from "react";
import { RiFireFill, RiRunFill, RiUserSmileLine } from "@remixicon/react";

import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Activity Rings Card: Apple Watch-style concentric move / exercise / stand
 * rings with matching stat tiles underneath.
 */

export type ActivityDay = {
  move: number;
  moveGoal: number;
  exercise: number;
  exerciseGoal: number;
  stand: number;
  standGoal: number;
};

const DEFAULT_DAY: ActivityDay = {
  move: 1592,
  moveGoal: 1800,
  exercise: 105,
  exerciseGoal: 120,
  stand: 10,
  standGoal: 12,
};

type RingDef = {
  key: "move" | "exercise" | "stand";
  label: string;
  color: string;
  track: string;
  radius: number;
  progress: number;
  valueLabel: string;
  unit: string;
  icon: typeof RiFireFill;
};

function ringPath(cx: number, cy: number, r: number, progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const sweep = clamped * 359.9;
  const start = (-90 * Math.PI) / 180;
  const end = ((-90 + sweep) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = sweep > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export function ActivityRingsCard({
  day = DEFAULT_DAY,
  className,
}: {
  day?: ActivityDay;
  className?: string;
} = {}) {
  const [focus, setFocus] = useState<RingDef["key"] | null>(null);
  const filterId = useId();
  const move = useCountUp(day.move);

  const rings: RingDef[] = [
    {
      key: "move",
      label: "活动",
      color: "var(--color-chart-3-active)",
      track: "color-mix(in srgb, var(--color-chart-3) 22%, transparent)",
      radius: 54,
      progress: day.move / day.moveGoal,
      valueLabel: `${move.toLocaleString("en-US")} kcal`,
      unit: `目标 ${day.moveGoal.toLocaleString("en-US")}`,
      icon: RiFireFill,
    },
    {
      key: "exercise",
      label: "锻炼",
      color: "var(--color-chart-7-active)",
      track: "color-mix(in srgb, var(--color-chart-7) 22%, transparent)",
      radius: 40,
      progress: day.exercise / day.exerciseGoal,
      valueLabel: `${Math.floor(day.exercise / 60)}h ${day.exercise % 60}m`,
      unit: `目标 ${day.exerciseGoal}m`,
      icon: RiRunFill,
    },
    {
      key: "stand",
      label: "站立",
      color: "var(--color-chart-6-active)",
      track: "color-mix(in srgb, var(--color-chart-6) 22%, transparent)",
      radius: 26,
      progress: day.stand / day.standGoal,
      valueLabel: `${day.stand} 小时`,
      unit: `目标 ${day.standGoal}`,
      icon: RiUserSmileLine,
    },
  ];

  return (
    <section
      className={cx(
        "flex min-w-0 flex-1 flex-col gap-5 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-body-medium text-text-secondary">活动圆环</p>
        <p className="text-title-2-medium text-text-primary">今日目标</p>
      </div>

      <div className="flex justify-center py-1">
        <svg viewBox="0 0 140 140" className="size-[180px]" role="img" aria-label="Activity rings">
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.18" />
            </filter>
          </defs>
          {rings.map((ring) => {
            const active = focus === null || focus === ring.key;
            return (
              <g
                key={ring.key}
                opacity={active ? 1 : 0.22}
                className="transition-opacity duration-200"
                onMouseEnter={() => setFocus(ring.key)}
                onMouseLeave={() => setFocus(null)}
              >
                <circle
                  cx="70"
                  cy="70"
                  r={ring.radius}
                  fill="none"
                  stroke={ring.track}
                  strokeWidth="11"
                />
                <path
                  d={ringPath(70, 70, ring.radius, ring.progress)}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="11"
                  strokeLinecap="round"
                  filter={`url(#${filterId})`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {rings.map((ring) => {
          const Icon = ring.icon;
          const active = focus === null || focus === ring.key;
          return (
            <button
              key={ring.key}
              type="button"
              className={cx(
                "flex flex-col gap-1 rounded-2lg bg-background-inner-default px-2.5 py-2 text-start shadow-card outline-none transition-opacity duration-200",
                !active && "opacity-40",
              )}
              onMouseEnter={() => setFocus(ring.key)}
              onMouseLeave={() => setFocus(null)}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="size-3.5 shrink-0" style={{ color: ring.color }} aria-hidden />
                <span className="truncate text-caption-1-medium text-text-tertiary">{ring.label}</span>
              </div>
              <p className="text-body-medium text-text-primary tabular-nums">{ring.valueLabel}</p>
              <p className="text-caption-1-medium text-text-tertiary">{ring.unit}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
