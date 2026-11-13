"use client";

import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";

export function DropdownGroupPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center justify-center", className)}>
      <Dropdown>
        <DropdownTrigger className="rounded-lg border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-medium text-text-primary shadow-xs outline-none">
          添加
        </DropdownTrigger>
        <DropdownPopover aria-label="添加菜单">
          <DropdownGroup label="内容">
            <DropdownItem>新建文档</DropdownItem>
            <DropdownItem>上传文件</DropdownItem>
          </DropdownGroup>
          <DropdownDivider />
          <DropdownGroup label="协作">
            <DropdownItem>邀请成员</DropdownItem>
          </DropdownGroup>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}

export function DropdownSelectedPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center justify-center", className)}>
      <Dropdown>
        <DropdownTrigger className="rounded-lg border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-medium text-text-primary shadow-xs outline-none">
          视图
        </DropdownTrigger>
        <DropdownPopover aria-label="视图选项">
          <DropdownItem selected>列表</DropdownItem>
          <DropdownItem>看板</DropdownItem>
          <DropdownItem>日历</DropdownItem>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}

export function DropdownToolbarScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-3 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">项目 Alpha</p>
      <Dropdown>
        <DropdownTrigger className="rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-secondary-default">
          更多
        </DropdownTrigger>
        <DropdownPopover aria-label="项目操作">
          <DropdownItem>重命名</DropdownItem>
          <DropdownItem>复制链接</DropdownItem>
          <DropdownDivider />
          <DropdownItem>归档</DropdownItem>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}
