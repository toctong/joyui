import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Vertical activity timeline for logs, audits, and transfer history.
 */

export type TimelineItemTone = "neutral" | "success" | "warning" | "error" | "info";

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Relative or absolute time label. */
  time?: ReactNode;
  tone?: TimelineItemTone;
  /** Leading glyph; defaults to a filled dot. */
  indicator?: ReactNode;
  ref?: Ref<HTMLLIElement>;
}

export interface TimelineProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
  ref?: Ref<HTMLUListElement>;
}

const tones = sortCx({
  neutral: "bg-foreground-icon-quaternary",
  success: "bg-status-lime-text",
  warning: "bg-status-yellow-text",
  error: "bg-status-rose-text",
  info: "bg-status-blue-text",
});

export function Timeline({ className, ref, children, ...props }: TimelineProps) {
  return (
    <ul ref={ref} className={cx("flex flex-col", className)} {...props}>
      {children}
    </ul>
  );
}

export function TimelineItem({
  title,
  description,
  time,
  tone = "neutral",
  indicator,
  className,
  ref,
  ...props
}: TimelineItemProps) {
  return (
    <li
      ref={ref}
      className={cx(
        "relative flex gap-3 pb-5 last:pb-0",
        // Hide the rail on the final item (same idea as former last:before:hidden).
        "last:[&>[data-timeline-rail]]:hidden",
        className,
      )}
      {...props}
    >
      {/* Real rail — docs theme has no bg-border-secondary-* (transparent); separator works. */}
      <span
        data-timeline-rail
        aria-hidden
        className="pointer-events-none absolute start-[7px] top-5 bottom-0 w-px bg-separator-border"
      />
      <div className="relative z-10 flex w-4 shrink-0 justify-center">
        {indicator ?? (
          <span
            aria-hidden
            className={cx(
              "mt-1.5 size-2.5 rounded-full ring-4 ring-background-primary-default",
              tones[tone],
            )}
          />
        )}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-body-medium text-text-primary">{title}</div>
          {time ? (
            <time className="shrink-0 text-caption-1-regular text-text-tertiary">{time}</time>
          ) : null}
        </div>
        {description ? (
          <div className="mt-0.5 text-body-regular text-text-tertiary">{description}</div>
        ) : null}
      </div>
    </li>
  );
}
