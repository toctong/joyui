"use client";

import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { cx } from "@/utils/cx";

export function ThemeToggleAppearancePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-8", className)}
      role="group"
      aria-label="主题切换外观"
    >
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle appearance="sidebar" />
        <span className="text-caption-1-medium text-text-tertiary">sidebar</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle appearance="segmented" />
        <span className="text-caption-1-medium text-text-tertiary">segmented</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-background-secondary-default px-4 py-3">
        <ThemeToggle appearance="glass-segmented" />
        <span className="text-caption-1-medium text-text-tertiary">glass-segmented</span>
      </div>
    </div>
  );
}

export function ThemeToggleSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-8", className)}
      role="group"
      aria-label="主题切换尺寸"
    >
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle appearance="segmented" size="medium" />
        <span className="text-caption-1-medium text-text-tertiary">medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle appearance="segmented" size="small" />
        <span className="text-caption-1-medium text-text-tertiary">small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle collapsed />
        <span className="text-caption-1-medium text-text-tertiary">collapsed</span>
      </div>
    </div>
  );
}

export function ThemeToggleSidebarScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-xs items-center justify-between gap-3 rounded-2xl border border-separator-border bg-background-primary-default px-4 py-3 shadow-xs",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-body-medium text-text-primary">外观</p>
        <p className="text-caption-1-medium text-text-tertiary">仅手动切换，不跟随系统。</p>
      </div>
      <ThemeToggle appearance="sidebar-segmented" size="small" />
    </div>
  );
}
