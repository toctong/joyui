"use client";

import { Kbd } from "@/components/base/kbd/kbd";
import { cx } from "@/utils/cx";

export function KbdComboPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-6", className)}
      role="group"
      aria-label="快捷键组合"
    >
      <div className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
      <div className="flex items-center gap-1">
        <Kbd>Ctrl</Kbd>
        <span className="text-caption-1-medium text-text-tertiary">+</span>
        <Kbd>Shift</Kbd>
        <span className="text-caption-1-medium text-text-tertiary">+</span>
        <Kbd>P</Kbd>
      </div>
      <Kbd>Esc</Kbd>
    </div>
  );
}

export function KbdSearchScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 shadow-xs",
        className,
      )}
    >
      <span className="text-body-2-regular text-text-tertiary">快速搜索…</span>
      <span className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </div>
  );
}
