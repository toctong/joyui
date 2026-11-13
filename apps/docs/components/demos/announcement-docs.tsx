"use client";

import { RiSparklingFill } from "@remixicon/react";
import { Announcement } from "@/components/base/announcement/announcement";
import { cx } from "@/utils/cx";

export function AnnouncementActionPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-[236px]", className)}>
      <Announcement
        title="新功能"
        description="智能体技能已上线。"
        actionLabel="立即查看"
        dismissible
      />
    </div>
  );
}

export function AnnouncementIconPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-[236px]", className)}>
      <Announcement
        title="试用 Pro"
        description="解锁更多模板与图表。"
        icon={RiSparklingFill}
        actionLabel="升级"
      />
    </div>
  );
}

export function AnnouncementSidebarScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-[260px] flex-col gap-3 rounded-2xl border border-separator-border bg-background-secondary-default p-3",
        className,
      )}
    >
      <p className="px-1 text-caption-1-medium text-text-tertiary">侧栏页脚</p>
      <Announcement
        title="完成设置"
        description="添加第一个工作区成员。"
        actionLabel="邀请同事"
        dismissible
        closeLabel="关闭公告"
      />
    </div>
  );
}
