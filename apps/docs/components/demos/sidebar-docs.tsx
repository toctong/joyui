"use client";

import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { cx } from "@/utils/cx";

/**
 * Docs preview — in-flow, height follows content. The landing `SidebarPreview`
 * uses absolute + fixed `h-[732px]` + hover-scroll for the gallery card; inside
 * DemoFrame that left a tall empty canvas and a clipped nav.
 */
export function DocsSidebarPreview({ className }: { className?: string }) {
  return (
    <div className={cx("mx-auto w-full max-w-[280px]", className)}>
      <DashboardSidebar fluid showThemeToggle={false} className="h-auto" />
    </div>
  );
}
