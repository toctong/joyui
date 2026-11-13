"use client";

import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";

const COLORS = [
  { id: "primary" as const, label: "12" },
  { id: "neutral" as const, label: "3" },
  { id: "brand" as const, label: "New" },
  { id: "success" as const, label: "OK" },
  { id: "warning" as const, label: "2" },
  { id: "error" as const, label: "99+" },
];

export function BadgeColorPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-4", className)}
      role="group"
      aria-label="徽章颜色"
    >
      {COLORS.map((c) => (
        <div key={c.id} className="flex flex-col items-center gap-2">
          <Badge color={c.id}>{c.label}</Badge>
          <span className="text-caption-1-medium text-text-tertiary">{c.id}</span>
        </div>
      ))}
    </div>
  );
}

export function BadgeNavScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-xs flex-col gap-1 rounded-2xl border border-separator-border bg-background-primary-default p-3 shadow-xs",
        className,
      )}
    >
      {[
        { label: "收件箱", count: "12", color: "primary" as const, active: true },
        { label: "待处理", count: "3", color: "warning" as const, active: false },
        { label: "已归档", count: "48", color: "neutral" as const, active: false },
      ].map((item) => (
        <div
          key={item.label}
          className={cx(
            "flex items-center justify-between rounded-lg px-3 py-2",
            item.active ? "bg-accent-500 text-white" : "text-text-primary",
          )}
        >
          <span className="text-body-medium">{item.label}</span>
          <Badge color={item.active ? "primary" : item.color} className={item.active ? "bg-white/20 text-white" : undefined}>
            {item.count}
          </Badge>
        </div>
      ))}
    </div>
  );
}
