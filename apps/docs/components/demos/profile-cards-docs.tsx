"use client";

import {
  RiBriefcaseLine,
  RiCheckboxCircleFill,
  RiFolder3Line,
  RiGitCommitLine,
  RiMailLine,
  RiMapPinLine,
  RiUserLine,
} from "@remixicon/react";
import { AlertFeedCard } from "@/components/application/profile-cards/alert-feed-card";
import { ProfileInfoCard } from "@/components/application/profile-cards/profile-info-card";
import { WeekRangePill } from "@/components/base/week-range-pill/week-range-pill";
import { cx } from "@/utils/cx";

export function ProfileCardsHrPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "grid w-full max-w-3xl gap-4 sm:grid-cols-[220px_minmax(0,1fr)]",
        className,
      )}
    >
      <ProfileInfoCard
        name="Alex Chen"
        initials="AC"
        details={[
          { icon: RiUserLine, label: "角色", value: "产品设计师" },
          { icon: RiBriefcaseLine, label: "团队", value: "Growth" },
          { icon: RiMailLine, label: "邮箱", value: "alex@joyui.dev" },
          { icon: RiMapPinLine, label: "地点", value: "上海" },
        ]}
      />
      <AlertFeedCard />
    </div>
  );
}

export function ProfileCardsProjectPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-xl flex-col gap-4", className)}>
      <WeekRangePill label="Sprint 14" />
      <AlertFeedCard
        title="项目动态"
        count={5}
        countLabel="本迭代"
        rangeLabel="Sprint 14"
        items={[
          {
            icon: RiGitCommitLine,
            iconBg: "bg-chart-6",
            title: "合并 PR #482",
            description: "Composer 边框修复已合入 main。",
            date: "今天",
          },
          {
            icon: RiFolder3Line,
            iconBg: "bg-chart-5",
            title: "新建里程碑",
            description: "Q2 模板画廊目标已写入路线图。",
            date: "昨天",
          },
          {
            icon: RiCheckboxCircleFill,
            iconBg: "bg-chart-7-active",
            title: "评审通过",
            description: "档案卡片改名与 props 化已获设计确认。",
            date: "周一",
          },
        ]}
      />
    </div>
  );
}
