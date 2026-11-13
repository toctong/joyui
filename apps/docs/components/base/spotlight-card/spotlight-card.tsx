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
import { cx, sortCx } from "@/utils/cx";

/**
 * Card that follows the pointer with a soft radial wash — Bencho-style
 * micro-interaction on JoyUI Card surfaces.
 *
 *   <SpotlightCard>
 *     <p className="text-body-medium">Feature title</p>
 *   </SpotlightCard>
 */

export type SpotlightCardPadding = "sm" | "md" | "lg";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Spotlight radius in px. */
  size?: number;
  /** Spotlight colour (defaults to accent at low alpha). */
  color?: string;
  padding?: SpotlightCardPadding;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  // Mirror Card `outline` so spotlight tiles sit next to real Cards.
  base: "bui-spotlight-card relative isolate overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
  padding: {
    sm: "p-3",
    md: "p-4",
    lg: "p-6 sm:p-8",
  },
});

export function SpotlightCard({
  children,
  className,
  size = 260,
  color,
  padding = "md",
  style,
  onMouseMove,
  onMouseLeave,
  ref,
  ...props
}: SpotlightCardProps) {
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
    color ?? "color-mix(in oklab, var(--color-accent-500) 18%, transparent)";

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cx(styles.base, styles.padding[padding], className)}
      style={
        {
          "--bui-spotlight-x": `${pos.x}px`,
          "--bui-spotlight-y": `${pos.y}px`,
          "--bui-spotlight-size": `${size}px`,
          "--bui-spotlight-color": spotColor,
          "--bui-spotlight-opacity": pos.on ? "1" : "0",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span aria-hidden className="bui-spotlight-card-glow pointer-events-none absolute inset-0" />
      <div className="relative z-10 min-w-0">{children}</div>
    </div>
  );
}
