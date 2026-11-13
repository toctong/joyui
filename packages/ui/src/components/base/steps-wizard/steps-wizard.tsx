"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Button } from "../buttons/button";
import { Steps, type StepItem } from "../steps/steps";
import { cx } from "../../../utils/cx";

/**
 * Wizard shell around Steps — header indicator, content panel, prev/next footer.
 *
 *   <StepsWizard
 *     steps={[{ title: "账号" }, { title: "片源" }, { title: "完成" }]}
 *     current={current}
 *     onCurrentChange={setCurrent}
 *   >
 *     {panels[current]}
 *   </StepsWizard>
 */

export interface StepsWizardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  steps: readonly StepItem[];
  /** Active step index (0-based). */
  current?: number;
  onCurrentChange?: (index: number) => void;
  /** Content for the active step. */
  children?: ReactNode;
  /** Hide the default footer (e.g. custom actions). */
  hideFooter?: boolean;
  backLabel?: ReactNode;
  nextLabel?: ReactNode;
  finishLabel?: ReactNode;
  /** Called when advancing past the last step (Finish). */
  onFinish?: () => void;
  /** Disable Next / Finish. */
  nextDisabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function StepsWizard({
  steps,
  current = 0,
  onCurrentChange,
  children,
  hideFooter = false,
  backLabel = "上一步",
  nextLabel = "下一步",
  finishLabel = "完成",
  onFinish,
  nextDisabled = false,
  className,
  ref,
  ...props
}: StepsWizardProps) {
  const last = Math.max(steps.length - 1, 0);
  const index = Math.min(Math.max(current, 0), last);
  const isFirst = index <= 0;
  const isLast = index >= last;

  const goBack = () => {
    if (!isFirst) onCurrentChange?.(index - 1);
  };

  const goNext = () => {
    if (isLast) {
      onFinish?.();
      return;
    }
    onCurrentChange?.(index + 1);
  };

  return (
    <div
      ref={ref}
      className={cx(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-separator-border bg-background-primary-default shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="border-b border-separator-border px-5 py-4">
        <Steps steps={steps} current={index} orientation="horizontal" />
      </div>
      <div className="min-h-40 flex-1 px-5 py-5">{children}</div>
      {hideFooter ? null : (
        <div className="flex items-center justify-between gap-3 border-t border-separator-border bg-background-secondary-default px-5 py-3">
          <Button variant="ghost" size="small" onClick={goBack} disabled={isFirst}>
            {backLabel}
          </Button>
          <Button size="small" onClick={goNext} disabled={nextDisabled}>
            {isLast ? finishLabel : nextLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
