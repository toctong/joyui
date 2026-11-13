"use client";

import { DotLoader } from "@/components/base/dot-loader/dot-loader";
import { cx } from "@/utils/cx";

export function DotLoaderSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-end justify-center gap-8", className)} role="group" aria-label="点加载尺寸">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <DotLoader size={size} aria-label={`加载中 ${size}`} />
          <span className="text-caption-1-medium text-text-tertiary">{size}</span>
        </div>
      ))}
    </div>
  );
}
