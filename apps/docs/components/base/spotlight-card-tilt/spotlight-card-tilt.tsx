"use client";

import {
  useCallback,
  useEffect,
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
 * Spotlight card with subtle pointer-driven 3D tilt.
 * Same surface language as SpotlightCard; tilt stays soft (≤8°) and
 * respects prefers-reduced-motion.
 *
 *   <SpotlightCardTilt>
 *     <p className="text-body-medium">Feature title</p>
 *   </SpotlightCardTilt>
 */

export type SpotlightCardTiltPadding = "sm" | "md" | "lg";

export interface SpotlightCardTiltProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Spotlight radius in px. */
  size?: number;
  /** Spotlight colour (defaults to accent at low alpha). */
  color?: string;
  /** Max tilt in degrees on each axis. Default 7. */
  maxTilt?: number;
  padding?: SpotlightCardTiltPadding;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  base: "bui-spotlight-card relative isolate overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default shadow-sm will-change-transform dark:bg-background-secondary-default",
  padding: {
    sm: "p-3",
    md: "p-4",
    lg: "p-6 sm:p-8",
  },
});

export function SpotlightCardTilt({
  children,
  className,
  size = 260,
  color,
  maxTilt = 7,
  padding = "md",
  style,
  onMouseMove,
  onMouseLeave,
  ref,
  ...props
}: SpotlightCardTiltProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPos({ x, y, on: true });
      if (!reduceMotion) {
        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;
        setTilt({
          rx: -ny * maxTilt,
          ry: nx * maxTilt,
        });
      }
    }
    onMouseMove?.(event);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    setPos((p) => ({ ...p, on: false }));
    setTilt({ rx: 0, ry: 0 });
    onMouseLeave?.(event);
  };

  const spotColor =
    color ?? "color-mix(in oklab, var(--color-accent-500) 16%, transparent)";

  return (
    <div
      className="[perspective:900px]"
      style={{ perspectiveOrigin: "50% 50%" }}
    >
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
            transform: reduceMotion
              ? undefined
              : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: reduceMotion
              ? undefined
              : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        <span
          aria-hidden
          className="bui-spotlight-card-glow pointer-events-none absolute inset-0"
        />
        <div className="relative z-10 min-w-0">{children}</div>
      </div>
    </div>
  );
}
