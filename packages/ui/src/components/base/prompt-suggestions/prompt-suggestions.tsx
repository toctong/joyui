"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
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
      className={cx("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {label ? (
        <p className="text-caption-1-medium text-text-secondary">{label}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect?.(item)}
            className={cx(
              "inline-flex max-w-full items-center rounded-2lg px-2.5 py-1.5",
              "bg-background-secondary-default text-body-2-regular text-text-secondary",
              "ring-1 ring-inset ring-border-secondary-default",
              "transition-[background-color,color,box-shadow] duration-200 ease",
              "hover:bg-background-tertiary-default hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            )}
          >
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
