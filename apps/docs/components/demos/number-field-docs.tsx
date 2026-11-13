"use client";

import { NumberField } from "@/components/base/number-field/number-field";
import { cx } from "@/utils/cx";

export function NumberFieldSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-xs gap-4", className)} role="group" aria-label="数字尺寸">
      <NumberField label="席位 · medium" defaultValue={5} minValue={1} maxValue={50} size="medium" />
      <NumberField label="席位 · small" defaultValue={5} minValue={1} maxValue={50} size="small" />
    </div>
  );
}

export function NumberFieldFormatPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-xs gap-4", className)} role="group" aria-label="数字格式">
      <NumberField
        label="价格"
        defaultValue={49}
        minValue={0}
        formatOptions={{ style: "currency", currency: "CNY" }}
      />
      <NumberField
        label="税率"
        defaultValue={0.08}
        minValue={0}
        maxValue={1}
        step={0.01}
        formatOptions={{ style: "percent" }}
      />
      <NumberField label="无步进器" defaultValue={12} hideSteppers />
    </div>
  );
}

export function NumberFieldCartScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center justify-between gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-body-medium text-text-primary">无线鼠标</p>
        <p className="text-caption-1-medium text-text-secondary">库存充足</p>
      </div>
      <NumberField
        aria-label="数量"
        defaultValue={2}
        minValue={1}
        maxValue={99}
        size="small"
        className="w-28"
      />
    </div>
  );
}
