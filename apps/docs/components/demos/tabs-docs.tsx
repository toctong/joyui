"use client";

import { useState } from "react";
import { RiFolder3Line, RiSettings3Line, RiTeamLine } from "@remixicon/react";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { PillTab, PillTabList } from "@/components/base/tabs/pill-tab";
import { cx } from "@/utils/cx";

export function TabsCountPreview({ className }: { className?: string }) {
  return (
    <Tabs defaultSelectedKey="files" className={cx("w-full max-w-md", className)}>
      <TabList aria-label="工作区">
        <Tab id="files" icon={RiFolder3Line} count={24}>
          文件
        </Tab>
        <Tab id="members" icon={RiTeamLine} count={8}>
          成员
        </Tab>
        <Tab id="settings" icon={RiSettings3Line}>
          设置
        </Tab>
      </TabList>
      <TabPanel id="files">
        <p className="text-body-2-regular text-text-secondary">项目文件与共享链接。</p>
      </TabPanel>
      <TabPanel id="members">
        <p className="text-body-2-regular text-text-secondary">邀请与权限管理。</p>
      </TabPanel>
      <TabPanel id="settings">
        <p className="text-body-2-regular text-text-secondary">命名规则与通知偏好。</p>
      </TabPanel>
    </Tabs>
  );
}

export function TabsPillPreview({ className }: { className?: string }) {
  const [selected, setSelected] = useState("changes");
  return (
    <div className={cx("flex flex-col items-center gap-4", className)}>
      <PillTabList aria-label="视图切换">
        <PillTab variant="blue" isSelected={selected === "changes"} onSelect={() => setSelected("changes")}>
          变更
        </PillTab>
        <PillTab variant="blue" isSelected={selected === "browser"} onSelect={() => setSelected("browser")}>
          浏览器
        </PillTab>
      </PillTabList>
      <PillTabList aria-label="筛选">
        <PillTab variant="gray" isSelected={selected === "all"} onSelect={() => setSelected("all")}>
          全部
        </PillTab>
        <PillTab variant="gray" isSelected={selected === "mine"} onSelect={() => setSelected("mine")}>
          我的
        </PillTab>
        <PillTab variant="gray" isSelected={selected === "shared"} onSelect={() => setSelected("shared")}>
          共享
        </PillTab>
      </PillTabList>
    </div>
  );
}

export function TabsSettingsScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "w-full max-w-md rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <Tabs defaultSelectedKey="general">
        <TabList aria-label="设置分区">
          <Tab id="general">通用</Tab>
          <Tab id="billing" count={2}>
            账单
          </Tab>
          <Tab id="security">安全</Tab>
        </TabList>
        <TabPanel id="general">
          <p className="text-body-2-regular text-text-secondary">语言、时区与外观。</p>
        </TabPanel>
        <TabPanel id="billing">
          <p className="text-body-2-regular text-text-secondary">有 2 张发票待处理。</p>
        </TabPanel>
        <TabPanel id="security">
          <p className="text-body-2-regular text-text-secondary">密码与二次验证。</p>
        </TabPanel>
      </Tabs>
    </div>
  );
}
