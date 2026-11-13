"use client";

import { Spinner } from "@/components/base/spinner/spinner";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const SIZES = [
  { id: "xs" as const, label: "xs" },
  { id: "sm" as const, label: "sm" },
  { id: "md" as const, label: "md" },
  { id: "lg" as const, label: "lg" },
  { id: "xl" as const, label: "xl" },
] as const;

export function SpinnerSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-6", className)}
      role="group"
      aria-label="加载指示尺寸"
    >
      {SIZES.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-2">
          <Spinner size={s.id} aria-label={`加载 ${s.label}`} />
          <span className="text-caption-1-medium text-text-tertiary">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SpinnerTrackPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-8", className)}
      role="group"
      aria-label="轨道开关"
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" track aria-label="带轨道" />
        <span className="text-caption-1-medium text-text-tertiary">track</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" track={false} aria-label="无轨道" />
        <span className="text-caption-1-medium text-text-tertiary">track=false</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl bg-accent-500 p-4">
        <Spinner size="md" className="text-white" aria-label="浅色" />
        <span className="text-caption-1-medium text-white/80">text-white</span>
      </div>
    </div>
  );
}

export function SpinnerButtonScenario({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-3", className)}>
      <Button isDisabled className="gap-2">
        <Spinner size="sm" className="text-white" aria-hidden />
        提交中…
      </Button>
      <div className="flex items-center gap-2 text-body-medium text-text-secondary">
        <Spinner size="sm" aria-hidden />
        正在同步数据
      </div>
    </div>
  );
}
