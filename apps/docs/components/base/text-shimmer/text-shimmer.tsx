import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Sweeping highlight across text — Bencho / Watermelon loading copy and
 * AI “thinking” labels without a spinner.
 *
 *   <TextShimmer>Generating reply…</TextShimmer>
 *
 * Note: agent-log also exports a private-style `ShimmerText` helper; prefer
 * this base `TextShimmer` for product UI.
 */

export interface TextShimmerProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** Full sweep duration in seconds. */
  duration?: number;
  ref?: Ref<HTMLSpanElement>;
}

export function TextShimmer({
  children,
  className,
  duration = 2.4,
  style,
  ref,
  ...props
}: TextShimmerProps) {
  return (
    <span
      ref={ref}
      className={cx("bui-shimmer-text inline-block text-body-medium text-text-secondary", className)}
      style={
        {
          "--bui-shimmer-duration": `${duration}s`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </span>
  );
}
