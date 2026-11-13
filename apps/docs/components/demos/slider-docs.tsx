"use client";

import { RangeSlider, Slider } from "@/components/base/slider/slider";
import { cx } from "@/utils/cx";

export function SliderValuePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-6", className)} role="group" aria-label="单值滑块">
      <Slider label="音量" defaultValue={40} thumbLabel="音量" />
      <Slider label="不显示气泡" defaultValue={25} showTooltip={false} thumbLabel="不透明度" />
    </div>
  );
}

export function SliderRangePreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-md", className)}>
      <RangeSlider
        label="价格区间"
        defaultValue={[20, 80]}
        thumbLabels={["最低价", "最高价"]}
        formatValue={(v) => `¥${v}`}
      />
    </div>
  );
}

export function SliderFilterScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">筛选条件</p>
      <RangeSlider
        label="预算"
        defaultValue={[30, 70]}
        minValue={0}
        maxValue={100}
        thumbLabels={["最低", "最高"]}
        formatValue={(v) => `¥${v * 10}`}
      />
    </div>
  );
}
