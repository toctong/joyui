"use client";

import { QrCode } from "@/components/base/qr-code/qr-code";
import { cx } from "@/utils/cx";

export function QrCodeLevelPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-center gap-6", className)}>
      {(["L", "M", "Q", "H"] as const).map((level) => (
        <div key={level} className="flex flex-col items-center gap-2">
          <QrCode value="https://www.joyui.top" size={120} level={level} className="text-text-primary" />
          <span className="text-caption-1-medium text-text-tertiary">{level}</span>
        </div>
      ))}
    </div>
  );
}

export function QrCodeOverlayPreview({ className }: { className?: string }) {
  return (
    <QrCode
      className={cx("text-text-primary", className)}
      value="https://www.joyui.top"
      size={160}
      level="H"
      overlay={
        <span className="flex size-9 items-center justify-center rounded-lg bg-background-primary-default text-caption-1-medium text-text-brand-primary shadow-xs">
          Joy
        </span>
      }
    />
  );
}
