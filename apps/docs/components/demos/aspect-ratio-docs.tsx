"use client";

import { AspectRatio } from "@/components/base/aspect-ratio/aspect-ratio";
import { cx } from "@/utils/cx";

export function AspectRatioPresetPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("grid w-full max-w-lg grid-cols-2 gap-4", className)}
      role="group"
      aria-label="宽高比预设"
    >
      <AspectRatio ratio={16 / 9} className="rounded-2xl bg-background-secondary-default">
        <div className="flex size-full items-center justify-center text-caption-1-medium text-text-secondary">
          16:9
        </div>
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded-2xl bg-background-secondary-default">
        <div className="flex size-full items-center justify-center text-caption-1-medium text-text-secondary">
          1:1
        </div>
      </AspectRatio>
      <AspectRatio ratio={4 / 3} className="rounded-2xl bg-background-secondary-default">
        <div className="flex size-full items-center justify-center text-caption-1-medium text-text-secondary">
          4:3
        </div>
      </AspectRatio>
      <AspectRatio ratio={2 / 3} className="rounded-2xl bg-background-secondary-default">
        <div className="flex size-full items-center justify-center text-caption-1-medium text-text-secondary">
          2:3
        </div>
      </AspectRatio>
    </div>
  );
}

export function AspectRatioMediaScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-separator-border bg-background-primary-default p-3 shadow-xs",
        className,
      )}
    >
      <AspectRatio ratio={16 / 9} className="rounded-xl bg-background-secondary-default">
        <div className="flex size-full items-center justify-center text-body-2-regular text-text-tertiary">
          封面占位
        </div>
      </AspectRatio>
      <p className="px-1 text-body-medium text-text-primary">产品发布会回放</p>
      <p className="px-1 text-caption-1-medium text-text-secondary">锁定 16:9，避免布局跳动</p>
    </div>
  );
}
