"use client";

import { Button } from "@/components/base/buttons/button";
import { Magnetic } from "@/components/base/magnetic/magnetic";
import { cx } from "@/utils/cx";

export function MagneticStrengthPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-8 py-6", className)}>
      <Magnetic strength={12} radius={80}>
        <Button variant="secondary">轻吸力</Button>
      </Magnetic>
      <Magnetic strength={28} radius={120}>
        <Button>强吸力</Button>
      </Magnetic>
    </div>
  );
}
