"use client";

import { useState } from "react";
import { SlideToConfirm } from "@/components/base/slide-to-confirm/slide-to-confirm";
import { cx } from "@/utils/cx";

export function SlideToConfirmLabelsPreview({ className }: { className?: string }) {
  const [count, setCount] = useState(0);
  return (
    <div className={cx("flex w-full max-w-sm flex-col items-center gap-3", className)}>
      <SlideToConfirm
        label="滑动以发布"
        confirmedLabel="已发布"
        onConfirm={() => setCount((c) => c + 1)}
      />
      <p className="text-body-2-regular text-text-secondary">已确认 {count} 次</p>
    </div>
  );
}
