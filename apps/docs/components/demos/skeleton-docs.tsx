"use client";

import { Skeleton, SkeletonText } from "@/components/base/skeleton/skeleton";
import { cx } from "@/utils/cx";

export function SkeletonShapePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-8", className)}
      role="group"
      aria-label="骨架形状"
    >
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="rect" className="h-16 w-28" />
        <span className="text-caption-1-medium text-text-tertiary">rect</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="circle" className="size-12" />
        <span className="text-caption-1-medium text-text-tertiary">circle</span>
      </div>
      <div className="flex w-40 flex-col items-center gap-2">
        <Skeleton shape="text" className="h-3.5 w-full" />
        <span className="text-caption-1-medium text-text-tertiary">text</span>
      </div>
    </div>
  );
}

export function SkeletonTextPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-6", className)} role="group" aria-label="文本骨架">
      <SkeletonText lines={2} />
      <SkeletonText lines={4} />
    </div>
  );
}

export function SkeletonCardScenario({ className }: { className?: string }) {
  return (
    <div
      aria-busy
      className={cx(
        "flex w-full max-w-sm gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <Skeleton shape="circle" className="size-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <Skeleton shape="text" className="mb-2 h-4 w-2/3" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
