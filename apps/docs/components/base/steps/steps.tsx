import type { HTMLAttributes, ReactNode, Ref } from "react";
import { RiCheckLine } from "@remixicon/react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Horizontal or vertical multi-step indicator for wizards and onboarding.
 * Controlled via `current` (0-based). Completed steps use the primary button token.
 */

export type StepsOrientation = "horizontal" | "vertical";

export type StepItem = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
};

export interface StepsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  steps: readonly StepItem[];
  /** Active step index (0-based). */
  current?: number;
  orientation?: StepsOrientation;
  ref?: Ref<HTMLElement>;
}

const styles = sortCx({
  list: {
    horizontal: "flex w-full items-start gap-0",
    vertical: "flex flex-col gap-0",
  },
  item: {
    horizontal: "relative flex min-w-0 flex-1 flex-col items-center gap-2 text-center",
    vertical: "relative flex gap-3 pb-6 last:pb-0",
  },
  connector: {
    // Real rail — docs theme has no bg-border-secondary-* (transparent); separator works.
    horizontal:
      "absolute start-[calc(50%+14px)] end-[calc(-50%+14px)] top-3.5 h-px bg-separator-border",
    vertical: "absolute start-[13px] top-8 bottom-0 w-px bg-separator-border",
  },
  connectorDone: "bg-button-primary",
  marker:
    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-caption-1-semibold",
  markerTodo:
    "border-border-secondary-default bg-background-primary-default text-text-tertiary",
  markerCurrent: "border-button-primary bg-button-primary text-text-white",
  markerDone:
    "border-button-primary bg-background-secondary-default text-text-brand-primary",
});

export function Steps({
  steps,
  current = 0,
  orientation = "horizontal",
  className,
  ref,
  ...props
}: StepsProps) {
  return (
    <nav ref={ref} aria-label="Progress" className={cx("w-full", className)} {...props}>
      <ol className={styles.list[orientation]}>
        {steps.map((step, index) => {
          const state =
            index < current ? "done" : index === current ? "current" : "todo";
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.id ?? String(index)}
              className={styles.item[orientation]}
              aria-current={state === "current" ? "step" : undefined}
            >
              {!isLast ? (
                <span
                  aria-hidden
                  className={cx(
                    styles.connector[orientation],
                    state === "done" && styles.connectorDone,
                  )}
                />
              ) : null}
              <span
                className={cx(
                  styles.marker,
                  state === "todo" && styles.markerTodo,
                  state === "current" && styles.markerCurrent,
                  state === "done" && styles.markerDone,
                )}
              >
                {state === "done" ? (
                  <RiCheckLine className="size-3.5" aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              <div className={cx(orientation === "horizontal" && "px-1", "min-w-0")}>
                <div className="truncate text-body-medium text-text-primary">{step.title}</div>
                {step.description ? (
                  <div className="mt-0.5 text-caption-1-regular text-text-tertiary">
                    {step.description}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
