"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  RiBuilding2Line,
  RiEyeLine,
  RiGroupLine,
  RiPulseLine,
  RiUserAddLine,
  RiVipCrownFill,
} from "@remixicon/react";

import { Chip } from "../../base/badges/chip";
import { useCountUp } from "../../../hooks/use-count-up";
import { cx } from "../../../utils/cx";

/**
 * Stage Bars Card: a conversion funnel as horizontal rounded bars — label,
 * tinted pill with optional icon, value + share — plus a 3×2 footer tile grid.
 */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

type Stage = {
  label: string;
  value: number;
  color: string;
  icon: IconComponent;
};

const STAGES: Stage[] = [
  { label: "访问量", value: 1180, color: "bg-chart-7-active", icon: RiEyeLine },
  { label: "注册", value: 790, color: "bg-chart-6-active", icon: RiUserAddLine },
  { label: "活跃", value: 460, color: "bg-chart-5-active", icon: RiPulseLine },
  { label: "Pro", value: 250, color: "bg-chart-3-active", icon: RiVipCrownFill },
  { label: "团队", value: 120, color: "bg-chart-8-active", icon: RiGroupLine },
  { label: "企业", value: 40, color: "bg-chart-1-active", icon: RiBuilding2Line },
];

const TOP = STAGES[0].value;

export function StageBarsCard({ className }: { className?: string } = {}) {
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const display = useCountUp(TOP);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className={cx(
        "flex min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">Pipeline</p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
              {display.toLocaleString("en-US")}
            </p>
            <Chip variant="bold" color="lime">
              +2.4%
            </Chip>
          </div>
        </div>
        <Chip variant="bold" color="soft">
          过去 7 天
        </Chip>
      </div>

      <div className="flex flex-col gap-2.5">
        {STAGES.map((stage) => {
          const share = Math.round((stage.value / TOP) * 100);
          const width = ready ? `${Math.max(share, 6)}%` : "0%";
          const faded = hover !== null && hover !== stage.label;
          return (
            <div
              key={stage.label}
              className={cx(
                "grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 transition-opacity duration-200",
                faded && "opacity-35",
              )}
              onMouseEnter={() => setHover(stage.label)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="truncate text-body-medium text-text-secondary">{stage.label}</span>
              <div className="h-8 w-full rounded-full bg-chart-track/70 p-0.5">
                <div
                  className={cx(
                    "flex h-full items-center gap-1.5 overflow-hidden rounded-full pe-2 ps-2 text-white transition-[width] duration-700 ease-out",
                    stage.color,
                  )}
                  style={{ width }}
                >
                  <stage.icon className="size-3.5 shrink-0" aria-hidden />
                </div>
              </div>
              <span className="whitespace-nowrap text-body-medium text-text-primary tabular-nums">
                {stage.value.toLocaleString("en-US")}
                <span className="ms-1.5 text-text-tertiary">{share}%</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-1 grid grid-cols-3 gap-2">
        {STAGES.map((stage) => (
          <div
            key={`tile-${stage.label}`}
            className="flex flex-col gap-0.5 rounded-2lg bg-background-inner-default px-2.5 py-2 shadow-card"
          >
            <div className="flex items-center gap-1.5">
              <span className={cx("size-2 shrink-0 rounded-full", stage.color)} aria-hidden />
              <p className="truncate text-caption-1-medium text-text-tertiary">{stage.label}</p>
            </div>
            <p className="text-body-medium text-text-primary tabular-nums">
              {stage.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
