"use client";

import type { ReactNode } from "react";
import {
  RiBriefcaseLine,
  RiDashboardLine,
  RiFolder3Line,
  RiMailLine,
  RiMapPinLine,
  RiSettings4Line,
  RiUserLine,
} from "@remixicon/react";
import {
  DashboardSidebar,
  type DashboardNavItem,
} from "../dashboard/dashboard-sidebar";
import { StatCards } from "../dashboard/stat-cards";
import { AlertFeedCard } from "../profile-cards/alert-feed-card";
import { ProfileInfoCard } from "../profile-cards/profile-info-card";
import { WeekRangePill } from "../../base/week-range-pill/week-range-pill";
import { cx } from "../../../utils/cx";

export const WORKSPACE_NAV: DashboardNavItem[] = [
  { key: "home", label: "工作台", icon: RiDashboardLine, href: "#" },
  { key: "projects", label: "项目", icon: RiFolder3Line, href: "#" },
  { key: "people", label: "成员", icon: RiUserLine, href: "#" },
  { key: "settings", label: "设置", icon: RiSettings4Line, href: "#" },
];

export type WorkspaceTemplateProps = {
  className?: string;
  selected?: string;
  header?: ReactNode;
  profile?: ReactNode;
  feed?: ReactNode;
};

/**
 * Workspace dashboard: sidebar + stats + profile card + alert feed.
 */
export function WorkspaceTemplate({
  className,
  selected = "home",
  header,
  profile,
  feed,
}: WorkspaceTemplateProps = {}) {
  return (
    <div
      className={cx(
        "relative flex h-full min-h-[640px] w-full gap-4 overflow-hidden bg-background-full p-3",
        className,
      )}
    >
      <DashboardSidebar
        items={WORKSPACE_NAV}
        selected={selected}
        showThemeToggle
        className="flex"
      />

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className="flex w-full max-w-[1100px] flex-col gap-4 self-center px-1 pb-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-title-1-medium text-text-primary">工作台</h1>
              <p className="text-body-2-regular text-text-secondary">
                成员资料、本周动态与关键指标
              </p>
            </div>
            <WeekRangePill label="本周" />
            {header}
          </header>

          <StatCards />

          <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
            {profile ?? (
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
            )}
            {feed ?? <AlertFeedCard />}
          </div>
        </div>
      </main>
    </div>
  );
}
