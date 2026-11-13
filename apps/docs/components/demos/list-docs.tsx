"use client";

import { Chip } from "@/components/base/badges/chip";
import { List, ListItem } from "@/components/base/list/list";
import { cx } from "@/utils/cx";

export function ListInteractivePreview({ className }: { className?: string }) {
  return (
    <List className={cx("w-full max-w-md", className)}>
      <ListItem
        title="admin@marhub.local"
        description="primary · transfer"
        trailing={<Chip color="lime" variant="subtle">ok</Chip>}
      />
      <ListItem
        title="CloudSaver"
        description="插件端点"
        interactive
        trailing={<Chip color="neutral" variant="subtle">off</Chip>}
      />
      <ListItem
        title="Webhook"
        description="事件推送"
        interactive
        trailing={<Chip color="cyan" variant="subtle">live</Chip>}
      />
    </List>
  );
}

export function ListLeadingPreview({ className }: { className?: string }) {
  return (
    <List divided={false} className={cx("w-full max-w-md", className)}>
      <ListItem
        leading={<span className="flex size-8 items-center justify-center rounded-full bg-accent-100 text-caption-1-medium text-accent-700">A</span>}
        title="账号同步"
        description="每 15 分钟"
      />
      <ListItem
        leading={<span className="flex size-8 items-center justify-center rounded-full bg-background-secondary-default text-caption-1-medium text-text-secondary">B</span>}
        title="失败重试"
        description="最多 3 次"
      />
    </List>
  );
}
