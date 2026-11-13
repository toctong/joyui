import type { HTMLAttributes, Ref } from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Three bouncing dots — Watermelon / Bencho loading without a spinner ring.
 *
 *   <DotLoader aria-label="加载中" />
 */

export type DotLoaderSize = "sm" | "md" | "lg";

export interface DotLoaderProps extends HTMLAttributes<HTMLSpanElement> {
  size?: DotLoaderSize;
  ref?: Ref<HTMLSpanElement>;
}

const styles = sortCx({
  // Spinner / Progress use accent via currentColor — keep the same cue.
  root: "bui-dot-loader inline-flex items-center gap-1.5 text-accent-500",
  size: {
    sm: "[&>span]:size-1",
    md: "[&>span]:size-1.5",
    lg: "[&>span]:size-2",
  },
});

export function DotLoader({
  size = "md",
  className,
  ref,
  "aria-label": ariaLabel = "Loading",
  ...props
}: DotLoaderProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      className={cx(styles.root, styles.size[size], className)}
      {...props}
    >
      <span aria-hidden className="bui-dot-loader-dot rounded-full bg-current" />
      <span aria-hidden className="bui-dot-loader-dot rounded-full bg-current" />
      <span aria-hidden className="bui-dot-loader-dot rounded-full bg-current" />
    </span>
  );
}
