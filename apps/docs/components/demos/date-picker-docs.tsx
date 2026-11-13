"use client";

import { parseDate } from "@internationalized/date";
import { DatePicker } from "@/components/base/date-picker/date-picker";
import { DateRangePicker } from "@/components/base/date-picker/date-range-picker";
import { cx } from "@/utils/cx";

export function DatePickerSinglePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-4", className)}>
      <DatePicker aria-label="开始日期" defaultValue={parseDate("2026-11-13")} />
      <DatePicker aria-label="禁用" isDisabled defaultValue={parseDate("2026-11-01")} />
    </div>
  );
}

export function DatePickerRangePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex justify-center", className)}>
      <DateRangePicker
        aria-label="活动区间"
        placeholder="选择日期区间"
        defaultValue={{
          start: parseDate("2026-11-10"),
          end: parseDate("2026-11-16"),
        }}
      />
    </div>
  );
}

export function DatePickerFilterScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">报表筛选</p>
      <div className="flex flex-wrap items-center gap-3">
        <DatePicker aria-label="起始日" defaultValue={parseDate("2026-11-01")} />
        <span className="text-body-regular text-text-tertiary">至</span>
        <DatePicker aria-label="结束日" defaultValue={parseDate("2026-11-30")} />
      </div>
    </div>
  );
}
