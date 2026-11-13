"use client";

import { Steps } from "@/components/base/steps/steps";
import { cx } from "@/utils/cx";

const DEMO_STEPS = [
  { title: "账号", description: "Cookie" },
  { title: "片源", description: "TMDB" },
  { title: "完成", description: "确认" },
] as const;

export function StepsHorizontalPreview({ className }: { className?: string }) {
  return (
    <Steps
      current={1}
      orientation="horizontal"
      className={cx("w-full max-w-xl", className)}
      steps={DEMO_STEPS}
    />
  );
}

export function StepsVerticalPreview({ className }: { className?: string }) {
  return (
    <Steps
      current={1}
      orientation="vertical"
      className={cx("w-full max-w-xs", className)}
      steps={DEMO_STEPS}
    />
  );
}
