"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Soft light that rides the border of a card — landing / AI showcase energy
 * without leaving JoyUI tokens. Wrap any surface; the beam is decorative
 * (`aria-hidden`) and respects reduced motion.
 *
 *   <BorderBeam className="rounded-2xl">
 *     <Card className="relative z-10">…</Card>
 *   </BorderBeam>
 */

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Border thickness in px. */
  borderWidth?: number;
  /** Full lap duration in seconds. */
  duration?: number;
  /** Delay before the first lap (seconds). */
  delay?: number;
  /** Beam colour; defaults to accent. */
  color?: string;
  /** Soft trailing colour; defaults to a lighter accent mix. */
  colorFrom?: string;
  ref?: Ref<HTMLDivElement>;
}

export function BorderBeam({
  children,
  className,
  borderWidth = 1.5,
  duration = 8,
  delay = 0,
  color,
  colorFrom,
  style,
  ref,
  ...props
}: BorderBeamProps) {
  const vars = {
    "--bui-border-beam-width": `${borderWidth}px`,
    "--bui-border-beam-duration": `${duration}s`,
    "--bui-border-beam-delay": `${delay}s`,
    "--bui-border-beam-color": color ?? "var(--color-accent-500)",
    "--bui-border-beam-from": colorFrom ?? "var(--color-accent-300)",
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx("bui-border-beam relative isolate overflow-hidden rounded-[inherit]", className)}
      style={vars}
      {...props}
    >
      {children}
      <span aria-hidden className="bui-border-beam-glow pointer-events-none absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
