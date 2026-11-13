"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Infinite horizontal strip for logos, chips, or short testimonials —
 * the kind of motion strip HeroUI / beUI landings use for social proof.
 *
 *   <Marquee pauseOnHover>
 *     <Chip>React</Chip>
 *     <Chip>Tailwind</Chip>
 *   </Marquee>
 */

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Seconds for one full pass of the duplicated track. */
  duration?: number;
  /** Reverse direction (RTL-friendly default still mirrors via CSS). */
  reverse?: boolean;
  /** Pause the loop while hovered. */
  pauseOnHover?: boolean;
  /** Fade the start/end edges. */
  fade?: boolean;
  /** How many times to repeat children for a seamless loop (min 2). */
  repeat?: number;
  ref?: Ref<HTMLDivElement>;
}

export function Marquee({
  children,
  className,
  duration = 28,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  repeat = 2,
  style,
  ref,
  ...props
}: MarqueeProps) {
  const copies = Math.max(2, repeat);

  return (
    <div
      ref={ref}
      className={cx(
        "bui-marquee group relative flex w-full overflow-hidden",
        fade && "bui-marquee-fade",
        pauseOnHover && "bui-marquee-pause",
        className,
      )}
      style={
        {
          "--bui-marquee-duration": `${duration}s`,
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
            "bui-marquee-track flex shrink-0 items-center gap-4 pe-4",
            reverse && "bui-marquee-reverse",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
