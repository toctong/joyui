"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/base/model-select/model-select";
import { cx } from "@/utils/cx";

const OPTIONS = [
  { id: "fable-5", label: "Fable 5", description: "均衡" },
  { id: "fable-5-fast", label: "Fable 5 Fast", description: "低延迟" },
  { id: "fable-reason", label: "Fable Reason", description: "深度推理", disabled: true },
];

export function ModelSelectSizePreview({ className }: { className?: string }) {
  const [a, setA] = useState("fable-5");
  const [b, setB] = useState("fable-5-fast");
  return (
    <div className={cx("flex flex-col items-center gap-6", className)}>
      <ModelSelect aria-label="中尺寸模型" options={OPTIONS} value={a} onChange={setA} size="medium" />
      <ModelSelect aria-label="小尺寸模型" options={OPTIONS} value={b} onChange={setB} size="small" />
    </div>
  );
}
