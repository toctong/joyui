"use client";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { PageHeader } from "@/components/base/page-header/page-header";
import { cx } from "@/utils/cx";

export function PageHeaderActionsPreview({ className }: { className?: string }) {
  return (
    <PageHeader
      className={cx("w-full", className)}
      title="任务"
      description="自动转存、命名规则与进度"
      actions={
        <>
          <Input aria-label="搜索任务" placeholder="搜索任务" className="w-40" />
          <Button size="small">新建任务</Button>
        </>
      }
    />
  );
}

export function PageHeaderMinimalPreview({ className }: { className?: string }) {
  return (
    <PageHeader
      className={cx("w-full", className)}
      title="设置"
      description="账号、插件与通知偏好"
    />
  );
}
