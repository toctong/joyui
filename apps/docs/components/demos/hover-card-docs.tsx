"use client";

import { Avatar } from "@/components/base/avatar/avatar";
import { HoverCard } from "@/components/base/hover-card/hover-card";
import { cx } from "@/utils/cx";

export function HoverCardDelayPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-8", className)}
      role="group"
      aria-label="悬停延迟"
    >
      <HoverCard
        openDelay={0}
        closeDelay={80}
        content={
          <p className="text-body-2-regular text-text-secondary">立即打开（openDelay=0）</p>
        }
      >
        <Avatar initials="快" color="blue" />
      </HoverCard>
      <HoverCard
        openDelay={400}
        closeDelay={200}
        content={
          <p className="text-body-2-regular text-text-secondary">较慢打开（openDelay=400）</p>
        }
      >
        <Avatar initials="慢" color="lime" />
      </HoverCard>
    </div>
  );
}

export function HoverCardProfileScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm items-center gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <HoverCard
        content={
          <div className="flex items-center gap-3">
            <Avatar size="lg" initials="JL" color="blue" />
            <div className="min-w-0">
              <p className="text-body-medium text-text-primary">Jordan Lee</p>
              <p className="text-body-2-regular text-text-secondary">Design · @jordan</p>
            </div>
          </div>
        }
      >
        <Avatar initials="JL" color="blue" />
      </HoverCard>
      <p className="text-body-2-regular text-text-secondary">
        悬停头像查看资料预览
      </p>
    </div>
  );
}
