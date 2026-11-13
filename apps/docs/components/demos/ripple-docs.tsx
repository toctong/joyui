"use client";

import { Button } from "@/components/base/buttons/button";
import { Ripple } from "@/components/base/ripple/ripple";
import { cx } from "@/utils/cx";

export function RippleTonePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-4", className)}>
      <Ripple className="rounded-2lg text-accent-500">
        <Button>主色涟漪</Button>
      </Ripple>
      <Ripple className="rounded-2lg text-text-primary">
        <Button variant="secondary">次要涟漪</Button>
      </Ripple>
      <Ripple disabled className="rounded-2lg text-accent-500">
        <Button variant="ghost">关闭涟漪</Button>
      </Ripple>
    </div>
  );
}
