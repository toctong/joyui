"use client";

import { Card } from "@/components/base/card/card";
import { Reveal } from "@/components/base/reveal/reveal";
import { cx } from "@/utils/cx";

export function RevealFromPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-2xl grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {(["up", "down", "left", "right"] as const).map((from) => (
        <Reveal key={from} from={from} delay={40}>
          <Card className="p-4 text-center text-body-medium text-text-primary">{from}</Card>
        </Reveal>
      ))}
    </div>
  );
}

export function RevealDelayPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-3", className)}>
      <Reveal delay={0}><Card className="p-4 text-body-medium">延迟 0ms</Card></Reveal>
      <Reveal delay={160}><Card className="p-4 text-body-medium">延迟 160ms</Card></Reveal>
      <Reveal delay={320}><Card className="p-4 text-body-medium">延迟 320ms</Card></Reveal>
    </div>
  );
}
