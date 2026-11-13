"use client";

import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Two opposing horizontal tracks — top L→R, bottom R→L.
 *
 *   <MarqueePaired
 *     topChildren={<><Chip>A</Chip><Chip>B</Chip></>}
 *     bottomChildren={<><Chip>C</Chip><Chip>D</Chip></>}
 *   />
 *
 * Or pass `children` and they will be split across the two rails.
 */

export interface MarqueePairedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  /** Explicit top-rail content (overrides the first half of `children`). */
  topChildren?: ReactNode;
  /** Explicit bottom-rail content (overrides the second half of `children`). */
  bottomChildren?: ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  /** Pause both rails while hovered. */
  pauseOnHover?: boolean;
  /** Fade the start/end edges. */
  fade?: boolean;
  /** How many times to repeat each rail (min 2). */
  repeat?: number;
  /** Gap between items (CSS length). Default `1rem`. */
  gap?: string | number;
  ref?: Ref<HTMLDivElement>;
}

function MarqueeRail({
  children,
  reverse,
  copies,
  gapValue,
}: {
  children: ReactNode;
  reverse?: boolean;
  copies: number;
  gapValue: string;
}) {
  return (
    <div className="relative flex w-full overflow-hidden">
      {Array.from({ length: copies }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cx(
            "bui-marquee-track flex shrink-0 items-center",
            reverse && "bui-marquee-reverse",
          )}
          style={{ gap: gapValue, paddingInlineEnd: gapValue }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export function MarqueePaired({
  children,
  topChildren,
  bottomChildren,
  className,
  duration = 28,
  pauseOnHover = true,
  fade = true,
  repeat = 2,
  gap = "1rem",
  style,
  ref,
  ...props
}: MarqueePairedProps) {
  const copies = Math.max(2, repeat);
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  const childArray = Children.toArray(children);
  const mid = Math.ceil(childArray.length / 2);
  const top = topChildren ?? childArray.slice(0, mid);
  const bottom = bottomChildren ?? childArray.slice(mid);

  return (
    <div
      ref={ref}
      className={cx(
        "bui-marquee group relative flex w-full flex-col gap-3 overflow-hidden",
        fade && "bui-marquee-fade",
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
      <MarqueeRail copies={copies} gapValue={gapValue}>
        {top}
      </MarqueeRail>
      <MarqueeRail copies={copies} gapValue={gapValue} reverse>
        {bottom}
      </MarqueeRail>
    </div>
  );
}
