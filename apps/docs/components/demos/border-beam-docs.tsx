"use client";

import { BorderBeam } from "@/components/base/border-beam/border-beam";
import { Card } from "@/components/base/card/card";
import { cx } from "@/utils/cx";

export function BorderBeamSpeedPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-2xl gap-4 md:grid-cols-2", className)}>
      <BorderBeam className="rounded-2xl" duration={5}>
        <Card className="relative z-10 p-5">
          <p className="text-body-medium text-text-primary">快速 · 5s</p>
          <p className="mt-1 text-body-2-regular text-text-secondary">适合强调磁贴</p>
        </Card>
      </BorderBeam>
      <BorderBeam className="rounded-2xl" duration={12} delay={0.4}>
        <Card className="relative z-10 p-5">
          <p className="text-body-medium text-text-primary">缓慢 · 12s</p>
          <p className="mt-1 text-body-2-regular text-text-secondary">适合背景氛围</p>
        </Card>
      </BorderBeam>
    </div>
  );
}
