"use client";

import { useMemo, type HTMLAttributes, type ReactNode, type Ref } from "react";
import QRCode from "qrcode";
import { cx } from "@/utils/cx";

/**
 * QR code as an inline SVG. Value is encoded with the `qrcode` package
 * (shipped as a JoyUI dependency). Works for share links, login tickets, etc.
 */

export type QrCodeLevel = "L" | "M" | "Q" | "H";

export interface QrCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Payload to encode (URL, text, Wi-Fi string, …). */
  value: string;
  /** Outer box size in px. */
  size?: number;
  /** Quiet-zone modules around the code. */
  margin?: number;
  /** Error-correction level. */
  level?: QrCodeLevel;
  /** Module (dark) colour — any CSS colour. */
  color?: string;
  /** Background colour. */
  backgroundColor?: string;
  /** Optional centre overlay (logo / avatar). Keep small so scanners still work. */
  overlay?: ReactNode;
  title?: string;
  ref?: Ref<HTMLDivElement>;
}

export function QrCode({
  value,
  size = 160,
  margin = 2,
  level = "M",
  color = "currentColor",
  backgroundColor = "transparent",
  overlay,
  title,
  className,
  ref,
  ...props
}: QrCodeProps) {
  const model = useMemo(() => {
    if (!value) return null;
    try {
      return QRCode.create(value, { errorCorrectionLevel: level });
    } catch {
      return null;
    }
  }, [level, value]);

  const modules = model?.modules;
  const count = modules?.size ?? 0;
  const cells = count + margin * 2;
  const cell = count > 0 ? size / cells : 0;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={title ?? (value ? `QR code for ${value}` : "Empty QR code")}
      className={cx(
        "relative inline-flex shrink-0 text-text-primary",
        "rounded-xl border border-border-secondary-default bg-background-primary-default p-2",
        className,
      )}
      {...props}
    >
      {modules && count > 0 ? (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          shapeRendering="crispEdges"
          aria-hidden
        >
          <rect width={size} height={size} fill={backgroundColor} />
          {Array.from({ length: count }, (_, row) =>
            Array.from({ length: count }, (_, col) => {
              if (!modules.get(row, col)) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={(col + margin) * cell}
                  y={(row + margin) * cell}
                  width={cell}
                  height={cell}
                  fill={color}
                />
              );
            }),
          )}
        </svg>
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center text-caption-1-regular text-text-tertiary"
        >
          —
        </div>
      )}
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-background-primary-default p-1 shadow-xs ring-1 ring-border-secondary-default">
            {overlay}
          </div>
        </div>
      ) : null}
    </div>
  );
}
