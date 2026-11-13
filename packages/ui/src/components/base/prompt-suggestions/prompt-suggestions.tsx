"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { RiSparklingLine } from "@remixicon/react";
import { cx } from "../../../utils/cx";

/**
 * Empty-state prompt chips for AI chat — tap to fill / send.
 *
 *   <PromptSuggestions
 *     suggestions={["Summarize this PR", "Explain the error"]}
 *     onSelect={(s) => setPrompt(s)}
 *   />
 */

export interface PromptSuggestionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "children"> {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
  /** Optional heading above the chips. */
  label?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function PromptSuggestions({
  suggestions,
  onSelect,
  label,
  className,
  ref,
  ...props
}: PromptSuggestionsProps) {
  return (
    <div
      ref={ref}
      className={cx("flex w-full flex-col gap-2.5", className)}
      {...props}
    >
      {label ? (
        <p className="text-caption-1-semibold tracking-[0.04em] text-text-tertiary uppercase">
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect?.(item)}
            className={cx(
              "group inline-flex max-w-full items-center gap-2 rounded-xl px-3.5 py-2.5",
              "border border-separator-border bg-background-full text-body-medium text-text-primary shadow-xs",
              "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease",
              "hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700",
              "hover:shadow-sm dark:hover:bg-accent-900/30 dark:hover:text-accent-200",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            )}
          >
            <RiSparklingLine
              className="size-4 shrink-0 text-accent-500 transition-colors group-hover:text-accent-600 dark:group-hover:text-accent-300"
              aria-hidden
            />
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
