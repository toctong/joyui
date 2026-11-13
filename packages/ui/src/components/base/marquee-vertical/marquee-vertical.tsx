"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Vertical infinite strip — logos / chips rising continuously.
 *
 *   <MarqueeVertical className="h-48">
 *     <Chip>React</Chip>
 *     <Chip>Tailwind</Chip>
 *   </MarqueeVertical>
 */

export interface MarqueeVerticalProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Seconds for one full pass of the duplicated track. */
  duration?: number;
  /** Reverse direction (descend instead of rise). */
  reverse?: boolean;
  /** Pause the loop while hovered. */
  pauseOnHover?: boolean;
  /** Fade the top/bottom edges. */
  fade?: boolean;
  /** How many times to repeat children for a seamless loop (min 2). */
  repeat?: number;
  /** Gap between items (CSS length). Default `1rem`. */
  gap?: string | number;
  ref?: Ref<HTMLDivElement>;
}

export function MarqueeVertical({
  children,
  className,
  duration = 28,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  repeat = 2,
  gap = "1rem",
  style,
  ref,
  ...props
}: MarqueeVerticalProps) {
  const copies = Math.max(2, repeat);
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <div
      ref={ref}
      className={cx(
        "bui-marquee-vertical group relative flex h-full w-full flex-col overflow-hidden",
        fade && "bui-marquee-vertical-fade",
        pauseOnHover && "bui-marquee-pause",
        className,
      )}
      style={
        {
          "--bui-marquee-duration": `${duration}s`,
          "--bui-marquee-gap": gapValue,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {Array.from({ length: copies }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cx(
            "bui-marquee-vertical-track flex shrink-0 flex-col items-center",
            reverse && "bui-marquee-reverse",
          )}
          style={{ gap: gapValue, paddingBottom: gapValue }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
