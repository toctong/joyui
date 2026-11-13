import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Horizontal process rail — steps across a workflow (onboarding, transfer
 * pipeline, approval chain). Pair with TimelineHorizontalItem.
 *
 *   <TimelineHorizontal aria-label="转存进度">
 *     <TimelineHorizontalItem title="创建" tone="success" />
 *     <TimelineHorizontalItem title="转存中" tone="info" />
 *     <TimelineHorizontalItem title="完成" />
 *   </TimelineHorizontal>
 */

export type TimelineHorizontalItemTone =
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info";

export type TimelineHorizontalItemStatus = "complete" | "current" | "upcoming";

export interface TimelineHorizontalItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  tone?: TimelineHorizontalItemTone;
  /** Visual weight: completed, active, or upcoming. Default inferred from tone. */
  status?: TimelineHorizontalItemStatus;
  /** Leading glyph; defaults to a filled / ringed dot. */
  indicator?: ReactNode;
  ref?: Ref<HTMLLIElement>;
}

export interface TimelineHorizontalProps extends HTMLAttributes<HTMLOListElement> {
  children?: ReactNode;
  ref?: Ref<HTMLOListElement>;
}

const tones = sortCx({
  neutral: "bg-foreground-icon-quaternary",
  success: "bg-status-lime-text",
  warning: "bg-status-yellow-text",
  error: "bg-status-rose-text",
  info: "bg-status-blue-text",
});

const ringByStatus = sortCx({
  complete: "ring-4 ring-background-primary-default",
  current: "ring-4 ring-status-blue-background",
  upcoming: "ring-4 ring-background-primary-default",
});

function resolveStatus(
  status: TimelineHorizontalItemStatus | undefined,
  tone: TimelineHorizontalItemTone,
): TimelineHorizontalItemStatus {
  if (status) return status;
  if (tone === "success") return "complete";
  if (tone === "info" || tone === "warning" || tone === "error") return "current";
  return "upcoming";
}

export function TimelineHorizontal({
  className,
  ref,
  children,
  ...props
}: TimelineHorizontalProps) {
  return (
    <ol
      ref={ref}
      className={cx("flex w-full list-none items-start gap-0 p-0", className)}
      {...props}
    >
      {children}
    </ol>
  );
}

export function TimelineHorizontalItem({
  title,
  description,
  tone = "neutral",
  status,
  indicator,
  className,
  ref,
  ...props
}: TimelineHorizontalItemProps) {
  const resolved = resolveStatus(status, tone);
  const upcoming = resolved === "upcoming";

  return (
    <li
      ref={ref}
      className={cx(
        "relative flex min-w-0 flex-1 flex-col items-center text-center",
        "last:[&>[data-timeline-rail]]:hidden",
        className,
      )}
      data-status={resolved}
      {...props}
    >
      {/* Real rail — `after:bg-border-secondary-*` is transparent in docs theme. */}
      <span
        data-timeline-rail
        aria-hidden
        className="pointer-events-none absolute start-[calc(50%+10px)] end-[calc(-50%+10px)] top-[11px] h-px bg-separator-border"
      />
      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
        {indicator ?? (
          <span
            aria-hidden
            className={cx(
              "size-2.5 rounded-full",
              ringByStatus[resolved],
              upcoming ? "bg-background-tertiary-default" : tones[tone],
            )}
          />
        )}
      </div>
      <div className="mt-2 min-w-0 px-1">
        <div
          className={cx(
            "text-body-medium",
            upcoming ? "text-text-tertiary" : "text-text-primary",
          )}
        >
          {title}
        </div>
        {description ? (
          <div className="mt-0.5 text-caption-1-regular text-text-tertiary">{description}</div>
        ) : null}
      </div>
    </li>
  );
}
