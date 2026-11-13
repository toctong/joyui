"use client";

import { useState } from "react";
import { Rating } from "@/components/base/rating/rating";
import { cx } from "@/utils/cx";

export function RatingSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-8", className)}
      role="group"
      aria-label="评分尺寸"
    >
      <div className="flex flex-col items-center gap-2">
        <Rating value={4} size="sm" aria-label="小尺寸评分" />
        <span className="text-caption-1-medium text-text-tertiary">sm · 4/5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Rating value={3.6} size="md" aria-label="中尺寸评分" />
        <span className="text-caption-1-medium text-text-tertiary">md · 四舍五入</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Rating value={4} max={7} size="md" aria-label="七星评分" />
        <span className="text-caption-1-medium text-text-tertiary">max=7</span>
      </div>
    </div>
  );
}

export function RatingInteractivePreview({ className }: { className?: string }) {
  const [value, setValue] = useState(3);
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <Rating
        interactive
        value={value}
        onChange={setValue}
        aria-label="可点选评分"
      />
      <p className="text-body-2-regular text-text-secondary">当前：{value} 星</p>
    </div>
  );
}

export function RatingReviewScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-medium text-text-primary">星际穿越</p>
        <Rating value={5} size="sm" aria-label="评分 5" />
      </div>
      <p className="text-body-2-regular text-text-secondary">
        视觉与配乐都很出色，适合大屏重温。
      </p>
    </div>
  );
}
