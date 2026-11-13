import type { HTMLAttributes, Ref } from "react";
import { RiStarFill, RiStarLine } from "@remixicon/react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Read-only or interactive star rating. Discovery grids and review cards.
 */

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current value (0 … max). */
  value?: number;
  max?: number;
  /** Allow clicking a star to change value. */
  interactive?: boolean;
  size?: "sm" | "md";
  /** Accessible name, e.g. "Rating". */
  "aria-label"?: string;
  onChange?: (value: number) => void;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  star: {
    sm: "size-3.5",
    md: "size-4",
  },
});

export function Rating({
  value = 0,
  max = 5,
  interactive = false,
  size = "md",
  "aria-label": ariaLabel = "Rating",
  onChange,
  className,
  ref,
  ...props
}: RatingProps) {
  const clamped = Math.max(0, Math.min(max, value));
  return (
    <div
      ref={ref}
      role={interactive ? "radiogroup" : "img"}
      aria-label={ariaLabel}
      className={cx("inline-flex items-center gap-0.5 text-status-yellow-text", className)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= Math.round(clamped);
        const Icon = filled ? RiStarFill : RiStarLine;
        if (!interactive) {
          return <Icon key={n} className={styles.star[size]} aria-hidden />;
        }
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === Math.round(clamped)}
            aria-label={`${n}`}
            className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            onClick={() => onChange?.(n)}
          >
            <Icon className={styles.star[size]} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
