"use client";

import { Notification } from "@/components/base/notification/notification";
import { cx } from "@/utils/cx";

export function NotificationStatusPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-3", className)} role="group" aria-label="通知状态">
      <Notification
        status="information"
        title="同步已开始"
        description="正在拉取最新剧集元数据。"
        timestamp="刚刚"
        dismissible={false}
      />
      <Notification
        status="success"
        title="转存完成"
        description="《星际穿越》已写入目标目录。"
        timestamp="2 分钟前"
        dismissible={false}
      />
      <Notification
        status="error"
        title="Cookie 失效"
        description="请重新登录后重试。"
        timestamp="5 分钟前"
        dismissible={false}
      />
    </div>
  );
}

export function NotificationActionPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-3", className)}>
      <Notification
        status="neutral"
        title="林晓 评论了你的任务"
        description="命名规则可以再紧一点。"
        timestamp="10 分钟前"
        avatar={{ initials: "林", color: "lime" }}
        actions={[
          { label: "查看", variant: "secondary" },
          { label: "忽略", variant: "ghost" },
        ]}
        dismissible={false}
      />
      <Notification
        status="error"
        title="磁盘空间不足"
        description="剩余不足 5 GB，部分任务已暂停。"
        timestamp="刚刚"
        actions={[{ label: "清理空间", variant: "primary" }]}
        dismissible={false}
      />
    </div>
  );
}
