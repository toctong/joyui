"use client";

import { ProgressBar, ProgressCircle } from "@/components/base/progress/progress";
import { cx } from "@/utils/cx";

const SIZES = [
  { id: "sm" as const, label: "sm" },
  { id: "md" as const, label: "md" },
  { id: "lg" as const, label: "lg" },
] as const;

export function ProgressSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-5", className)} role="group" aria-label="进度条尺寸">
      {SIZES.map((s) => (
        <ProgressBar key={s.id} label={`上传 · ${s.label}`} value={64} size={s.id} />
      ))}
    </div>
  );
}

export function ProgressModePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-lg flex-col items-stretch gap-6", className)}>
      <ProgressBar label="准备导出" isIndeterminate description="正在打包文件…" />
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <ProgressCircle value={72} aria-label="上传进度 72%" size="lg" />
          <span className="text-caption-1-medium text-text-tertiary">环形 72%</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ProgressCircle isIndeterminate aria-label="加载中" size="lg" />
          <span className="text-caption-1-medium text-text-tertiary">不确定</span>
        </div>
      </div>
    </div>
  );
}

export function ProgressUploadScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-medium text-text-primary">季度报告.pdf</p>
        <ProgressCircle value={48} aria-label="上传 48%" size="sm" />
      </div>
      <ProgressBar label="上传中" value={48} size="sm" description="约剩余 12 秒" />
    </div>
  );
}
