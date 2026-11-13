"use client";

import { Collapsible } from "@/components/base/collapsible/collapsible";
import { cx } from "@/utils/cx";

export function CollapsibleBasicPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-md", className)}>
      <Collapsible title="高级筛选">
        可按状态、负责人与更新时间缩小结果范围。
      </Collapsible>
    </div>
  );
}

export function CollapsibleExpandedPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-md", className)}>
      <Collapsible title="隐私说明" defaultExpanded>
        仅工作区成员可见；导出操作会写入审计日志。
      </Collapsible>
    </div>
  );
}

export function CollapsibleSettingsScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">项目设置</p>
      <Collapsible title="高级选项">
        开启实验性功能前，请确认团队已完成兼容性测试。
      </Collapsible>
    </div>
  );
}
