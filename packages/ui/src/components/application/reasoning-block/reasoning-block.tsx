"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { RiArrowDownSLine, RiBrainLine } from "@remixicon/react";
import { TextShimmer } from "../../base/text-shimmer/text-shimmer";
import { cx } from "../../../utils/cx";

/**
 * Collapsible chain-of-thought inside an assistant turn.
 * Distinct from AgentThinking (pre-response loader).
 *
 *   <ReasoningBlock title="Thought for 12s" status="done">
 *     Looking at the failing test…
 *   </ReasoningBlock>
 */

export type ReasoningBlockStatus = "streaming" | "done";

export interface ReasoningBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  status?: ReasoningBlockStatus;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function ReasoningBlock({
  title,
  status = "done",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: ReasoningBlockProps) {
  const [uncontrolled, setUncontrolled] = useState(
    defaultOpen || status === "streaming",
  );
  const open = openProp ?? uncontrolled;
  const streaming = status === "streaming";
  const label =
    title ??
    (streaming ? (
      <TextShimmer className="text-caption-1-medium">Thinking…</TextShimmer>
    ) : (
      "Thought"
    ));

  // Keep the block open while tokens stream in (uncontrolled only).
  useEffect(() => {
    if (openProp !== undefined) return;
    if (status === "streaming") setUncontrolled(true);
  }, [status, openProp]);

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (openProp === undefined) setUncontrolled(next);
  };

  return (
    <div
      data-status={status}
      className={cx(
        "overflow-hidden rounded-xl border border-separator-border bg-background-secondary-default",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cx(
          "flex w-full items-center gap-2 px-3 py-2 text-start",
          "text-caption-1-medium text-text-secondary outline-none",
          "hover:bg-background-secondary-hover",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
        )}
      >
        <RiBrainLine
          className="size-4 shrink-0 text-foreground-icon-tertiary"
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <RiArrowDownSLine
          aria-hidden
          className={cx(
            "size-4 shrink-0 text-foreground-icon-quaternary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-separator-border px-3 py-2.5 text-body-2-regular whitespace-pre-wrap text-text-secondary">
          {children}
        </div>
      ) : null}
    </div>
  );
}
