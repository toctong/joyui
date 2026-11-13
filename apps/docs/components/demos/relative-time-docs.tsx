"use client";

import { RelativeTime } from "@/components/base/relative-time/relative-time";
import { cx } from "@/utils/cx";

export function RelativeTimeLocalePreview({ className }: { className?: string }) {
  const date = new Date(Date.now() - 1000 * 60 * 42);
  return (
    <div className={cx("flex flex-col items-center gap-3 text-body-regular text-text-primary", className)}>
      <RelativeTime date={date} locale="zh-CN" />
      <RelativeTime date={date} locale="en-US" />
      <RelativeTime date={Date.now() - 1000 * 60 * 60 * 26} locale="zh-CN" />
    </div>
  );
}
