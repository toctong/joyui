"use client";

import { Chip } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";

const COLORS = [
  "orange",
  "lime",
  "rose",
  "yellow",
  "cyan",
  "blue",
  "purple",
  "neutral",
  "gray",
  "soft",
] as const;

const VARIANTS = [
  { id: "bold" as const, label: "进行中" },
  { id: "subtle" as const, label: "¥128" },
  { id: "caption" as const, label: "管理员" },
];

export function ChipColorPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-2", className)}
      role="group"
      aria-label="标签颜色"
    >
      {COLORS.map((color) => (
        <Chip key={color} color={color}>
          {color}
        </Chip>
      ))}
    </div>
  );
}

export function ChipVariantPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-6", className)}
      role="group"
      aria-label="标签变体"
    >
      {VARIANTS.map((v) => (
        <div key={v.id} className="flex flex-col items-center gap-2">
          <Chip variant={v.id} color={v.id === "caption" ? "soft" : "lime"}>
            {v.label}
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">{v.id}</span>
        </div>
      ))}
    </div>
  );
}

export function ChipScenarioPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-medium text-text-primary">季度报告.pdf</p>
        <Chip color="lime" variant="bold">
          已完成
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip color="cyan" variant="subtle">
          +12.4%
        </Chip>
        <Chip color="soft" variant="caption">
          财务
        </Chip>
        <Chip color="yellow" variant="caption">
          待审核
        </Chip>
      </div>
    </div>
  );
}
