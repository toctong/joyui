"use client";

import { Card } from "@/components/base/card/card";
import { cx } from "@/utils/cx";

const VARIANTS = [
  { id: "outline" as const, label: "描边" },
  { id: "soft" as const, label: "柔和" },
  { id: "ghost" as const, label: "透明" },
] as const;

const PADDINGS = [
  { id: "sm" as const, label: "sm" },
  { id: "md" as const, label: "md" },
  { id: "lg" as const, label: "lg" },
] as const;

export function CardVariantPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("grid w-full max-w-2xl gap-3 sm:grid-cols-3", className)}
      role="group"
      aria-label="卡片变体"
    >
      {VARIANTS.map((v) => (
        <Card key={v.id} variant={v.id} padding="md" className="min-h-24">
          <p className="text-body-medium text-text-primary">{v.label}</p>
          <p className="mt-1 text-caption-1-medium text-text-tertiary">{v.id}</p>
        </Card>
      ))}
    </div>
  );
}

export function CardPaddingPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("grid w-full max-w-2xl gap-3 sm:grid-cols-3", className)}
      role="group"
      aria-label="卡片内边距"
    >
      {PADDINGS.map((p) => (
        <Card key={p.id} padding={p.id} className="border-dashed">
          <p className="text-body-medium text-text-primary">padding=&quot;{p.label}&quot;</p>
          <p className="mt-1 text-body-2-regular text-text-secondary">内容区块</p>
        </Card>
      ))}
    </div>
  );
}

export function CardFormScenario({ className }: { className?: string }) {
  return (
    <Card
      variant="outline"
      padding="lg"
      className={cx("grid w-full max-w-md gap-3", className)}
    >
      <div>
        <p className="text-title-2-medium text-text-primary">项目设置</p>
        <p className="mt-1 text-body-2-regular text-text-secondary">名称与可见性</p>
      </div>
      <div className="h-9 rounded-lg border border-border-secondary-default bg-background-secondary-default/40" />
      <div className="h-9 rounded-lg border border-border-secondary-default bg-background-secondary-default/40" />
    </Card>
  );
}
