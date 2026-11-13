"use client";

import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Compact AI model picker — SegmentedControl track + selected thumb recipe,
 * sized for chat toolbars next to Composer.
 *
 *   <ModelSelect
 *     value={model}
 *     onChange={setModel}
 *     options={[
 *       { id: "fast", label: "Fast" },
 *       { id: "smart", label: "Smart" },
 *     ]}
 *   />
 */

export interface ModelSelectOption {
  id: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface ModelSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: ModelSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the group. */
  "aria-label"?: string;
  size?: "small" | "medium";
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  track: [
    "inline-flex items-center gap-0.5 rounded-2lg p-1",
    "bg-segmented-control-background",
  ].join(" "),
  option: {
    medium: "h-7 px-2.5 text-body-medium",
    small: "h-6 px-2 text-caption-1-medium",
  },
});

export function ModelSelect({
  options,
  value,
  defaultValue,
  onChange,
  size = "medium",
  className,
  ref,
  "aria-label": ariaLabel = "Model",
  ...props
}: ModelSelectProps) {
  const fallback =
    defaultValue ?? options.find((o) => !o.disabled)?.id ?? options[0]?.id;
  const [uncontrolled, setUncontrolled] = useState(fallback);
  const selected = value ?? uncontrolled;

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(styles.track, className)}
      {...props}
    >
      {options.map((option) => {
        const isSelected = option.id === selected;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={option.disabled || undefined}
            title={option.description}
            disabled={option.disabled}
            onClick={() => {
              if (option.disabled) return;
              if (value === undefined) setUncontrolled(option.id);
              onChange?.(option.id);
            }}
            className={cx(
              "inline-flex items-center justify-center rounded-md whitespace-nowrap",
              "transition-[background-color,color,box-shadow] duration-200 ease",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
              "disabled:cursor-not-allowed disabled:opacity-40",
              styles.option[size],
              isSelected
                ? "bg-segmented-control-selected-background text-text-primary shadow-2xs"
                : "bg-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
