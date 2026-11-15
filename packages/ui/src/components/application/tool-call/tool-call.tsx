"use client";

import { useState, type ComponentType, type HTMLAttributes, type ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiLoader4Line,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { TextShimmer } from "../../base/text-shimmer/text-shimmer";
import { cx, sortCx } from "../../../utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Generic expandable tool / MCP call card inside a transcript.
 *
 *   <ToolCall name="read_file" status="done" summary="src/index.ts">
 *     <pre>{args}</pre>
 *   </ToolCall>
 */

export type ToolCallStatus = "pending" | "running" | "done" | "error";

export interface ToolCallProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  name: string;
  status?: ToolCallStatus;
  summary?: ReactNode;
  icon?: IconComponent;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  error?: ReactNode;
  children?: ReactNode;
}

const statusStyles = sortCx({
  pending: "text-text-tertiary",
  running: "text-accent-500",
  done: "text-status-lime-text",
  error: "text-notification-error-foreground",
});

function StatusIcon({ status }: { status: ToolCallStatus }) {
  if (status === "running") {
    return (
      <RiLoader4Line
        className="size-4 shrink-0 animate-spin text-accent-500"
        aria-hidden
      />
    );
  }
  if (status === "done") {
    return (
      <RiCheckboxCircleFill
        className="size-4 shrink-0 text-status-lime-text"
        aria-hidden
      />
    );
  }
  if (status === "error") {
    return (
      <RiCloseCircleFill
        className="size-4 shrink-0 text-notification-error-foreground"
        aria-hidden
      />
    );
  }
  return (
    <span
      className="size-4 shrink-0 rounded-full border border-separator-border"
      aria-hidden
    />
  );
}

export function ToolCall({
  name,
  status = "pending",
  summary,
  icon: Icon = RiTerminalBoxLine,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  error,
  className,
  children,
  ...props
}: ToolCallProps) {
  const [uncontrolled, setUncontrolled] = useState(
    defaultOpen || status === "error",
  );
  const open = openProp ?? uncontrolled;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (openProp === undefined) setUncontrolled(next);
  };
  const expandable = Boolean(children || error);

  return (
    <div
      data-status={status}
      className={cx(
        "overflow-hidden rounded-xl border border-separator-border bg-background-primary-default",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        onClick={() => expandable && setOpen(!open)}
        className={cx(
          "flex w-full items-center gap-2 px-3 py-2 text-start",
          "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
          expandable && "cursor-pointer hover:bg-background-secondary-hover",
          !expandable && "cursor-default",
        )}
      >
        <StatusIcon status={status} />
        <Icon
          className={cx("size-4 shrink-0", statusStyles[status])}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate">
          {status === "running" ? (
            <TextShimmer className="text-body-2-medium">{name}</TextShimmer>
          ) : (
            <span className="text-body-2-medium text-text-primary">{name}</span>
          )}
          {summary ? (
            <span className="ms-2 text-caption-1-regular text-text-tertiary">
              {summary}
            </span>
          ) : null}
        </span>
        {expandable ? (
          <RiArrowDownSLine
            aria-hidden
            className={cx(
              "size-4 shrink-0 text-foreground-icon-quaternary transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        ) : null}
      </button>
      {open && expandable ? (
        <div className="space-y-2 border-t border-separator-border bg-background-secondary-default px-3 py-2.5">
          {error ? (
            <p className="text-body-2-regular text-notification-error-foreground">
              {error}
            </p>
          ) : null}
          {children ? (
            <div className="overflow-x-auto text-caption-1-regular whitespace-pre-wrap text-text-secondary">
              {children}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
