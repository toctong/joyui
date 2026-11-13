"use client";

import { RiFolderOpenLine, RiInbox2Line } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { EmptyState } from "@/components/base/empty-state/empty-state";
import { cx } from "@/utils/cx";

export function EmptyStateSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("grid w-full max-w-3xl gap-6 md:grid-cols-2", className)}
      role="group"
      aria-label="空状态尺寸"
    >
      <div className="rounded-2xl border border-separator-border bg-background-primary-default">
        <EmptyState
          size="sm"
          icon={RiFolderOpenLine}
          title="暂无日志"
          description="表格内紧凑空态（sm）。"
        />
        <p className="border-t border-separator-border px-4 py-2 text-center text-caption-1-medium text-text-tertiary">
          sm
        </p>
      </div>
      <div className="rounded-2xl border border-separator-border bg-background-primary-default">
        <EmptyState
          size="md"
          icon={RiInbox2Line}
          title="暂无转存"
          description="页面级默认空态（md）。"
        />
        <p className="border-t border-separator-border px-4 py-2 text-center text-caption-1-medium text-text-tertiary">
          md
        </p>
      </div>
    </div>
  );
}

export function EmptyStateActionPreview({ className }: { className?: string }) {
  return (
    <EmptyState
      className={cx("max-w-md", className)}
      title="还没有任务"
      description="在设置中添加 Quark Cookie，然后创建第一个转存任务。"
      action={
        <Button size="small" variant="secondary">
          打开设置
        </Button>
      }
    />
  );
}
