"use client";

import { Switch } from "@/components/base/switch/switch";
import { SwitchCard } from "@/components/base/switch/switch-card";
import { cx } from "@/utils/cx";

const SIZES = [
  { id: "sm" as const, label: "sm" },
  { id: "md" as const, label: "md" },
  { id: "lg" as const, label: "lg" },
] as const;

export function SwitchSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-8", className)}
      role="group"
      aria-label="开关尺寸"
    >
      {SIZES.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-2">
          <Switch size={s.id} defaultSelected>
            {s.label}
          </Switch>
          <span className="text-caption-1-medium text-text-tertiary">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SwitchShapePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-8", className)}
      role="group"
      aria-label="开关形状"
    >
      <div className="flex flex-col items-center gap-2">
        <Switch shape="pill" defaultSelected>
          胶囊
        </Switch>
        <span className="text-caption-1-medium text-text-tertiary">pill</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Switch shape="rectangle" defaultSelected>
          直角
        </Switch>
        <span className="text-caption-1-medium text-text-tertiary">rectangle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Switch isDisabled>禁用</Switch>
        <span className="text-caption-1-medium text-text-tertiary">disabled</span>
      </div>
    </div>
  );
}

export function SwitchCardScenario({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-2", className)}>
      <SwitchCard
        title="邮件通知"
        description="任务完成或失败时发送邮件"
        defaultSelected
      />
      <SwitchCard title="自动重试" description="失败后最多重试 3 次" />
    </div>
  );
}
