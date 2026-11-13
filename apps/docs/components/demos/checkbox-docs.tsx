"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { CheckboxCard } from "@/components/base/checkbox/checkbox-card";
import { cx } from "@/utils/cx";

export function CheckboxStatePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-col items-start gap-3", className)}
      role="group"
      aria-label="复选框状态"
    >
      <Checkbox>未选中</Checkbox>
      <Checkbox defaultSelected>已选中</Checkbox>
      <Checkbox isIndeterminate>半选</Checkbox>
      <Checkbox isDisabled>禁用</Checkbox>
      <Checkbox size="sm" defaultSelected>
        小号 sm
      </Checkbox>
    </div>
  );
}

export function CheckboxCardScenario({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-2", className)}>
      <CheckboxCard
        title="包含字幕"
        description="下载外挂字幕文件（若有）"
        defaultSelected
      />
      <CheckboxCard title="保留原文件夹结构" description="按网盘目录层级落盘" />
      <CheckboxCard title="仅视频" description="跳过图片与文档" isDisabled />
    </div>
  );
}
