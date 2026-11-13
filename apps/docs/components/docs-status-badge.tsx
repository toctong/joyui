import type { ReactNode } from "react";

const LABELS: Record<string, string> = {
  new: "New",
  beta: "Beta",
  experimental: "实验",
  deprecated: "弃用",
};

/**
 * Sidebar status chip for fumadocs `statusBadgesPlugin`.
 * Uses JoyUI `badge-new` tokens so light/dark stay in sync.
 */
export function DocsStatusBadge({ status }: { status: string }): ReactNode {
  const label = LABELS[status] ?? status;
  const isNew = status === "new";

  return (
    <span
      data-status={status}
      className={
        isNew
          ? "ms-auto inline-flex shrink-0 items-center rounded-sm bg-badge-new-background px-1 py-px text-[10px] leading-4 font-semibold tracking-wide text-badge-new-text uppercase"
          : "ms-auto inline-flex shrink-0 items-center rounded-sm bg-fd-muted px-1 py-px text-[10px] leading-4 font-semibold tracking-wide text-fd-muted-foreground uppercase"
      }
    >
      {label}
    </span>
  );
}
