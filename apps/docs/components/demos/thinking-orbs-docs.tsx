"use client";

import { ThinkingOrbs } from "@/components/base/thinking-orbs/thinking-orbs";
import { cx } from "@/utils/cx";

export function ThinkingOrbsSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-end justify-center gap-8", className)} role="group" aria-label="思考球尺寸">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ThinkingOrbs size={size} aria-label={`思考中 ${size}`} />
          <span className="text-caption-1-medium text-text-tertiary">{size}</span>
        </div>
      ))}
    </div>
  );
}
