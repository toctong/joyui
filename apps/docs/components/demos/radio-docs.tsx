"use client";

import { Radio, RadioGroup } from "@/components/base/radio/radio";
import { RadioCard } from "@/components/base/radio/radio-card";
import { cx } from "@/utils/cx";

export function RadioSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-start justify-center gap-10", className)}>
      <RadioGroup defaultValue="a" aria-label="中号单选" className="gap-2">
        <Radio value="a" size="md">
          标准 md
        </Radio>
        <Radio value="b" size="md">
          备选
        </Radio>
      </RadioGroup>
      <RadioGroup defaultValue="a" aria-label="小号单选" className="gap-2">
        <Radio value="a" size="sm">
          紧凑 sm
        </Radio>
        <Radio value="b" size="sm">
          备选
        </Radio>
      </RadioGroup>
    </div>
  );
}

export function RadioCardScenario({ className }: { className?: string }) {
  return (
    <RadioGroup
      defaultValue="balanced"
      aria-label="命名策略"
      className={cx("grid w-full max-w-md gap-2", className)}
    >
      <RadioCard
        value="balanced"
        title="智能命名"
        description="优先剧集元数据，其次文件名"
      />
      <RadioCard value="keep" title="保留原名" description="不做重命名" />
      <RadioCard
        value="template"
        title="自定义模板"
        description="使用 {title}.{year} 等占位符"
      />
    </RadioGroup>
  );
}
