"use client";

import { useState, type ReactNode } from "react";
import {
  RiBarChartBoxLine,
  RiFileList3Line,
  RiGroupLine,
  RiHomeLine,
  RiSettings4Line,
  RiSparklingLine,
} from "@remixicon/react";
import {
  Sidebar,
  SidebarBrand,
  SidebarCollapseButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarSection,
  type SidebarNavItem,
} from "@/components/application/sidebar/sidebar";
import { Avatar } from "@/components/base/avatar/avatar";
import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { cx } from "@/utils/cx";

const PRIMARY: SidebarNavItem[] = [
  { key: "home", label: "概览", icon: RiHomeLine, badge: 3 },
  { key: "team", label: "团队", icon: RiGroupLine },
  { key: "docs", label: "文档", icon: RiFileList3Line },
  { key: "insights", label: "洞察", icon: RiBarChartBoxLine },
];

function Frame({
  label,
  children,
  className,
  tall = true,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <p className="text-caption-1-medium text-text-tertiary">{label}</p>
      <div
        className={cx(
          "overflow-hidden rounded-2xl border border-separator-border bg-background-full p-3",
          tall ? "h-[420px]" : "min-h-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Default docs hero — floating composable sidebar. */
export function DocsSidebarPreview({ className }: { className?: string }) {
  const [selected, setSelected] = useState("home");
  return (
    <div className={cx("mx-auto w-full max-w-[280px]", className)}>
      <Sidebar variant="floating" className="h-[440px]">
        <SidebarHeader>
          <SidebarBrand icon={RiSparklingLine} label="JoyUI" />
          <SidebarCollapseButton />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav
            items={PRIMARY}
            selected={selected}
            onSelect={setSelected}
          />
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon={RiSettings4Line} label="设置" />
          <div className="flex items-center gap-2 rounded-2xl bg-background-tertiary-default p-2">
            <Avatar size="sm" initials="LX" color="blue" />
            <div className="min-w-0">
              <p className="truncate text-body-2-medium text-text-primary">
                刘晓迪
              </p>
              <p className="truncate text-caption-1-regular text-text-tertiary">
                Admin
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export function DocsSidebarVariantsPreview() {
  const [selected, setSelected] = useState("home");
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <Frame label="floating · 可折叠">
        <Sidebar variant="floating" className="h-full">
          <SidebarHeader>
            <SidebarBrand icon={RiSparklingLine} label="JoyUI" />
            <SidebarCollapseButton />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav
              items={PRIMARY}
              selected={selected}
              onSelect={setSelected}
            />
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={RiSettings4Line} label="设置" />
          </SidebarFooter>
        </Sidebar>
      </Frame>

      <Frame label="inset · 贴边">
        <div className="flex h-full overflow-hidden rounded-xl border border-separator-border bg-background-full">
          <Sidebar variant="inset" className="h-full">
            <SidebarHeader>
              <SidebarBrand icon={RiSparklingLine} label="Workspace" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav
                items={PRIMARY}
                selected={selected}
                onSelect={setSelected}
              />
            </SidebarContent>
            <SidebarFooter>
              <SidebarItem icon={RiSettings4Line} label="设置" />
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-1 items-center justify-center text-body-regular text-text-tertiary">
            主内容区
          </div>
        </div>
      </Frame>

      <Frame label="rail · 图标栏">
        <Sidebar variant="rail" className="h-full">
          <SidebarHeader>
            <SidebarBrand icon={RiSparklingLine} label="JoyUI" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav
              items={PRIMARY}
              selected={selected}
              onSelect={setSelected}
            />
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={RiSettings4Line} label="设置" />
          </SidebarFooter>
        </Sidebar>
      </Frame>

      <Frame label="grouped · 分组导航">
        <Sidebar variant="floating" className="h-full">
          <SidebarHeader>
            <SidebarBrand icon={RiSparklingLine} label="Console" />
            <SidebarCollapseButton />
          </SidebarHeader>
          <SidebarContent>
            <SidebarSection title="工作区">
              <SidebarItem
                icon={RiHomeLine}
                label="概览"
                selected={selected === "home"}
                onClick={() => setSelected("home")}
                badge={3}
              />
              <SidebarItem
                icon={RiGroupLine}
                label="团队"
                selected={selected === "team"}
                onClick={() => setSelected("team")}
              />
            </SidebarSection>
            <SidebarSection title="洞察">
              <SidebarItem
                icon={RiBarChartBoxLine}
                label="报表"
                selected={selected === "insights"}
                onClick={() => setSelected("insights")}
              />
              <SidebarItem
                icon={RiFileList3Line}
                label="文档"
                selected={selected === "docs"}
                onClick={() => setSelected("docs")}
              />
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={RiSettings4Line} label="设置" />
          </SidebarFooter>
        </Sidebar>
      </Frame>
    </div>
  );
}

/** Top navigation bar morphologies. */
export function DocsSidebarHorizontalPreview() {
  const [selected, setSelected] = useState("home");
  return (
    <div className="flex w-full flex-col gap-4">
      <Frame label="horizontal · 顶栏导航" tall={false}>
        <div className="overflow-hidden rounded-xl border border-separator-border bg-background-full">
          <Sidebar variant="horizontal">
            <SidebarHeader>
              <SidebarBrand icon={RiSparklingLine} label="JoyUI" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav
                items={PRIMARY}
                selected={selected}
                onSelect={setSelected}
              />
            </SidebarContent>
            <SidebarFooter>
              <SidebarItem icon={RiSettings4Line} label="设置" />
              <Avatar size="sm" initials="LX" color="blue" />
            </SidebarFooter>
          </Sidebar>
          <div className="flex h-40 items-center justify-center text-body-regular text-text-tertiary">
            主内容区
          </div>
        </div>
      </Frame>

      <Frame label="horizontal · 分组顶栏" tall={false}>
        <div className="overflow-hidden rounded-xl border border-separator-border bg-background-full">
          <Sidebar variant="horizontal">
            <SidebarHeader>
              <SidebarBrand icon={RiSparklingLine} label="Console" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarSection title="工作区">
                <SidebarItem
                  icon={RiHomeLine}
                  label="概览"
                  selected={selected === "home"}
                  onClick={() => setSelected("home")}
                  badge={3}
                />
                <SidebarItem
                  icon={RiGroupLine}
                  label="团队"
                  selected={selected === "team"}
                  onClick={() => setSelected("team")}
                />
              </SidebarSection>
              <SidebarSection title="洞察">
                <SidebarItem
                  icon={RiBarChartBoxLine}
                  label="报表"
                  selected={selected === "insights"}
                  onClick={() => setSelected("insights")}
                />
                <SidebarItem
                  icon={RiFileList3Line}
                  label="文档"
                  selected={selected === "docs"}
                  onClick={() => setSelected("docs")}
                />
              </SidebarSection>
            </SidebarContent>
            <SidebarFooter>
              <Avatar size="sm" initials="LX" color="blue" />
            </SidebarFooter>
          </Sidebar>
          <div className="flex h-40 items-center justify-center text-body-regular text-text-tertiary">
            主内容区
          </div>
        </div>
      </Frame>
    </div>
  );
}

/** Full dashboard chrome (search / team / theme) — existing template. */
export function DocsDashboardSidebarPreview({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cx("mx-auto w-full max-w-[280px]", className)}>
      <DashboardSidebar fluid showThemeToggle={false} className="h-auto" />
    </div>
  );
}
