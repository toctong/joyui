"use client";

import type { HTMLAttributes, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Orbiting orbs — Libraries.dev “thinking orbs” energy for AI wait states,
 * drawn with JoyUI accent tokens (same cue as DotLoader / Progress).
 *
 *   <ThinkingOrbs aria-label="思考中" />
 */

export type ThinkingOrbsSize = "sm" | "md" | "lg";

export interface ThinkingOrbsProps extends HTMLAttributes<HTMLSpanElement> {
  size?: ThinkingOrbsSize;
  ref?: Ref<HTMLSpanElement>;
}

const styles = sortCx({
  root: "bui-thinking-orbs relative inline-flex shrink-0 text-accent-500",
  size: {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  },
});

export function ThinkingOrbs({
  size = "md",
  className,
  ref,
  "aria-label": ariaLabel = "Thinking",
  ...props
}: ThinkingOrbsProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      className={cx(styles.root, styles.size[size], className)}
      {...props}
    >
      <span aria-hidden className="bui-thinking-orbs-core absolute inset-[34%] rounded-full bg-current opacity-90" />
      <span aria-hidden className="bui-thinking-orbs-ring absolute inset-0">
        <span className="bui-thinking-orbs-orb absolute left-1/2 top-0 size-[28%] -translate-x-1/2 rounded-full bg-current" />
        <span className="bui-thinking-orbs-orb absolute bottom-[8%] left-[8%] size-[22%] rounded-full bg-current opacity-75" />
        <span className="bui-thinking-orbs-orb absolute bottom-[8%] right-[8%] size-[18%] rounded-full bg-current opacity-55" />
      </span>
    </span>
  );
}
