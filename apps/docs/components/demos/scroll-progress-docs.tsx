"use client";

import { useRef } from "react";
import { ScrollProgress } from "@/components/base/scroll-progress/scroll-progress";
import { cx } from "@/utils/cx";

export function ScrollProgressDemo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={cx("relative w-full max-w-md overflow-hidden rounded-2xl border border-separator-border", className)}>
      <ScrollProgress target={ref} height={3} className="sticky top-0 z-10" />
      <div ref={ref} className="max-h-48 overflow-y-auto p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="mb-3 text-body-regular text-text-secondary">
            滚动段落 {i + 1} — 观察顶部进度条随内容推进。
          </p>
        ))}
      </div>
    </div>
  );
}
