"use client";

import { cx } from "../../../utils/cx";

/** Effort stops: 0 Faster … 5 Max (更聪明). */
export const EFFORT_LEVELS = [
  { id: 0, label: "更快" },
  { id: 1, label: "低" },
  { id: 2, label: "中" },
  { id: 3, label: "高" },
  { id: 4, label: "更高" },
  { id: 5, label: "最大" },
] as const;

export type EffortLevel = (typeof EFFORT_LEVELS)[number]["id"];

/**
 * Liquid effort rail — dark track with a cyan plasma fill that widens toward
 * Max, and a white thumb. Matches the JoyUI composer model menu look.
 */
export function EffortSlider({
  value,
  onChange,
  className,
}: {
  value: EffortLevel;
  onChange: (next: EffortLevel) => void;
  className?: string;
}) {
  const pct = (value / (EFFORT_LEVELS.length - 1)) * 100;

  return (
    <div className={cx("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between px-0.5">
        <span className="text-caption-1-medium text-text-tertiary">更快</span>
        <span className="text-caption-1-medium text-text-tertiary">更聪明</span>
      </div>
      <div className="relative h-8 w-full">
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-full bg-[#0b1220] dark:bg-neutral-950"
        >
          <div
            className="absolute inset-y-0 start-0"
            style={{
              width: `${Math.max(pct, 10)}%`,
              background:
                "radial-gradient(ellipse 90% 140% at 92% 50%, #e0f2fe 0%, #7dd3fc 18%, #38bdf8 42%, #0284c7 72%, #0c4a6e 100%)",
              boxShadow:
                "0 0 22px rgba(56,189,248,0.65), 0 0 8px rgba(14,165,233,0.4) inset",
              borderRadius: "9999px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-[2px] start-[2px] rounded-full opacity-80"
            style={{
              width: `calc(${Math.max(pct, 10)}% - 4px)`,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.55) 100%)",
              filter: "blur(0.5px)",
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={EFFORT_LEVELS.length - 1}
          step={1}
          value={value}
          aria-label="努力"
          aria-valuetext={EFFORT_LEVELS[value]?.label}
          onChange={(e) => onChange(Number(e.target.value) as EffortLevel)}
          className={cx(
            "absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2",
            "[&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)]",
            "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white",
            "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)]",
          )}
        />
      </div>
    </div>
  );
}
