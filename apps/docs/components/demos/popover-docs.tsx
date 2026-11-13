"use client";

import { Button } from "@/components/base/buttons/button";
import {
  Popover,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/base/popover/popover";
import { cx } from "@/utils/cx";

export function PopoverArrowPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-4", className)}
      role="group"
      aria-label="气泡箭头"
    >
      <PopoverTrigger>
        <Button variant="secondary" size="small">
          带箭头
        </Button>
        <Popover showArrow aria-label="带箭头说明">
          <p className="text-body-2-regular text-text-secondary">showArrow 指向触发器。</p>
        </Popover>
      </PopoverTrigger>
      <PopoverTrigger>
        <Button variant="ghost" size="small">
          无箭头
        </Button>
        <Popover aria-label="无箭头说明">
          <p className="text-body-2-regular text-text-secondary">默认不绘制箭头。</p>
        </Popover>
      </PopoverTrigger>
    </div>
  );
}

export function PopoverHeaderPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center justify-center", className)}>
      <PopoverTrigger>
        <Button variant="secondary" size="small">
          分享
        </Button>
        <Popover>
          <PopoverHeader title="分享看板" description="复制链接或邀请协作者。" />
          <p className="text-body-2-regular break-all text-text-secondary">
            https://www.joyui.top/share/demo
          </p>
          <PopoverFooter>
            <Button variant="ghost" size="xs">
              取消
            </Button>
            <Button size="xs">复制链接</Button>
          </PopoverFooter>
        </Popover>
      </PopoverTrigger>
    </div>
  );
}

export function PopoverShareScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-body-medium text-text-primary">季度增长</p>
        <p className="text-caption-1-medium text-text-secondary">仅团队可见</p>
      </div>
      <PopoverTrigger>
        <Button variant="secondary" size="small">
          分享
        </Button>
        <Popover showArrow>
          <PopoverHeader title="分享此图表" description="获得只读链接。" />
          <PopoverFooter>
            <Button size="xs">复制链接</Button>
          </PopoverFooter>
        </Popover>
      </PopoverTrigger>
    </div>
  );
}
