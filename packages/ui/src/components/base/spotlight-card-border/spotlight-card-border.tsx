"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Spotlight card with a soft conic border beam chasing the edge.
 * Combines pointer-follow wash + BorderBeam-style masked spin — no purple glow.
 *
 *   <SpotlightCardBorder>
 *     <p className="text-body-medium">Pro feature</p>
 *   </SpotlightCardBorder>
 */

export type SpotlightCardBorderPadding = "sm" | "md" | "lg";

export interface SpotlightCardBorderProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Spotlight radius in px. */
  size?: number;
  /** Spotlight colour (defaults to accent at low alpha). */
  color?: string;
  /** Border beam thickness in px. */
  borderWidth?: number;
  /** Full lap duration in seconds. */
  duration?: number;
  /** Beam colour; defaults to accent. */
  beamColor?: string;
  /** Soft trailing colour. */
  beamFrom?: string;
  padding?: SpotlightCardBorderPadding;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  base: "bui-spotlight-card relative isolate overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
  padding: {
    sm: "p-3",
    md: "p-4",
    lg: "p-6 sm:p-8",
  },
});

export function SpotlightCardBorder({
  children,
  className,
  size = 240,
  color,
  borderWidth = 1.5,
  duration = 9,
  beamColor,
  beamFrom,
  padding = "md",
  style,
  onMouseMove,
  onMouseLeave,
  ref,
  ...props
}: SpotlightCardBorderProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = localRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        on: true,
      });
    }
    onMouseMove?.(event);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    setPos((p) => ({ ...p, on: false }));
    onMouseLeave?.(event);
  };

  const spotColor =
    color ?? "color-mix(in oklab, var(--color-accent-500) 14%, transparent)";

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cx(
        "bui-border-beam relative isolate overflow-hidden rounded-2xl",
        className,
      )}
      style={
        {
          "--bui-spotlight-x": `${pos.x}px`,
          "--bui-spotlight-y": `${pos.y}px`,
          "--bui-spotlight-size": `${size}px`,
          "--bui-spotlight-color": spotColor,
          "--bui-spotlight-opacity": pos.on ? "1" : "0",
          "--bui-border-beam-width": `${borderWidth}px`,
          "--bui-border-beam-duration": `${duration}s`,
          "--bui-border-beam-color": beamColor ?? "var(--color-accent-500)",
          "--bui-border-beam-from": beamFrom ?? "var(--color-accent-300)",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className={cx(styles.base, styles.padding[padding], "border-0")}>
        <span
          aria-hidden
          className="bui-spotlight-card-glow pointer-events-none absolute inset-0"
        />
        <div className="relative z-10 min-w-0">{children}</div>
      </div>
      <span
        aria-hidden
        className="bui-border-beam-glow pointer-events-none absolute inset-0 rounded-[inherit]"
      />
    </div>
  );
}
