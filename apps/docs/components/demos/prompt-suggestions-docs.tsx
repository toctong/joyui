"use client";

import { useState } from "react";
import { PromptSuggestions } from "@/components/base/prompt-suggestions/prompt-suggestions";
import { cx } from "@/utils/cx";

const SUGGESTIONS = ["总结本周任务", "生成周报草稿", "解释失败原因", "优化命名规则"];

export function PromptSuggestionsSelectPreview({ className }: { className?: string }) {
  const [picked, setPicked] = useState("总结本周任务");
  return (
    <div className={cx("flex w-full max-w-lg flex-col gap-3", className)}>
      <PromptSuggestions
        label="试试问"
        suggestions={SUGGESTIONS}
        onSelect={setPicked}
      />
      <p className="text-body-2-regular text-text-secondary">已选：{picked}</p>
    </div>
  );
}
