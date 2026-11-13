"use client";

import { CopyButton } from "@/components/base/copy-button/copy-button";
import { cx } from "@/utils/cx";

export function CopyButtonSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center gap-3", className)}
      role="group"
      aria-label="复制按钮尺寸"
    >
      <CopyButton value="https://www.joyui.top" size="small" aria-label="复制 small" />
      <CopyButton value="https://www.joyui.top" size="medium" aria-label="复制 medium" />
    </div>
  );
}
