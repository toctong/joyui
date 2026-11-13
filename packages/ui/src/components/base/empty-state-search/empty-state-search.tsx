"use client";

import type { ComponentType, HTMLAttributes, ReactNode, Ref } from "react";
import { RiSearchLine } from "@remixicon/react";
import { Button } from "../buttons/button";
import { cx } from "../../../utils/cx";

/**
 * Search empty state — echoes the query, offers suggestion chips, and a clear action.
 *
 *   <EmptyStateSearch
 *     query="Severance"
 *     suggestions={["本季热播", "已完结", "纪录片"]}
 *     onSuggestionSelect={(s) => setQuery(s)}
 *     onClear={() => setQuery("")}
 *   />
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface EmptyStateSearchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Search string to echo in the description. */
  query: string;
  /** Override default title. */
  title?: ReactNode;
  /** Override default description (otherwise echoes `query`). */
  description?: ReactNode;
  /** Remix Icon component reference. Defaults to search. */
  icon?: IconComponent;
  /** Suggestion chips under the copy. */
  suggestions?: readonly string[];
  onSuggestionSelect?: (suggestion: string) => void;
  /** Clear / reset search. */
  onClear?: () => void;
  clearLabel?: ReactNode;
  /** Optional suggestions heading. */
  suggestionsLabel?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyStateSearch({
  query,
  title = "未找到相关结果",
  description,
  icon: Icon = RiSearchLine,
  suggestions = [],
  onSuggestionSelect,
  onClear,
  clearLabel = "清除搜索",
  suggestionsLabel = "试试这些关键词",
  className,
  ref,
  ...props
}: EmptyStateSearchProps) {
  const resolvedDescription =
    description ??
    (query.trim()
      ? (
          <>
            没有与「
            <span className="text-text-primary">{query.trim()}</span>
            」匹配的内容，换个词试试。
          </>
        )
      : "输入关键词开始搜索。");

  return (
    <div
      ref={ref}
      className={cx(
        "flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <span className="mb-1.5 flex size-16 items-center justify-center rounded-2xl bg-background-secondary-default">
        <Icon className="size-8 text-foreground-icon-primary" aria-hidden />
      </span>
      <div className="flex max-w-md flex-col gap-1">
        <p className="text-body-medium text-text-primary">{title}</p>
        <p className="text-body-regular text-text-tertiary">{resolvedDescription}</p>
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-1 flex w-full max-w-md flex-col items-center gap-2">
          {suggestionsLabel ? (
            <p className="text-caption-1-medium text-text-tertiary">{suggestionsLabel}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSuggestionSelect?.(item)}
                className={cx(
                  "inline-flex items-center rounded-full border border-separator-border bg-background-full px-3 py-1.5",
                  "text-caption-1-medium text-text-secondary shadow-xs",
                  "transition-[background-color,border-color,color] duration-200 ease",
                  "hover:border-border-button-default hover:bg-background-secondary-default hover:text-text-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {onClear ? (
        <div className="mt-1">
          <Button variant="secondary" size="small" onClick={onClear}>
            {clearLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
