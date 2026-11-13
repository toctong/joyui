"use client";

import { parseDate } from "@internationalized/date";
import {
  DateCalendar,
  DateRangeCalendar,
} from "@/components/base/date-picker/date-calendar";
import { cx } from "@/utils/cx";

export function DateCalendarSinglePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex justify-center", className)}>
      <DateCalendar
        aria-label="交货日期"
        defaultValue={parseDate("2026-11-13")}
        showToday
      />
    </div>
  );
}

export function DateCalendarRangePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex justify-center", className)}>
      <DateRangeCalendar
        aria-label="入住区间"
        defaultValue={{
          start: parseDate("2026-11-10"),
          end: parseDate("2026-11-16"),
        }}
        visibleMonths={2}
      />
    </div>
  );
}

export function DateCalendarBookingScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-body-medium text-text-primary">选择入住日期</p>
        <p className="text-caption-1-medium text-text-tertiary">单月视图，适合移动端表单。</p>
      </div>
      <DateRangeCalendar
        aria-label="入住区间"
        visibleMonths={1}
        defaultValue={{
          start: parseDate("2026-11-20"),
          end: parseDate("2026-11-23"),
        }}
      />
    </div>
  );
}
