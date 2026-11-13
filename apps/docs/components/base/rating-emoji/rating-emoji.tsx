"use client";

import { useState, type HTMLAttributes, type Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Emoji rating scale — for NPS / mood feedback where stars feel too formal.
 *
 *   <RatingEmoji value={4} interactive onChange={setValue} aria-label="满意度" />
 */

const DEFAULT_EMOJIS = ["😠", "😕", "😐", "🙂", "🤩"] as const;

export interface RatingEmojiProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current value (1 … emojis.length). 0 / undefined = none selected. */
  value?: number;
  defaultValue?: number;
  /** Override the emoji sequence (length becomes max). */
  emojis?: readonly string[];
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
  onChange?: (value: number) => void;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  emoji: {
    sm: "text-title-3-medium size-8",
    md: "text-title-2-medium size-10",
    lg: "text-title-1-medium size-12",
  },
});

export function RatingEmoji({
  value,
  defaultValue = 0,
  emojis = DEFAULT_EMOJIS,
  interactive = false,
  size = "md",
  "aria-label": ariaLabel = "表情评分",
  onChange,
  className,
  ref,
  ...props
}: RatingEmojiProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;
  const clamped = Math.max(0, Math.min(emojis.length, current));

  const select = (n: number) => {
    if (value === undefined) setUncontrolled(n);
    onChange?.(n);
  };

  return (
    <div
      ref={ref}
      role={interactive ? "radiogroup" : "img"}
      aria-label={ariaLabel}
      className={cx("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      {emojis.map((emoji, index) => {
        const n = index + 1;
        const selected = n === clamped;
        const dimmed = clamped > 0 && !selected;

        if (!interactive) {
          return (
            <span
              key={n}
              aria-hidden
              className={cx(
                "inline-flex items-center justify-center transition-opacity",
                styles.emoji[size],
                dimmed && "opacity-35",
              )}
            >
              {emoji}
            </span>
          );
        }

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${n}`}
            className={cx(
              "inline-flex items-center justify-center rounded-xl outline-none transition-[transform,opacity,background-color]",
              "hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              styles.emoji[size],
              dimmed && "opacity-40",
              selected && "scale-110 bg-background-secondary-default",
            )}
            onClick={() => select(n)}
          >
            <span aria-hidden>{emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
