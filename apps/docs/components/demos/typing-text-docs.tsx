"use client";

import { TypingText } from "@/components/base/typing-text/typing-text";
import { cx } from "@/utils/cx";

export function TypingTextLoopPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-col items-start gap-4 text-body-medium text-text-primary", className)}>
      <TypingText text="正在连接模型…" speed={36} caret />
      <TypingText text="准备就绪" speed={48} loop loopDelay={1200} caret />
    </div>
  );
}
