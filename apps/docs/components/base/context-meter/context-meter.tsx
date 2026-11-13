import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Segmented context-window meter — beUI Context meter for AI composers:
 * system / tools / files / conversation fill a shared budget.
 *
 *   <ContextMeter
 *     segments={[
 *       { id: "system", label: "System", value: 12, tone: "neutral" },
 *       { id: "tools", label: "Tools", value: 18, tone: "info" },
 *       { id: "chat", label: "Chat", value: 40, tone: "accent" },
 *     ]}
 *     capacity={100}
 *   />
 */

export type ContextMeterTone = "neutral" | "accent" | "info" | "warning" | "danger";

export interface ContextMeterSegment {
  id: string;
  label: string;
  value: number;
  tone?: ContextMeterTone;
}

export interface ContextMeterProps extends HTMLAttributes<HTMLDivElement> {
  segments: ContextMeterSegment[];
  /** Total budget. Default 100. */
  capacity?: number;
  /** Warn when used/capacity crosses this ratio. Default 0.7. */
  warnAt?: number;
  showLegend?: boolean;
  /** Optional trailing action (e.g. Compact). */
  action?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const toneFill = sortCx({
  neutral: "bg-text-secondary/35",
  accent: "bg-accent-500",
  info: "bg-status-cyan-text",
  warning: "bg-status-yellow-text",
  danger: "bg-status-rose-text",
});

export function ContextMeter({
  segments,
  capacity = 100,
  warnAt = 0.7,
  showLegend = true,
  action,
  className,
  ref,
  ...props
}: ContextMeterProps) {
  const used = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const ratio = capacity <= 0 ? 0 : used / capacity;
  const warn = ratio >= warnAt;

  return (
    <div ref={ref} className={cx("flex w-full flex-col gap-2", className)} {...props}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-caption-1-medium text-text-secondary">
          上下文{" "}
          <span className={cx("tabular-nums", warn ? "text-status-yellow-text" : "text-text-primary")}>
            {Math.round(ratio * 100)}%
          </span>
        </p>
        {action}
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={Math.min(used, capacity)}
        aria-label="上下文窗口占用"
        className="flex h-2 w-full overflow-hidden rounded-full bg-border-button-default"
      >
        {segments.map((seg) => {
          const width = capacity <= 0 ? 0 : (Math.max(0, seg.value) / capacity) * 100;
          if (width <= 0) return null;
          return (
            <span
              key={seg.id}
              title={`${seg.label}: ${seg.value}`}
              className={cx("h-full transition-[width] duration-300", toneFill[seg.tone ?? "accent"])}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>
      {showLegend ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {segments.map((seg) => (
            <li key={seg.id} className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-secondary">
              <span className={cx("size-1.5 rounded-full", toneFill[seg.tone ?? "accent"])} />
              {seg.label}
              <span className="tabular-nums text-text-primary">{seg.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
