"use client";

import { RiAddLine, RiArrowRightLine, RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const VARIANTS = [
  { id: "primary" as const, label: "Primary" },
  { id: "secondary" as const, label: "Secondary" },
  { id: "ghost" as const, label: "Ghost" },
  { id: "danger" as const, label: "Danger" },
];

const SIZES = [
  { id: "medium" as const, label: "Medium" },
  { id: "small" as const, label: "Small" },
  { id: "xs" as const, label: "Xs" },
];

export function ButtonVariantPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-3", className)}
      role="group"
      aria-label="按钮变体"
    >
      {VARIANTS.map((v) => (
        <div key={v.id} className="flex flex-col items-center gap-2">
          <Button variant={v.id}>{v.label}</Button>
          <span className="text-caption-1-medium text-text-tertiary">{v.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ButtonSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-6", className)}
      role="group"
      aria-label="按钮尺寸"
    >
      {SIZES.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-2">
          <Button size={s.id}>Continue</Button>
          <span className="text-caption-1-medium text-text-tertiary">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ButtonIconPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-3", className)}>
      <Button leadingIcon={RiAddLine}>New project</Button>
      <Button variant="secondary" trailingIcon={RiArrowRightLine}>
        Continue
      </Button>
      <Button iconOnly leadingIcon={RiAddLine} aria-label="添加" variant="secondary" />
      <Button iconOnly leadingIcon={RiDeleteBinLine} aria-label="删除" variant="danger" />
    </div>
  );
}

export function ButtonToolbarScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">草稿已保存</p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="small">
          取消
        </Button>
        <Button variant="secondary" size="small">
          存为模板
        </Button>
        <Button size="small" trailingIcon={RiArrowRightLine}>
          发布
        </Button>
      </div>
    </div>
  );
}
