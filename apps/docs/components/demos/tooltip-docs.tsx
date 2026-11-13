"use client";

import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export function TooltipSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-6", className)}
      role="group"
      aria-label="工具提示尺寸"
    >
      <TooltipTrigger delay={0}>
        <Button variant="secondary" size="small">
          小号
        </Button>
        <Tooltip size="sm">快捷说明 · sm</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={0}>
        <Button variant="secondary" size="small">
          中号
        </Button>
        <Tooltip size="md">更长一点的说明文案 · md</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={0}>
        <Button variant="secondary" size="small">
          无箭头
        </Button>
        <Tooltip showArrow={false}>关闭箭头</Tooltip>
      </TooltipTrigger>
    </div>
  );
}

export function TooltipPlacementPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-4", className)}
      role="group"
      aria-label="工具提示方位"
    >
      {(
        [
          ["top", "上方"],
          ["bottom", "下方"],
          ["left", "左侧"],
          ["right", "右侧"],
        ] as const
      ).map(([placement, label]) => (
        <TooltipTrigger key={placement} delay={0}>
          <Button variant="ghost" size="small">
            {label}
          </Button>
          <Tooltip placement={placement}>{label}提示</Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  );
}

export function TooltipToolbarScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex items-center gap-2 rounded-2xl border border-separator-border bg-background-primary-default p-3 shadow-xs",
        className,
      )}
    >
      <TooltipTrigger delay={0}>
        <Button variant="secondary" size="small">
          复制链接
        </Button>
        <Tooltip>复制到剪贴板</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={0}>
        <Button variant="ghost" size="small">
          归档
        </Button>
        <Tooltip>移入归档，可随时恢复</Tooltip>
      </TooltipTrigger>
    </div>
  );
}
