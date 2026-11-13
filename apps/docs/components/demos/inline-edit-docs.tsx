"use client";

import { useState } from "react";
import { InlineEdit } from "@/components/base/inline-edit/inline-edit";
import { cx } from "@/utils/cx";

export function InlineEditSavePreview({ className }: { className?: string }) {
  const [value, setValue] = useState("季度报告");
  return (
    <div className={cx("flex w-full max-w-sm flex-col gap-2", className)}>
      <InlineEdit value={value} onSave={setValue} emptyLabel="未命名" />
      <p className="text-body-2-regular text-text-secondary">已保存：{value}</p>
    </div>
  );
}
