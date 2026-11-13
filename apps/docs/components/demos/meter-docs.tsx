"use client";

import { Meter } from "@/components/base/meter/meter";
import { cx } from "@/utils/cx";

export function MeterTonePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-4", className)}>
      <Meter label="品牌" value={72} tone="accent" />
      <Meter label="成功" value={88} tone="success" />
      <Meter label="警告" value={54} tone="warning" />
      <Meter label="错误" value={28} tone="error" />
    </div>
  );
}

export function MeterSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-4", className)}>
      <Meter label="小" value={40} size="sm" description="紧凑进度" />
      <Meter label="中" value={65} size="md" showValueLabel />
    </div>
  );
}
