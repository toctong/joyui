"use client";

import { TextShimmer } from "@/components/base/text-shimmer/text-shimmer";
import { cx } from "@/utils/cx";

export function TextShimmerSpeedPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-4 text-title-3-medium", className)}>
      <TextShimmer duration={1.6}>生成中…</TextShimmer>
      <TextShimmer duration={3.2}>思考下一步</TextShimmer>
    </div>
  );
}
