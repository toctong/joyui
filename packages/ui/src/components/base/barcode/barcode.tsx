"use client";

import {
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type Ref,
} from "react";
import JsBarcode from "jsbarcode";
import { cx } from "../../../utils/cx";

/**
 * 1D barcode rendered to SVG via `jsbarcode` (JoyUI dependency).
 * Defaults to CODE128 — good for tickets, SKUs, and tracking numbers.
 */

export type BarcodeFormat =
  | "CODE128"
  | "CODE128A"
  | "CODE128B"
  | "CODE128C"
  | "EAN13"
  | "EAN8"
  | "EAN5"
  | "EAN2"
  | "UPC"
  | "CODE39"
  | "ITF14"
  | "MSI"
  | "pharmacode"
  | "codabar";

export interface BarcodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: string;
  format?: BarcodeFormat;
  /** Bar height in px. */
  height?: number;
  /** Module width in px. */
  width?: number;
  displayValue?: boolean;
  /** Bar colour. */
  lineColor?: string;
  background?: string;
  fontSize?: number;
  /** Accessible name. */
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Barcode({
  value,
  format = "CODE128",
  height = 64,
  width = 2,
  displayValue = true,
  lineColor = "currentColor",
  background = "transparent",
  fontSize = 14,
  "aria-label": ariaLabel,
  className,
  ref,
  ...props
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reactId = useId();
  const label = ariaLabel ?? (value ? `Barcode ${value}` : "Empty barcode");

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Clear previous drawing when value/format changes.
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!value) return;
    try {
      JsBarcode(svg, value, {
        format,
        height,
        width,
        displayValue,
        lineColor,
        background,
        fontSize,
        margin: 8,
        xmlDocument: document,
      });
    } catch {
      // Invalid value for the chosen format — leave SVG empty.
    }
  }, [background, displayValue, fontSize, format, height, lineColor, value, width]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cx(
        "inline-flex max-w-full overflow-x-auto rounded-xl border border-border-secondary-default",
        "bg-background-primary-default p-3 text-text-primary",
        className,
      )}
      {...props}
    >
      <svg ref={svgRef} id={reactId} aria-hidden className="max-w-full" />
    </div>
  );
}
