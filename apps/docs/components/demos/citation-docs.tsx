"use client";

import { Citation } from "@/components/base/citation/citation";
import { cx } from "@/utils/cx";

export function CitationLinkPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-center justify-center gap-2", className)}
      role="group"
      aria-label="引用来源"
    >
      <Citation index={1} title="JoyUI docs" href="https://www.joyui.top" />
      <Citation index={2} title="Agent handbook" />
      <Citation index={3} title="Internal wiki" href="#" showIcon={false} />
    </div>
  );
}

export function CitationRowScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-2-regular text-text-secondary">
        根据知识库检索，建议优先使用 Pattern A 的 DemoFrame 结构。
      </p>
      <div className="flex flex-wrap gap-2">
        <Citation index={1} title="JoyUI docs" href="https://www.joyui.top" />
        <Citation index={2} title="组件规范" href="#" />
      </div>
    </div>
  );
}
