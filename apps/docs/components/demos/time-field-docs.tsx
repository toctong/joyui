"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/components/base/time-field/time-field";
import { cx } from "@/utils/cx";

export function TimeFieldSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("grid w-full max-w-md gap-6", className)}
      role="group"
      aria-label="时间输入尺寸"
    >
      <TimeField
        label="开始时间"
        size="medium"
        defaultValue={new Time(9, 30)}
        aria-label="开始时间 medium"
      />
      <TimeField
        label="开始时间"
        size="small"
        defaultValue={new Time(9, 30)}
        aria-label="开始时间 small"
      />
    </div>
  );
}

export function TimeFieldFormatPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-6", className)}>
      <TimeField
        label="24 小时制"
        hourCycle={24}
        defaultValue={new Time(14, 5)}
        aria-label="24 小时制"
      />
      <TimeField
        label="含秒"
        hourCycle={24}
        granularity="second"
        defaultValue={new Time(14, 5, 30)}
        aria-label="含秒"
      />
    </div>
  );
}

export function TimeFieldFormScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">会议时间</p>
      <TimeField
        label="开始"
        hint="按段输入时、分；方向键可微调。"
        defaultValue={new Time(10, 0)}
        aria-label="会议开始"
      />
      <TimeField
        label="结束"
        hourCycle={24}
        defaultValue={new Time(11, 30)}
        aria-label="会议结束"
      />
    </div>
  );
}
