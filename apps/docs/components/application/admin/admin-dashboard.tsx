"use client";

import type { ReactNode } from "react";
import {
  RiAddFill,
  RiBarChartBoxLine,
  RiDashboardLine,
  RiFileList3Line,
  RiFilter3Fill,
  RiGroupLine,
  RiSettings4Line,
  RiShoppingBag3Line,
} from "@remixicon/react";

import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/application/dashboard/dashboard-sidebar";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { DataTableExample } from "@/components/application/data-table/data-table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/** Admin console navigation — overview through settings. */
export const ADMIN_NAV: DashboardNavItem[] = [
  { key: "overview", label: "概览", icon: RiDashboardLine, href: "#" },
  { key: "users", label: "用户", icon: RiGroupLine, href: "#", badge: 24 },
  { key: "orders", label: "订单", icon: RiShoppingBag3Line, href: "#" },
  { key: "content", label: "内容", icon: RiFileList3Line, href: "#" },
  { key: "reports", label: "报表", icon: RiBarChartBoxLine, href: "#" },
  { key: "settings", label: "设置", icon: RiSettings4Line, href: "#" },
];

/**
 * JoyUI 后台管理模板：浮动侧栏 + 顶栏操作 + KPI + 图表 + 数据表。
 * 组装自现有 JoyUI 组件，可直接替换导航、文案与数据源。
 */
export function AdminDashboard({
  className,
  selected = "overview",
  headerActions,
}: {
  className?: string;
  selected?: string;
  headerActions?: ReactNode;
} = {}) {
  return (
    <div
      className={cx(
        "relative flex h-full min-h-[640px] w-full gap-4 overflow-hidden bg-background-full p-3",
        className,
      )}
    >
      <DashboardSidebar
        items={ADMIN_NAV}
        selected={selected}
        className="flex"
      />

      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">
          <header className="flex w-full flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="blue" initials="J" />
                JoyUI
              </BreadcrumbItem>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="neutral" initials="运" />
                运营空间
              </BreadcrumbItem>
              <BreadcrumbItem current icon={RiDashboardLine}>
                概览
              </BreadcrumbItem>
            </Breadcrumb>

            <div className="flex w-full flex-wrap items-end justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">
                  运营概览
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                {headerActions ?? (
                  <>
                    <NotificationBell />
                    <Button
                      variant="secondary"
                      size="medium"
                      leadingIcon={RiFilter3Fill}
                    >
                      筛选
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      leadingIcon={RiAddFill}
                    >
                      新建订单
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="flex w-full flex-col gap-4 pb-4">
            <StatCards variant="footer" />
            <div className="grid gap-4 xl:grid-cols-2">
              <RevenueChartCard />
              <OrdersChartCard />
            </div>
            <section className="overflow-hidden rounded-2xl border border-separator-border bg-background-secondary-default">
              <div className="border-b border-separator-border px-4 py-3">
                <h2 className="text-title-3-medium text-text-primary">最近订单</h2>
                <p className="mt-0.5 text-body-2-regular text-text-secondary">
                  支持搜索、筛选、排序与分页的客户订单表。
                </p>
              </div>
              <div className="p-3 sm:p-4">
                <DataTableExample pageSize={5} showSizeToggle={false} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
