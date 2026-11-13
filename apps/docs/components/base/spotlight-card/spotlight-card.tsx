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
import { cx } from "@/utils/cx";

/**
 * Card that follows the pointer with a soft radial wash — Bencho-style
 * micro-interaction for feature tiles without leaving JoyUI tokens.
 *
 *   <SpotlightCard>
 *     <p>Feature title</p>
 *   </SpotlightCard>
 */

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Spotlight radius in px. */
  size?: number;
  /** Spotlight colour (defaults to accent at low alpha). */
  color?: string;
  ref?: Ref<HTMLDivElement>;
}

export function SpotlightCard({
  children,
  className,
  size = 280,
  color,
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

  const spotColor = color ?? "color-mix(in oklab, var(--color-accent-500) 28%, transparent)";

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cx(
        "bui-spotlight-card relative isolate overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default p-5 dark:bg-background-secondary-default",
        className,
      )}
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
