"use client";

import { Barcode } from "@/components/base/barcode/barcode";
import { cx } from "@/utils/cx";

export function BarcodeFormatPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-4", className)}
      role="group"
      aria-label="条码格式"
    >
      <Barcode value="MH-2026-0312" format="CODE128" />
      <Barcode value="5901234123457" format="EAN13" height={48} />
    </div>
  );
}

export function BarcodeDisplayPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex flex-wrap items-end justify-center gap-4", className)}
      role="group"
      aria-label="条码显示"
    >
      <Barcode value="TICKET-8841" displayValue height={56} />
      <Barcode value="TICKET-8841" displayValue={false} height={56} />
    </div>
  );
}

export function BarcodeTicketScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="w-full text-center">
        <p className="text-body-medium text-text-primary">入场凭证</p>
        <p className="text-caption-1-medium text-text-secondary">扫码核销 · CODE128</p>
      </div>
      <Barcode value="JOY-GATE-2026" format="CODE128" height={56} aria-label="入场条码 JOY-GATE-2026" />
    </div>
  );
}
