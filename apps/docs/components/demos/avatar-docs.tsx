"use client";

import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";

const SIZES = [
  { id: "xs" as const, label: "xs" },
  { id: "sm" as const, label: "sm" },
  { id: "md" as const, label: "md" },
  { id: "lg" as const, label: "lg" },
] as const;

const COLORS = [
  { id: "neutral" as const, initials: "N" },
  { id: "blue" as const, initials: "B" },
  { id: "lime" as const, initials: "L" },
  { id: "pink" as const, initials: "P" },
] as const;

export function AvatarSizePreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-6", className)}
      role="group"
      aria-label="头像尺寸"
    >
      {SIZES.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-2">
          <Avatar size={s.id} color="blue" initials="AJ" />
          <span className="text-caption-1-medium text-text-tertiary">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AvatarColorPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-6", className)}
      role="group"
      aria-label="头像色调"
    >
      {COLORS.map((c) => (
        <div key={c.id} className="flex flex-col items-center gap-2">
          <Avatar color={c.id} initials={c.initials} />
          <span className="text-caption-1-medium text-text-tertiary">{c.id}</span>
        </div>
      ))}
    </div>
  );
}

export function AvatarRowScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <Avatar size="lg" color="lime" initials="林" />
      <div className="min-w-0">
        <p className="truncate text-body-medium text-text-primary">林晓</p>
        <p className="truncate text-caption-1-medium text-text-secondary">产品设计 · 在线</p>
      </div>
    </div>
  );
}
