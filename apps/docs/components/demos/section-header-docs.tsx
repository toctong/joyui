"use client";

import { Button } from "@/components/base/buttons/button";
import { SectionHeader } from "@/components/base/section-header/section-header";
import { cx } from "@/utils/cx";

export function SectionHeaderLevelPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-lg flex-col gap-6", className)}>
      <SectionHeader level={2} title="概览" description="本周转存与失败重试" />
      <SectionHeader level={3} title="配额" description="剩余空间与速率" />
      <SectionHeader level={4} title="明细" />
    </div>
  );
}

export function SectionHeaderActionsPreview({ className }: { className?: string }) {
  return (
    <SectionHeader
      className={cx("w-full max-w-lg", className)}
      title="最近任务"
      description="按更新时间排序"
      actions={<Button size="small" variant="secondary">查看全部</Button>}
    />
  );
}
