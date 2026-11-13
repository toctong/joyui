"use client";

import { Textarea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";

export function TextareaSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-4", className)} role="group" aria-label="多行尺寸">
      <Textarea size="medium" label="中号" placeholder="补充说明…" rows={3} />
      <Textarea size="small" label="小号" placeholder="补充说明…" rows={3} />
    </div>
  );
}

export function TextareaAutoResizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-md", className)}>
      <Textarea
        label="反馈"
        placeholder="输入时自动增高…"
        autoResize
        maxRows={6}
        maxLength={120}
        showCount
        defaultValue="自动增高到 maxRows，再滚动。"
      />
    </div>
  );
}

export function TextareaFormScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">提交工单</p>
      <Textarea
        label="问题描述"
        hint="请描述复现步骤"
        placeholder="例如：打开设置页后…"
        rows={4}
        maxLength={280}
        showCount
      />
    </div>
  );
}
