"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Concentric listening rings — wrap a mic / voice button while the agent
 * is recording. Accent via currentColor (same as DotLoader).
 *
 *   <VoiceRing active>
 *     <Button iconOnly leadingIcon={RiMicLine} aria-label="语音" />
 *   </VoiceRing>
 */

export interface VoiceRingProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pulse rings when true. */
  active?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  root: "bui-voice-ring relative inline-flex items-center justify-center text-accent-500",
  ring: "bui-voice-ring-pulse pointer-events-none absolute inset-0 rounded-full border border-current",
});

export function VoiceRing({
  children,
  active = false,
  className,
  ref,
  ...props
}: VoiceRingProps) {
  return (
    <div
      ref={ref}
      data-active={active || undefined}
      className={cx(styles.root, className)}
      {...props}
    >
      {active ? (
        <>
          <span aria-hidden className={cx(styles.ring, "bui-voice-ring-pulse-1")} />
          <span aria-hidden className={cx(styles.ring, "bui-voice-ring-pulse-2")} />
        </>
      ) : null}
      <span className="relative z-[1] inline-flex">{children}</span>
    </div>
  );
}
